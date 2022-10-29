import React from 'react';
import { Image, TouchableHighlight, Platform } from 'react-native';

import { useNavContext } from '../../hooks';
import { imgAssets, theme } from '../../utils';

export const BackButton: React.FC = () => {
  if (Platform.isTV) {
    return null;
  }

  const { popPage } = useNavContext();
  return (
    <TouchableHighlight
      underlayColor={theme.whiteA(0.2)}
      onPress={popPage}
      style={{
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
      }}>
      <Image source={imgAssets.back} />
    </TouchableHighlight>
  );
};
