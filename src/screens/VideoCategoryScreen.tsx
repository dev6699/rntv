import React from 'react';

import { useVideoContext } from '../hooks';
import { VideoList } from '../components';

export const VideoCategoryScreen = () => {
  const { state, actions } = useVideoContext();

  return (
    <VideoList
      onMorePress={actions.getVideoCategoryList}
      onVideoPress={actions.showVideoDetail}
      videoGroup={state.videosCategory}
    />
  );
};
