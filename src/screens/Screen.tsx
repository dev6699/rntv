import React from 'react';
import { ActivityIndicator } from 'react-native';

import { theme } from '../utils';
import { useNavContext, useVideoContext } from '../hooks';

import { HomeScreen } from './HomeScreen';
import { VideoListScreen } from './VideoListScreen';
import { VideoPlayScreen } from './VideoPlayScreen';
import { VideoDetailScreen } from './VideoDetailScreen';
import { VideoCategoryScreen } from './VideoCategoryScreen';

export const Screen = () => {
  const { page } = useNavContext();
  const { state } = useVideoContext();

  return (
    <>
      {state.loading && (
        <ActivityIndicator
          color={theme.primary}
          size={48}
          style={{
            right: 20,
            top: 20,
            alignSelf: 'flex-end',
            position: 'absolute',
            zIndex: 99,
          }}
        />
      )}
      {page === 'home' ? (
        <HomeScreen />
      ) : page === 'category' ? (
        <VideoCategoryScreen />
      ) : page === 'list' ? (
        <VideoListScreen />
      ) : page === 'play' ? (
        <VideoPlayScreen />
      ) : page === 'detail' ? (
        <VideoDetailScreen />
      ) : null}
    </>
  );
};
