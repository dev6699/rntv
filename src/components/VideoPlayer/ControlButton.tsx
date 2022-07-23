import React from 'react';
import { TouchableHighlight } from 'react-native';

export const ControlButton: React.FC<{ onPress?: () => void }> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableHighlight
      hasTVPreferredFocus={true}
      underlayColor={'gray'}
      onPress={onPress}
      style={{ padding: 16, borderRadius: 999 }}>
      {children}
    </TouchableHighlight>
  );
};
