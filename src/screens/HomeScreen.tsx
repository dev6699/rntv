import React from 'react';
import { View } from 'react-native';

import { useVideoContext } from '../hooks';
import { VideoList, VideoProvider, VideoSearch } from '../components';

export const HomeScreen = () => {
  const { state, actions } = useVideoContext();

  const search = { title: '搜索结果', href: '', videos: state.searchVideos };
  const favourite = { title: '最爱', href: '', videos: state.favouriteVideos };
  const videos = [search, favourite, ...state.videos];

  return (
    <View style={{ padding: 5 }}>
      <VideoList
        ListHeaderComponent={
          <View
            style={{
              marginTop: 3,
              marginBottom: 15,
            }}>
            <View
              style={{
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
        }
        onMorePress={actions.getVideoCategory}
        onVideoPress={actions.showVideoDetail}
        videoGroup={videos}
      />
    </View>
  );
};
