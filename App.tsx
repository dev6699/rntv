import 'react-native/tvos-types.d';
import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, View, Text, } from 'react-native';

import { useNav, NavContext, useVideo, VideoContext, useDownload, DownloadContext } from './src/hooks';
import { Screen } from './src/screens';
import { theme } from './src/utils';

const App = () => {
  const nav = useNav();
  const video = useVideo(nav);
  const download = useDownload({ getVideoUrl: video.actions.getVideoUrl });

  const error = video.state.error;
  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      video.actions.setError('');
    }, 1000);
  }, [error]);

  return (
    <VideoContext.Provider value={video}>
      <DownloadContext.Provider value={download}>
        <NavContext.Provider value={nav}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: theme.blackA(),
            }}>
            {error ? (
              <View
                style={{
                  padding: 10,
                  alignItems: 'center',
                  backgroundColor: theme.warn,
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme.whiteA(),
                  }}>
                  {error}
                </Text>
              </View>
            ) : null}
            {video.state.init ? (
              <Screen />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={100} color={theme.primary} />
              </View>
            )}
          </SafeAreaView>
        </NavContext.Provider>
      </DownloadContext.Provider>
    </VideoContext.Provider>
  );
};

export default App;
