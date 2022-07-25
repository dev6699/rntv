import React from 'react';
import { View } from 'react-native';

import { VideoPlayerContext, useVideoPlayer } from './useVideoPlayer';

import { Video } from './Video';
import { Error } from './Error';
import { Loader } from './Loader';
import { ControlBar } from './ControlBar';

export const VideoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
  const videoPlayerState = useVideoPlayer();
  const {
    state: { error, loading },
  } = videoPlayerState;

  return (
    <VideoPlayerContext.Provider value={videoPlayerState}>
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'space-between',
        }}>
        <Video uri={uri} />
        <ControlBar />
        {error && <Error />}
        {loading && <Loader />}
      </View>
    </VideoPlayerContext.Provider>
  );
};
