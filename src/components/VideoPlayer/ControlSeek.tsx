import React from 'react';
import { View } from 'react-native';
import { useVideoPlayerContext } from './useVideoPlayer';

export const ControlSeek: React.FC = () => {
  const { refs, state, seekPanResponder } = useVideoPlayerContext();
  return (
    <View
      {...seekPanResponder.panHandlers}
      style={{
        alignSelf: 'stretch',
        height: 28,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
      }}
      collapsable={false}>
      <View
        style={{
          backgroundColor: '#FFF',
          height: 1,
          position: 'relative',
          top: 14,
          width: '100%',
        }}
        onLayout={(event) => {
          refs.seekBarRef.current = event.nativeEvent.layout.width;
        }}
        pointerEvents={'none'}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'gray',
            height: 1,
            width: state.playablePosition,
          }}
          pointerEvents={'none'}
        />
        <View
          style={{
            backgroundColor: '#4287f5',
            height: 1,
            width: state.seekerPosition,
          }}
          pointerEvents={'none'}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          height: 28,
          width: 28,
          left: -6 + state.seekerPosition,
          display: 'flex',
          justifyContent: 'center',
        }}
        pointerEvents={'none'}>
        <View
          style={{
            borderRadius: 12,
            height: 12,
            width: 12,
            backgroundColor: '#4287f5',
          }}
          pointerEvents={'none'}
        />
      </View>
    </View>
  );
};
