import 'react-native/tvos-types.d';
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Easing,
  View,
  Text,
} from 'react-native';

import { useNav, NavContext, useVideo, VideoContext } from './src/hooks';
import { Screen } from './src/screens';

const App = () => {
  const animation = useRef(new Animated.Value(0)).current;

  const boxInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255,255,255)', 'rgb(0,0,0)'],
  });

  const handleAnimation = () => {
    Animated.timing(animation, {
      useNativeDriver: false,
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  };

  useEffect(() => {
    handleAnimation();
  }, []);

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
        <SafeAreaView style={{ flex: 1 }}>
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
                }}>
                {error}
              </Text>
            </View>
          ) : null}
          <Animated.View
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: boxInterpolation,
            }}>
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
          </Animated.View>
        </SafeAreaView>
      </NavContext.Provider>
    </VideoContext.Provider>
  );
};

export default App;
