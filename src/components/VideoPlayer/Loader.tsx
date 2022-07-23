import React from 'react';
import { Animated, View } from 'react-native';

import { imgAssets } from '../../utils';
import { useVideoPlayerContext } from './useVideoPlayer';

export const Loader: React.FC = () => {
  const {
    refs: {
      animationsRef: {
        current: {
          loader: { rotate },
        },
      },
    },
  } = useVideoPlayerContext();

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.Image
        source={imgAssets.loader}
        style={{
          transform: [
            {
              rotate: rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      />
    </View>
  );
};
