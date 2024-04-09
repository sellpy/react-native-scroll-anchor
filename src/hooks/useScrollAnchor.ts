import React, { Component, useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  type NativeMethods,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { throttle } from '../utils/throttle';
import { InvalidAnchorKey, InvalidRefError } from '../errors';
import { memoize } from '../utils/memoize';
import { debounce } from '../utils/debounce';

export type NativeComponent = Component<unknown> & NativeMethods;

export interface ScrollAnchorOptions {
  throttle?: number;
  offsetX?: number;
  offsetY?: number;
  onAnchorReachedX?: (key: string) => void;
  onAnchorReachedY?: (key: string) => void;
  keepInBounds?: boolean;
}

interface Coordinates {
  x: number;
  y: number;
}

export interface ScrollAnchorMethods {
  register: (key: string, ref: React.RefObject<NativeComponent>) => void;
  unregister: (key: string) => void;
  scrollTo: (key: string) => void;
  timeoutOnScroll: (timeMs: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  anchorRefs: Record<string, React.RefObject<NativeComponent>>;
}

const useScrollAnchor = (
  ref: React.RefObject<ScrollView>,
  {
    throttle: throttleMs = 200,
    offsetX = 0,
    offsetY = 0,
    onAnchorReachedX = () => null,
    onAnchorReachedY = () => null,
    keepInBounds = false,
  }: ScrollAnchorOptions = {}
): ScrollAnchorMethods => {
  const [anchorRefs, setAnchorRefs] = useState<{
    [key: string]: React.RefObject<NativeComponent>;
  }>({});

  const currentScrollPos = useRef({ x: 0, y: 0 });
  const scrollManuallyThrottled = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Memoized and throttle functions should not be recreated on re-renders
  const throttleScrollTo = useCallback(
    memoize((_anchorName) =>
      throttle((pos) => {
        ref.current?.scrollTo(pos);
      }, throttleMs)
    ),
    [throttleMs]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const releaseThrottle = useCallback(
    memoize((timeMs: number) =>
      debounce(() => (scrollManuallyThrottled.current = false), timeMs)
    ),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleOnScrollListeners = useCallback(
    throttle(
      (event: NativeSyntheticEvent<NativeScrollEvent>) =>
        _onScrollListeners(event),
      throttleMs
    ),
    [anchorRefs]
  );

  const _calculateAnchor = async (
    anchorRefs: Record<string, React.RefObject<NativeComponent>>,
    key: string
  ) => {
    const anchorRef = anchorRefs[key];
    if (!anchorRef)
      throw new InvalidAnchorKey(
        `Anchor ${key} not found. Consider running "register(ref, ${key})" to register the anchor.`
      );
    if (!anchorRef.current || !ref?.current)
      throw new InvalidRefError(
        `Missing ref for either anchor ${key} or parent ScrollView, component may have been unmounted before microtask was processed.`
      );

    const { x, y } = await _measure(anchorRef.current);
    const { x: scrollViewOffsetX, y: scrollViewOffsetY } = await _measure(
      ref.current as unknown as NativeComponent
    );

    return {
      x: x + currentScrollPos.current.x - scrollViewOffsetX,
      y: y + currentScrollPos.current.y - scrollViewOffsetY,
    };
  };

  const calculateAnchors = async (
    anchorRefs: Record<string, React.RefObject<NativeComponent>>
  ) => {
    const anchors: Record<string, Coordinates> = {};
    for (const key in anchorRefs) {
      const anchorPos = await _calculateAnchor(anchorRefs, key).catch((e) => {
        if (e instanceof InvalidRefError) return null;
        throw e;
      });
      if (!anchorPos) continue;
      anchors[key] = anchorPos;
    }

    return anchors;
  };

  const register = async (
    key: string,
    ref: React.RefObject<NativeComponent>
  ) => {
    if (!ref.current) throw new InvalidRefError('ScrollView ref is not set');

    setAnchorRefs((prevState) => ({ ...prevState, [key]: ref }));
  };

  const unregister = (key: string) =>
    setAnchorRefs((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });

  const _onScrollListeners = async (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const anchors = await calculateAnchors(anchorRefs);

    const yAnchorReached = _findReached({
      event,
      anchors,
      axis: 'y',
      keepInBounds,
    });
    const xAnchorReached = _findReached({
      event,
      anchors,
      axis: 'x',
      keepInBounds,
    });

    if (yAnchorReached) onAnchorReachedY(yAnchorReached);
    if (xAnchorReached) onAnchorReachedX(xAnchorReached);
  };

  const scrollTo = async (key: string) => {
    const anchor = await _calculateAnchor(anchorRefs, key).catch((e) => {
      if (e instanceof InvalidRefError) return null;
      throw e;
    });
    if (!anchor) return;

    throttleScrollTo(key)({ y: anchor.y + offsetY, x: anchor.x + offsetX });
  };

  const timeoutOnScroll = (timeMs: number) => {
    scrollManuallyThrottled.current = true;

    releaseThrottle(timeMs)();
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollPos.current = event.nativeEvent.contentOffset;

    if (scrollManuallyThrottled.current) return;
    event.persist();

    throttleOnScrollListeners(event);
  };

  return {
    register,
    unregister,
    scrollTo,
    timeoutOnScroll,
    onScroll,
    anchorRefs,
  };
};

const _findReached = ({
  event,
  anchors,
  axis,
  keepInBounds,
}: {
  event: NativeSyntheticEvent<NativeScrollEvent>;
  anchors: Record<string, Coordinates>;
  axis: 'x' | 'y';
  keepInBounds: boolean;
}) => {
  const position = event.nativeEvent.contentOffset[axis];
  const sortedAnchors = sortAnchors(anchors, axis, 'desc');

  for (const anchor in sortedAnchors) {
    if (position >= sortedAnchors[anchor]![axis]) {
      return anchor;
    }
  }

  const sortedAnchorKeys = Object.keys(sortedAnchors);
  return keepInBounds ? sortedAnchorKeys[sortedAnchorKeys.length - 1] : null;
};

type Axis = 'x' | 'y';
export const sortAnchors = (
  anchors: Record<string, Coordinates>,
  axis: Axis,
  order: 'asc' | 'desc'
): Record<string, Coordinates> => {
  const desc = (a: [string, Coordinates], b: [string, Coordinates]) =>
    b[1][axis] - a[1][axis];
  const asc = (a: [string, Coordinates], b: [string, Coordinates]) =>
    a[1][axis] - b[1][axis];

  const sortFn = order === 'desc' ? desc : asc;

  const sortedAnchors = Object.entries(anchors).sort(sortFn);

  return sortedAnchors.reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, Coordinates>
  );
};

const _measure = (ref: NativeMethods): Promise<Coordinates> =>
  new Promise((resolve) => {
    if (!ref)
      throw new InvalidRefError(
        'Reference was freed before microtask could be processed'
      );
    ref.measure((_localX, _localY, _width, _height, x, y) => {
      resolve({ x, y });
    });
  });

export default useScrollAnchor;
