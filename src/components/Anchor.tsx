import React from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useAnchorRef } from '../hooks/useAnchorRef';

export const Anchor = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  const ref = useAnchorRef(name);
  return (
    <View collapsable={false} ref={ref}>
      {children}
    </View>
  );
};
