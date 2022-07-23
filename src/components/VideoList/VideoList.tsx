import React from 'react';
import { FlatList, Text, View } from 'react-native';

import type { TVideo, TVideosRec } from '../../services';
import { Button } from '../Button';
import { VideoCard } from '../VideoCard';

export const VideoList: React.FC<{
  videoGroup: TVideosRec[];
  onVideoPress: (v: TVideo) => void;
  onMorePress: (path: string) => void;
  ListHeaderComponent?: JSX.Element;
}> = ({ videoGroup, ListHeaderComponent, onVideoPress, onMorePress }) => {
  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      data={videoGroup}
      renderItem={({ item, index }) => {
        const { title, href, videos } = item;
        if (videos.length < 1) {
          return null;
        }
        return (
          <View
            key={title + index}
            style={{
              marginBottom: 15,
            }}>
            <View
              style={{
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  color: 'white',
                  marginRight: 10,
                }}>
                {title}
              </Text>
              {href ? (
                <Button
                  onPress={() => onMorePress(href)}
                  text="更多"
                  style={{
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                  }}
                />
              ) : null}
            </View>
            <FlatList
              horizontal={true}
              data={videos}
              renderItem={({ item, index }) => {
                return (
                  <VideoCard
                    video={item}
                    key={item.title + index}
                    onVideoPress={() => onVideoPress(item)}
                  />
                );
              }}
            />
          </View>
        );
      }}
    />
  );
};
