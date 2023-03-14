import React from 'react';
import { Text, View } from 'react-native';

import { theme } from '../utils';
import { useVideoContext } from '../hooks';
import { BackButton, VideoList } from '../components';

export const VideoCategoryScreen = () => {
  const { state, actions } = useVideoContext();
  return (
    <View style={{ display: 'flex', flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <BackButton />
        <Text style={{ fontSize: 20, color: theme.whiteA() }}>
          {state.category}
        </Text>
      </View>
      <VideoList
        onMorePress={actions.getVideoCategoryList}
        onVideoPress={actions.showVideoDetail}
        videoGroup={state.videosCategory}
      />
    </View>
  );
};
