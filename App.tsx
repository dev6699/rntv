import 'react-native/tvos-types.d';
import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, View, Text } from 'react-native';

import { useNav, NavContext, useVideo, VideoContext } from './src/hooks';
import { Screen } from './src/screens';

const App = () => {
  const navState = useNav();
  const videoState = useVideo(navState);

  const error = videoState.state.error;
  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      videoState.actions.setError('');
    }, 1000);
  }, [error]);

  return (
    <VideoContext.Provider value={videoState}>
      <NavContext.Provider value={navState}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: 'black', paddingHorizontal: 10 }}>
          {error ? (
            <View
              style={{
                padding: 10,
                alignItems: 'center',
                backgroundColor: 'red',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {error}
              </Text>
            </View>
          ) : null}
          {videoState.state.init ? (
            <Screen />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={100} color="#4287f5" />
            </View>
          )}
        </SafeAreaView>
      </NavContext.Provider>
    </VideoContext.Provider>
  );
};

export default App;
