import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { i18n } from '../../i18n';

import { Button, BackButton } from '../components';
import { useOrientation, useVideoContext } from '../hooks';
import { imgAssets } from '../utils';

type VideoWatch = {
  href: string;
  ep: string;
  watched: boolean;
};

export const VideoDetailScreen: React.FC = () => {
  const {
    state: { videoDetail },
    actions: {
      watchedKey,
      getWatched,
      playVideo,
      saveFavourite,
      isFavourite,
      removeFavourite,
    },
  } = useVideoContext();

  const { isPortrait, orientation } = useOrientation();

  const [source, setSource] = useState(Object.keys(videoDetail.source)[0]);
  const [episodes, setEpisodes] = useState<VideoWatch[]>([]);

  const isFav = isFavourite(videoDetail);

  const onFavouritePress = async () => {
    if (isFav) {
      await removeFavourite(videoDetail);
    } else {
      await saveFavourite(videoDetail);
    }
  };

  useEffect(() => {
    (async () => {
      const newEpisodes = videoDetail.source[source] as VideoWatch[];
      const key = watchedKey(videoDetail.title, source);
      await getWatched(key, newEpisodes);
      setEpisodes(newEpisodes);
    })();
  }, [source]);

  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 2,
        flex: 1,
        flexDirection: isPortrait ? 'column-reverse' : 'row',
        position: 'relative',
      }}>
      <View
        style={{
          zIndex: 99,
          position: isPortrait ? 'absolute' : 'relative',
          top: 0,
          left: 0,
        }}>
        <BackButton />
      </View>
      <View style={{ flex: 5, flexDirection: isPortrait ? 'column' : 'row' }}>
        <FlatList
          horizontal={isPortrait}
          key={'source' + orientation}
          style={{
            flex: 2,
          }}
          data={Object.entries(videoDetail.source)}
          renderItem={({ item, index }) => {
            const [s] = item;
            const selected = source === s;

            return (
              <Button
                text={s}
                key={s + index}
                style={{ backgroundColor: 'transparent' }}
                textStyle={{
                  padding: 8,
                  fontSize: 18,
                  color: 'white',
                  borderBottomWidth: selected ? 3 : 0,
                  borderColor: '#4287f5',
                }}
                onPress={() => {
                  setSource(s);
                }}
              />
            );
          }}
        />
        <View
          style={{
            flex: isPortrait ? 5 : 3,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
          <View
            style={{
              paddingLeft: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 3,
                fontSize: 28,
                color: 'white',
              }}>
              {videoDetail.title}
            </Text>
            <Button
              onPress={onFavouritePress}
              text={i18n.t('addFav')}
              textStyle={{ color: 'white' }}
              style={{
                flex: 1,
                margin: 0,
                padding: 0,
                borderBottomWidth: 0,
                backgroundColor: isFav ? '#4287f5' : 'transparent',
              }}
            />
          </View>
          <FlatList
            key={'ep' + orientation}
            numColumns={isPortrait ? 3 : 4}
            data={episodes}
            renderItem={({ item, index }) => {
              return (
                <View style={{ width: isPortrait ? '33%' : '25%' }}>
                  <Button
                    textStyle={{ color: item.watched ? '#4287f5' : 'white' }}
                    style={{
                      alignItems: 'flex-start',
                      flex: 1,
                    }}
                    text={item.ep}
                    key={item.href + index}
                    onPress={() =>
                      playVideo({
                        index,
                        ep: item.ep,
                        url: item.href,
                        title: videoDetail.title,
                        source,
                        eps: episodes,
                      })
                    }
                  />
                </View>
              );
            }}
          />
        </View>
      </View>

      <View
        style={{
          flex: 2,
        }}>
        <Image
          source={
            videoDetail.img ? { uri: videoDetail.img } : imgAssets.notFound
          }
          resizeMode={'contain'}
          style={{
            flex: 1,
            width: '100%',
          }}
        />
      </View>
    </View>
  );
};
