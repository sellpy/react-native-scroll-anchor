import { useRef, useEffect } from 'react';
import { useScrollAnchorContext } from '../Context';
import type { NativeComponent } from './useScrollAnchor';

export const useAnchorRef = (name: string) => {
  const { register, unregister } = useScrollAnchorContext();
  const ref = useRef<NativeComponent>(null);

  useEffect(() => {
    if (ref && ref.current) register(name, ref);
    return () => unregister(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, [name, ref.current]);

  return ref;
};
