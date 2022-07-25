import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
//@ts-ignore
import RNVideo from 'react-native-video';
import { useVideoPlayerContext } from './useVideoPlayer';

export const Video: React.FC<{ uri: string }> = ({ uri }) => {
  const { state, refs, events } = useVideoPlayerContext();

  return (
    <TouchableWithoutFeedback
      hasTVPreferredFocus={false}
      onPress={events.onScreenTouch}>
      <RNVideo
        ref={refs.videoPlayerRef}
        resizeMode={'contain'}
        paused={state.paused}
        rate={state.rate}
        onLoadStart={events.onLoadStart}
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
    </TouchableWithoutFeedback>
  );
};
