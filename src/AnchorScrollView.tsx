import React, { useRef, type ReactNode } from 'react';
import { ScrollView } from 'react-native';
import type { ScrollAnchorOptions } from './useScrollAnchor';
import useScrollAnchor from './useScrollAnchor';
import { ScrollAnchorProvider } from './Context';

type ScrollViewProps = React.ComponentProps<typeof ScrollView>;
interface AnchorScrollViewProps {
  children: ReactNode;
  props: ScrollAnchorOptions & ScrollViewProps;
}

export const AnchorScrollView = ({
  children,
  props,
}: AnchorScrollViewProps) => {
  const ref = useRef<ScrollView>(null);

  const methods = useScrollAnchor(ref, props);

  return (
    <ScrollAnchorProvider {...methods}>
      <ScrollView
        {...props}
        ref={ref}
        onScroll={methods.onScroll}
        scrollEventThrottle={32}
      >
        {children}
      </ScrollView>
    </ScrollAnchorProvider>
  );
};
