import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { i18n } from '../../../i18n';
import { useOrientation } from '../../hooks';

import type { TVideo, TVideosRec } from '../../services';
import { Button } from '../Button';
import { VideoCard } from '../VideoCard';

export const VideoList: React.FC<{
  videoGroup: TVideosRec[];
  onVideoPress: (v: TVideo) => void;
  onMorePress: (path: string) => void;
  ListHeaderComponent?: JSX.Element;
}> = ({ videoGroup, ListHeaderComponent, onVideoPress, onMorePress }) => {
  const { numCols } = useOrientation();

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
                flex: 1,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 20,
                  color: 'white',
                }}>
                {title}
              </Text>
              {href ? (
                <Button
                  onPress={() => onMorePress(href)}
                  text={i18n.t('more')}
                  style={{
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                  }}
                />
              ) : null}
            </View>
            <FlatList
              key={numCols}
              data={videos}
              numColumns={numCols}
              renderItem={({ item, index }) => {
                return (
                  <VideoCard
                    style={{ flex: 1 / numCols }}
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
