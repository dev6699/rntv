// import "react-native-tvos"
import 'react-native-url-polyfill/auto';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useVideo, VideoContext, useDownload, DownloadContext } from './src/hooks';
import { Screen } from './src/screens';
import { theme } from './src/utils';
import { WebWorker } from './src/components';

import type { Enc } from './src/utils/m3u8';
import type { DecryptData } from './src/components/WebWorker/WebWorker';

const App = () => {
  const decryptCh = useRef<((value: string | PromiseLike<string>) => void) | null>(null)
  const [decryptData, setDecryptData] = useState<DecryptData>()

  const decrypt = async (enc: Enc, encryptedBytes: string) => {
    setDecryptData({ enc, encryptedBytes })

    const wait = new Promise<string>((res) => {
      decryptCh.current = res
    })

    return await wait
  }

  const video = useVideo();
  const download = useDownload({ getVideoUrl: video.actions.getVideoUrl, decrypt });

  const error = video.state.error;
  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      video.actions.setError('');
    }, 1000);
  }, [error]);

  return (
    <SafeAreaProvider>
      <VideoContext.Provider value={video}>
        <DownloadContext.Provider value={download}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: theme.blackA(),
            }}>
            {(!Platform.isTV && Platform.OS !== 'web') &&
              <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
                <WebWorker
                  data={decryptData}
                  onDone={(decrypted) => {
                    if (decryptCh.current) {
                      decryptCh.current(decrypted)
                      decryptCh.current = null
                      setDecryptData(undefined)
                    }
                  }} />
              </View>
            }
            {error !== '' && <Error text={error} />}
            {video.state.loading && video.state.init && (
              <ActivityIndicator
                color={theme.primary}
                size={48}
                style={{
                  right: 20,
                  top: 20,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  zIndex: 99,
                }}
              />
            )}
            <Screen />
          </SafeAreaView>
        </DownloadContext.Provider>
      </VideoContext.Provider>
    </SafeAreaProvider>
  );
};

const Error: React.FC<{ text: string }> = ({ text }) => {
  return (
    <View
      style={{
        padding: 10,
        alignItems: 'center',
        backgroundColor: theme.warn,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.whiteA(),
        }}>
        {text}
      </Text>
    </View>
  )
}
export default App;
