import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, Text, TouchableHighlight, View } from 'react-native';
import { i18n } from '../../i18n';

import { imgAssets, theme } from '../utils';
import { Button, BackButton, DownloadButton } from '../components';

import { Download } from '../hooks/useDownload';
import { useDownloadContext, useNavContext, useOrientation, useVideoContext } from '../hooks';

type VideoWatch = {
  href: string;
  ep: string;
  watched: boolean;
};

export const VideoDetailScreen: React.FC = () => {
  const {
    state: { videoDetail, provider },
    actions: {
      watchedKey,
      getWatched,
      playVideo,
      saveFavourite,
      isFavourite,
      removeFavourite,
    },
  } = useVideoContext();
  const { actions: { addDownloads } } = useDownloadContext()
  const { setPage } = useNavContext()
  const { isPortrait, orientation, height } = useOrientation();

  const [source, setSource] = useState(Object.keys(videoDetail.source)[0]);
  const [episodes, setEpisodes] = useState<VideoWatch[]>([]);
  const [downloadMode, setDownloadMode] = useState(false)
  const [selectedDownload, setSelectedDownload] = useState(new Set<number>([]))

  const animations = useRef({
    bottom: new Animated.Value(-height * 0.2),
  }).current;


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
    setSelectedDownload(new Set([]))
  }, [source]);


  return (
    <View
      style={{
        marginVertical: 2,
        flex: 1,
        position: 'relative'
      }}
    >
      <View
        style={{
          flex: isPortrait ? 12 : 5,
          flexDirection: isPortrait ? 'column-reverse' : 'row',
          position: 'relative',
        }}>

        <View
          style={{
            zIndex: 99,
            position: isPortrait ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            display: 'flex',
            width: isPortrait ? '100%' : undefined,
            flexDirection: isPortrait ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}>
          <BackButton />
          <DownloadButton
            active={downloadMode}
            onPress={() => {
              setSelectedDownload(new Set())
              setDownloadMode(mode => !mode)
            }}
          />
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
                  style={{ backgroundColor: theme.transparent }}
                  textStyle={{
                    padding: 8,
                    fontSize: 18,
                    color: theme.whiteA(),
                    borderBottomWidth: selected ? 3 : 0,
                    borderColor: theme.primary,
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
              borderColor: theme.whiteA(0.2),
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: theme.whiteA(0.15),
              }}>
              <Text
                style={{
                  flex: 3,
                  fontSize: 22,
                  color: theme.whiteA(),
                  paddingRight: 10,
                  padding: 10
                }}>
                {videoDetail.title}
              </Text>
              <Button
                onPress={onFavouritePress}
                text={i18n.t('addFav')}
                textStyle={{ color: theme.whiteA() }}
                style={{
                  flex: 1,
                  backgroundColor: isFav ? theme.primary : theme.whiteA(0.2),
                }}
              />
            </View>
            <FlatList
              key={'ep' + orientation}
              numColumns={isPortrait ? 3 : 4}
              data={episodes}
              renderItem={({ item, index }) => {
                return (
                  <View style={{
                    width: isPortrait ? '33%' : '25%',
                  }}>

                    <Button
                      style={{
                        paddingLeft: 15,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        display: 'flex'
                      }}
                      textStyle={{
                        color: !downloadMode && item.watched ? theme.primary : theme.whiteA(),
                      }}
                      text={item.ep}
                      key={item.href + index}
                      onPress={() => {
                        if (downloadMode) {
                          if (selectedDownload.has(index)) {
                            selectedDownload.delete(index)
                          } else {
                            selectedDownload.add(index)
                          }
                          setSelectedDownload(new Set([...selectedDownload]))
                        } else {
                          playVideo({
                            index,
                            ep: item.ep,
                            url: item.href,
                            title: videoDetail.title,
                            source,
                            eps: episodes,
                          })
                        }
                      }}
                      icon={
                        downloadMode ?
                          (
                            selectedDownload.has(index) ?
                              <Image
                                style={{
                                  height: 20, width: 20,
                                  marginRight: 10
                                }}
                                resizeMode='contain'
                                source={imgAssets.checked}
                              />
                              :
                              <View
                                style={{
                                  height: 20, width: 20,
                                  marginRight: 10,
                                  borderWidth: 1,
                                  borderColor: theme.whiteA(0.3),
                                  borderRadius: 999
                                }}
                              />
                          )
                          :
                          undefined
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


      {
        downloadMode &&
        <View style={{
          flex: 1,
          marginTop: 10,
          backgroundColor: theme.whiteA(0.15),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <TouchableHighlight
            style={{ flex: 1 }}
            onPress={() => {
              if (selectedDownload.size === episodes.length) {
                setSelectedDownload(new Set())
              } else {
                const all = episodes.map((_, idx) => idx)
                setSelectedDownload(new Set(all))
              }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ alignItems: 'center' }}>
                {selectedDownload.size === episodes.length ?
                  <Image
                    style={{
                      height: 24, width: 24,
                      marginHorizontal: 5,
                    }}
                    resizeMode='contain'
                    source={imgAssets.checked}
                  />
                  :
                  <View
                    style={{
                      height: 24, width: 24,
                      marginHorizontal: 5,
                      borderWidth: 1,
                      borderColor: theme.whiteA(0.3),
                      borderRadius: 999
                    }}
                  />
                }
                <Text style={{ color: theme.whiteA() }}>{i18n.t('all')}</Text>
              </View>
              <Text style={{ color: theme.whiteA(), paddingLeft: 10 }}>
                {
                  selectedDownload.size > 0 ?
                    selectedDownload.size + ' ' + i18n.t('selected')
                    :
                    i18n.t('selectItems')
                }
              </Text>
            </View>
          </TouchableHighlight>

          <Button
            style={{ backgroundColor: theme.whiteA(0.2) }}
            onPress={async () => {

              const downloads: Download[] = []
              for (const idx of selectedDownload) {
                const d = episodes[idx]
                downloads.push({
                  provider,
                  name: videoDetail.title,
                  ep: d.ep,
                  href: d.href
                })
              }
              const added = await addDownloads(downloads)
              if (!added) {
                return
              }

              setDownloadMode(false)

              Animated.timing(animations.bottom, {
                toValue: 0,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: false,
              }).start();

              setTimeout(() => {
                Animated.timing(animations.bottom, {
                  toValue: -height * 0.2,
                  duration: 100,
                  easing: Easing.linear,
                  useNativeDriver: false,
                }).start()
              }, 3000)
            }}
            text={i18n.t('download')}
          />
        </View>
      }

      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: theme.whiteA(),
          alignItems: 'center',
          flexDirection: 'row',
          bottom: animations.bottom,
          left: 0,
          right: 0,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ color: theme.blackA() }}>{i18n.t('downloading')}...</Text>
        <Button
          onPress={() => {
            setPage('library')
          }}
          textStyle={{
            color: theme.primary
          }}
          text='view'
        />
      </Animated.View>
    </View >
  );
};
