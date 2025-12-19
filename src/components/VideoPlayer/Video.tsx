import React from 'react';
import { View, Pressable } from 'react-native';
import RNVideo from 'react-native-video';
import { useVideoPlayerContext } from './useVideoPlayer';

export const Video: React.FC<{ uri: string }> = ({ uri }) => {
  const { state, refs, events } = useVideoPlayerContext();

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <RNVideo
        pointerEvents='none'
        controls={false}
        ref={refs.videoPlayerRef}
        resizeMode={'contain'}
        paused={state.paused}
        rate={state.rate}
        onProgress={events.onProgress}
        onError={events.onError}
        onLoad={events.onLoad}
        onEnd={() => {
          // TODO
          console.log('video ended, go to next or close');
        }}
        onSeek={events.onSeek}
        style={{
          height: '100%',
          width: '100%',
        }}
        source={{ uri }}
      />
      <Pressable
        onPress={events.onScreenTouch}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      />
    </View >

  );
};
