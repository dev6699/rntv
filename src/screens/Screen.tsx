import React from 'react';
import { ActivityIndicator, Image, Platform, View } from 'react-native';

import { i18n } from '../../i18n';
import { Button } from '../components';
import { imgAssets, theme } from '../utils';
import { useNavContext, useVideoContext } from '../hooks';

import { HomeScreen } from './HomeScreen';
import { VideoListScreen } from './VideoListScreen';
import { VideoPlayScreen } from './VideoPlayScreen';
import { VideoDetailScreen } from './VideoDetailScreen';
import { VideoCategoryScreen } from './VideoCategoryScreen';
import { LibraryScreen } from './LibraryScreen';

export const Screen = () => {
  const { page, setPage } = useNavContext();
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
      {page === 'home' || page === 'library' ? (
        <>
          {page === 'home' ? <HomeScreen /> : <LibraryScreen />}
          {!Platform.isTV &&
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopColor: theme.whiteA(0.2),
                borderTopWidth: 1,
                marginTop: 'auto'
              }}>

              <Button
                touchStyle={{ flex: 1 }}
                style={{
                  flexDirection: 'column',
                  flex: 0,
                }}
                textStyle={{
                  padding: 0
                }}
                onPress={() => setPage('home')}
                icon={<Image
                  style={{ height: 24 }}
                  resizeMode='contain'
                  source={page === 'home' ? imgAssets.homeFill : imgAssets.homeLine} />}
                text={i18n.t('home')}
              />

              <Button
                touchStyle={{ flex: 1 }}
                style={{
                  flexDirection: 'column',
                  flex: 0,
                }}
                textStyle={{
                  padding: 0
                }}
                onPress={() => setPage('library')}
                icon={<Image
                  style={{ height: 24 }}
                  resizeMode='contain'
                  source={page === 'library' ? imgAssets.libraryFill : imgAssets.libraryLine} />}
                text={i18n.t('library')}
              />
            </View>
          }
        </>
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
