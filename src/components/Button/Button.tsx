import React from 'react';
import { Text, TextStyle, TouchableHighlight, ViewStyle } from 'react-native';

export const Button: React.FC<{
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}> = ({ onPress, text, style, textStyle }) => {
  return (
    <TouchableHighlight
      underlayColor={'rgba(255, 255, 255, 0.2)'}
      style={{
        padding: 5,
        marginRight: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onPress={onPress}>
      <Text
        style={{
          padding: 8,
          fontSize: 18,
          color: 'white',
          ...textStyle,
        }}>
        {text}
      </Text>
    </TouchableHighlight>
  );
};
