import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useNavContext, useVideoContext } from '../hooks';

import { HomeScreen } from './HomeScreen';
import { VideoCategoryScreen } from './VideoCategoryScreen';
import { VideoListScreen } from './VideoListScreen';
import { VideoPlayScreen } from './VideoPlayScreen';
import { VideoDetailScreen } from './VideoDetailScreen';

export const Screen = () => {
  const { page } = useNavContext();
  const { state } = useVideoContext();

  return (
    <>
      {state.loading && (
        <ActivityIndicator
          color={'#4287f5'}
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
