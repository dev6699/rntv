import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import { useOrientation } from '../../hooks';
import type { TVideo } from '../../services';

import { imgAssets } from '../../utils';

export const VideoCard: React.FC<{
  style?: ViewStyle;
  video: TVideo;
  onVideoPress: () => void;
}> = ({ style, video, onVideoPress }) => {
  const { height, width, isPortrait } = useOrientation();
  const { img, title, status } = video;

  const cardHeight = isPortrait ? (width / 3) * 1.1 : height / 2.5;
  const cardWidth = isPortrait ? width / 2 : (width / 4) * 1.1;

  const animations = useRef({
    scale: new Animated.Value(1),
    zIndex: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }).current;

  const focusCard = () => {
    Animated.timing(animations.opacity, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animations.scale, {
      toValue: 1.1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const unfocusCard = () => {
    Animated.timing(animations.opacity, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animations.scale, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableHighlight
      onPressIn={focusCard}
      onPressOut={unfocusCard}
      onFocus={focusCard}
      onBlur={unfocusCard}
      onPress={onVideoPress}
      style={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 10,
        flex: 1,
        width: cardWidth,
        height: cardHeight,
        ...style,
      }}>
      <View
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <Animated.View
          style={{
            zIndex: 99,
            opacity: animations.opacity,
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 10,
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
          }}
        />
        <View
          style={{
            flex: 5,
            borderRadius: 10,
          }}>
          <Animated.View
            style={{
              overflow: 'hidden',
              transform: [
                {
                  scale: animations.scale,
                },
              ],
            }}>
            <Animated.Image
              resizeMode={'cover'}
              source={img ? { uri: img } : imgAssets.notFound}
              style={{
                borderRadius: 10,
                height: '100%',
                width: '100%',
              }}
            />
          </Animated.View>
          {status !== '' && (
            <View
              style={{
                backgroundColor: 'rgba(52, 52, 52, 0.85)',
                padding: 5,
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}>
              <Text style={{ textAlign: 'right', color: 'white' }}>
                {status}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: 'black',
            flex: 1,
            alignItems: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: 'white',
              fontSize: 16,
            }}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
