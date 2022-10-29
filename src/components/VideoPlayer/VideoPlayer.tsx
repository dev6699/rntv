import React from 'react';
import { View } from 'react-native';

import { VideoPlayerContext, useVideoPlayer } from './useVideoPlayer';

import { Video } from './Video';
import { Error } from './Error';
import { Loader } from './Loader';
import { ControlBar } from './ControlBar';
import { TopBar } from './TopBar';
import { theme } from '../../utils';

export const VideoPlayer: React.FC<{
  url: string;
  title: string;
  hasNext: boolean;
  playNext(): void;
}> = ({ playNext, url, title, hasNext }) => {
  const videoPlayerState = useVideoPlayer();
  const {
    state: { error, loading, controlsShown },
  } = videoPlayerState;

  return (
    <VideoPlayerContext.Provider value={videoPlayerState}>
      <View
        style={{
          backgroundColor: theme.blackA(),
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'space-between',
        }}>
        <Video uri={url} />
        {controlsShown && (
          <TopBar title={title} playNext={playNext} hasNext={hasNext} />
        )}
        {controlsShown && <ControlBar />}
        {error && <Error />}
        {loading && <Loader />}
      </View>
    </VideoPlayerContext.Provider>
  );
};
