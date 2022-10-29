import React from 'react';
import { FlatList, Text, View } from 'react-native';

import { useOrientation, useVideoContext } from '../hooks';
import { VideoCard, BackButton } from '../components';
import { theme } from '../utils';

export const VideoListScreen = () => {
  const { state, actions } = useVideoContext();

  const { orientation, numCols } = useOrientation();

  const list = state.videosList[0];

  if (!list) {
    return null;
  }

  return (
    <View style={{ display: 'flex', flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <BackButton />
        <Text style={{ fontSize: 20, color: theme.whiteA() }}>
          {list.title}
        </Text>
      </View>
      <FlatList
        key={orientation + numCols}
        numColumns={numCols}
        data={list.videos}
        columnWrapperStyle={{ marginBottom: 20 }}
        renderItem={({ item, index }) => {
          return (
            <VideoCard
              style={{ flex: 1 / numCols }}
              video={item}
              key={item.title + index}
              onVideoPress={() => actions.showVideoDetail(item)}
            />
          );
        }}
      />
    </View>
  );
};
