import { Anchor } from './components/Anchor';
import {
  ScrollAnchorContext,
  ScrollAnchorProvider,
  useScrollAnchorContext,
} from './Context';
import { useAnchorRef } from './hooks/useAnchorRef';
import useScrollAnchor, {
  type ScrollAnchorMethods,
  type ScrollAnchorOptions,
} from './hooks/useScrollAnchor';

export {
  useScrollAnchor,
  useAnchorRef,
  useScrollAnchorContext,
  ScrollAnchorProvider,
  ScrollAnchorContext,
  Anchor,
};

export type { ScrollAnchorMethods, ScrollAnchorOptions };
