import React from 'react';
import { FlatList } from 'react-native';

import { useOrientation, useVideoContext } from '../hooks';
import { VideoCard } from '../components';

export const VideoListScreen = () => {
  const { state, actions } = useVideoContext();

  const { orientation, isPortrait } = useOrientation();

  const list = state.videosList[0];

  if (!list) {
    return null;
  }

  return (
    <FlatList
      key={orientation}
      numColumns={isPortrait ? 2 : 3}
      data={list.videos}
      columnWrapperStyle={{ marginBottom: 20 }}
      renderItem={({ item, index }) => {
        return (
          <VideoCard
            style={{ flex: isPortrait ? 0.5 : 1 }}
            video={item}
            key={item.title + index}
            onVideoPress={() => actions.showVideoDetail(item)}
          />
        );
      }}
    />
  );
};
