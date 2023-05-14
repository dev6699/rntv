import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { i18n } from '../../i18n';
import { theme } from '../utils';
import { useVideoContext } from '../hooks';
import { VideoList, VideoProvider, VideoSearch } from '../components';

export const HomeScreen: React.FC<{
  scrollRef: React.RefObject<FlatList>
}> = ({ scrollRef }) => {
  const { state, actions } = useVideoContext();

  const search = {
    title: i18n.t('searchResult'),
    href: '',
    videos: state.searchVideos,
  };
  const favourite = {
    title: i18n.t('fav'),
    href: '',
    videos: state.favouriteVideos,
  };
  const videos = [search, favourite, ...state.videos];

  const refreshVideos = async () => {
    await actions.refreshHomeList()
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginVertical: 10,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              marginRight: 10,
            }}>
            <VideoSearch searchVideo={actions.searchVideo} />
          </View>
          <VideoProvider
            activeProvider={state.provider}
            providers={state.providers}
            setProvider={actions.setProvider}
          />
        </View>
      </View>

      {!state.init ? <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={100} color={theme.primary} />
      </View>
        :
        <VideoList
          onMorePress={actions.getVideoCategory}
          onVideoPress={actions.showVideoDetail}
          videoGroup={videos}
          scrollRef={scrollRef}
          onRefresh={refreshVideos}
        />
      }
    </View>
  );
};
