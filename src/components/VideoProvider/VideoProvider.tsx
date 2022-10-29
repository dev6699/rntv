import React from 'react';
import { FlatList } from 'react-native';
import { theme } from '../../utils';
import { Button } from '../Button';

export const VideoProvider: React.FC<{
  activeProvider: string;
  providers: string[];
  setProvider: (p: string) => void;
}> = ({ activeProvider, providers, setProvider }) => {
  return (
    <FlatList
      style={{ flex: 1 }}
      horizontal
      data={providers}
      renderItem={({ item, index }) => {
        const active = activeProvider === item;
        return (
          <Button
            key={item + index}
            text={item}
            onPress={() => setProvider(item)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginVertical: 0,
              marginRight: 0,
            }}
            textStyle={{
              color: active ? theme.whiteA() : theme.grayA(),
              padding: 0,
              fontWeight: 'bold',
            }}
          />
        );
      }}
    />
  );
};
