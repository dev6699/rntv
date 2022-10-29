import React from 'react';
import { Text, TextStyle, TouchableHighlight, ViewStyle } from 'react-native';
import { theme } from '../../utils';

export const Button: React.FC<{
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}> = ({ onPress, text, style, textStyle }) => {
  return (
    <TouchableHighlight
      underlayColor={theme.whiteA(0.2)}
      style={{
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onPress={onPress}>
      <Text
        style={{
          padding: 8,
          fontSize: 18,
          color: theme.whiteA(),
          ...textStyle,
        }}>
        {text}
      </Text>
    </TouchableHighlight>
  );
};
