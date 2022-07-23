import React from 'react';
import {Image, Text, View} from 'react-native';
import {imgAssets} from '../../utils';

export const Error: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={imgAssets.error}
        style={{
          marginBottom: 16,
        }}
      />
      <Text
        style={{
          backgroundColor: 'transparent',
          color: '#f27474',
        }}>
        Video unavailable
      </Text>
    </View>
  );
};
