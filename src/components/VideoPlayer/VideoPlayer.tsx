import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import { VideoPlayerContext, useVideoPlayer } from './useVideoPlayer';

import { Video } from './Video';
import { Error } from './Error';
import { Loader } from './Loader';
import { ControlBar } from './ControlBar';

export const VideoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
  const videoPlayerState = useVideoPlayer();
  const {
    state: { error, loading },
    events: { onScreenTouch },
  } = videoPlayerState;

  return (
    <VideoPlayerContext.Provider value={videoPlayerState}>
      <TouchableWithoutFeedback
        hasTVPreferredFocus={false}
        onPress={onScreenTouch}>
        <View
          style={{
            overflow: 'hidden',
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
      </TouchableWithoutFeedback>
    </VideoPlayerContext.Provider>
  );
};
