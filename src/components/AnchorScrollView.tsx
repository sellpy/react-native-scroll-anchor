import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { ScrollAnchorProvider } from '../Context';
import type { ScrollAnchorOptions } from '../hooks/useScrollAnchor';
import useScrollAnchor from '../hooks/useScrollAnchor';

type ScrollViewProps = React.ComponentProps<typeof ScrollView>;

const AnchorScrollView = ({
  children,
  ...props
}: ScrollAnchorOptions & ScrollViewProps) => {
  const ref = useRef<ScrollView>(null);

  const methods = useScrollAnchor(ref, props);

  return (
    <ScrollAnchorProvider {...methods}>
      <ScrollView
        /* Default scrollEventThrottle to 32, consumer can override this with props */
        scrollEventThrottle={32}
        {...props}
        ref={ref}
        onScroll={methods.onScroll}
      >
        {children}
      </ScrollView>
    </ScrollAnchorProvider>
  );
};

export default AnchorScrollView;
