import React, { useRef, useState } from 'react';
import { TextInput, TouchableHighlight } from 'react-native';
import { i18n } from '../../../i18n';

export const VideoSearch: React.FC<{
  searchVideo: (keyword: string) => void;
}> = ({ searchVideo }) => {
  const [value, onChangeText] = useState<undefined | string>();

  const inputRef = useRef<TextInput>(null);
  return (
    <TouchableHighlight
      onPress={() => inputRef.current?.focus()}
      hasTVPreferredFocus={true}
      underlayColor={'#4287f5'}
      style={{
        padding: 0,
        paddingBottom: 3,
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <TextInput
        ref={inputRef}
        placeholderTextColor={'white'}
        style={{
          width: '100%',
          padding: 5,
          paddingLeft: 10,
          color: 'white',
          borderRadius: 5,
          backgroundColor: '#3b3e45',
        }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={async () => {
          if (!value) {
            return;
          }
          searchVideo(value);
        }}
        placeholder={i18n.t('search')}
      />
    </TouchableHighlight>
  );
};
