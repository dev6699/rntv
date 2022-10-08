import React from 'react';
import { Animated, Text } from 'react-native';

import { useVideoPlayerContext } from './useVideoPlayer';
import { BackButton } from '../BackButton';
import { Button } from '../Button';

export const TopBar: React.FC<{
  title: string;
  hasNext: boolean;
  playNext(): void;
}> = ({ title, hasNext, playNext }) => {
  const {
    refs: { animationsRef },
  } = useVideoPlayerContext();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        opacity: animationsRef.current.controlBar.opacity,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <BackButton />
      <Text style={{ fontSize: 20, marginLeft: 10, color: 'white', flex: 1 }}>
        {title}
      </Text>
      {hasNext && (
        <Button
          onPress={playNext}
          text={'下集'}
          style={{
            marginLeft: 'auto',
            marginRight: 10,
            marginVertical: 0,
            alignSelf: 'flex-start',
          }}
        />
      )}
    </Animated.View>
  );
};
