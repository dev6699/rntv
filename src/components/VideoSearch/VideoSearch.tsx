import React, { useRef, useState } from 'react';
import { TextInput, TouchableHighlight } from 'react-native';

export const VideoSearch: React.FC<{
  searchVideo: (keyword: string) => void;
}> = ({ searchVideo }) => {
  const [value, onChangeText] = useState<undefined | string>();

  const inputRef = useRef<TextInput>(null);
  return (
    <TouchableHighlight
      onPress={() => inputRef.current?.focus()}
      hasTVPreferredFocus={true}
      underlayColor={'rgba(255, 255, 255, 0.2)'}
      style={{
        paddingHorizontal: 5,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
      }}>
      <TextInput
        ref={inputRef}
        placeholderTextColor={'white'}
        style={{
          width: '100%',
          padding: 5,
          color: 'white',
        }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={async () => {
          if (!value) {
            return;
          }
          searchVideo(value);
        }}
        placeholder={'搜索'}
      />
    </TouchableHighlight>
  );
};
