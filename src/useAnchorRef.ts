import { useRef, useEffect } from 'react';
import { useScrollAnchorContext } from './Context';
import type { NativeComponent } from './useScrollAnchor';

export const useAnchorRef = (key: string) => {
  const { register, unregister } = useScrollAnchorContext();
  const ref = useRef<NativeComponent>(null);

  useEffect(() => {
    if (ref && ref.current) register(key, ref);
    return () => unregister(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, [key, ref.current]);

  return ref;
};
