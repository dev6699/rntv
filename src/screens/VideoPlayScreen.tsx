import React from 'react';
import { View } from 'react-native';

import { VideoPlayer } from '../components';
import { useVideoContext } from '../hooks';

export const VideoPlayScreen: React.FC = () => {
  const {
    state: { playingVideo },
    actions: { playNext, hasNext },
  } = useVideoContext();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}>
      {playingVideo && (
        <VideoPlayer
          playNext={playNext}
          hasNext={hasNext()}
          key={playingVideo.url}
          url={playingVideo.url}
          title={playingVideo.playTitle}
        />
      )}
    </View>
  );
};
