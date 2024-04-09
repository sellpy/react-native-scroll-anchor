import React, { type ReactNode } from 'react';
import { type ScrollAnchorMethods } from './hooks/useScrollAnchor';

export const ScrollAnchorContext = React.createContext<ScrollAnchorMethods>({
  register: () => null,
  unregister: () => null,
  scrollTo: () => null,
  timeoutOnScroll: () => null,
  onScroll: () => null,
  anchorRefs: {},
});

export const ScrollAnchorProvider = ({
  children,
  ...methods
}: {
  children: ReactNode;
} & ScrollAnchorMethods) => {
  return (
    <ScrollAnchorContext.Provider value={methods}>
      {children}
    </ScrollAnchorContext.Provider>
  );
};

export const useScrollAnchorContext = () =>
  React.useContext(ScrollAnchorContext);
