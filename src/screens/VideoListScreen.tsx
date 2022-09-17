import React from 'react';
import { FlatList } from 'react-native';

import { useOrientation, useVideoContext } from '../hooks';
import { VideoCard } from '../components';

export const VideoListScreen = () => {
  const { state, actions } = useVideoContext();

  const { orientation, numCols } = useOrientation();

  const list = state.videosList[0];

  if (!list) {
    return null;
  }

  return (
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
  );
};
