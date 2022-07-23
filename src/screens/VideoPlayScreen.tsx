import React from 'react';
import { View } from 'react-native';

import { VideoPlayer } from '../components';
import { useVideoContext } from '../hooks';

export const VideoPlayScreen: React.FC = () => {
  const { state } = useVideoContext();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}>
      <VideoPlayer uri={state.playVideoUrl} />
    </View>
  );
};
