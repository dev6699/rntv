// import "react-native-tvos"
import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator } from 'react-native';

import { useVideo, VideoContext, useDownload, DownloadContext } from './src/hooks';
import { Screen } from './src/screens';
import { theme } from './src/utils';

const App = () => {
  const video = useVideo();
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
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.blackA(),
          }}>
          {error !== '' && <Error text={error} />}
          {video.state.loading && video.state.init && (
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
          <Screen />
        </SafeAreaView>
      </DownloadContext.Provider>
    </VideoContext.Provider>
  );
};

const Error: React.FC<{ text: string }> = ({ text }) => {
  return (
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
        {text}
      </Text>
    </View>
  )
}
export default App;
