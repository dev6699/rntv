# RNTV

<p align="center">
    <picture >
      <img alt="RNTV Logo" src="./docs/rntv-logo.png" width="200">
    </picture>    
</p>

## What is RNTV?

RNTV is a video streaming tv/mobile/desktop application. Stream video from your sources.

## Table of Contents

- [What is RNTV?](#what-is-rntv)
- [Table of Contents](#table-of-contents)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Development](#development)
- [Add your video sources](#add-your-video-sources)
- [Release build](#release-build)
- [License](#license)

## Screenshots

<table>
  <tr>
      <td>Android Phone</td>
      <td>Android TV</td>
      <td>Windows Desktop</td>
  </tr>
  <tr>
    <td valign="top" width="30%"> 
      <img src="./docs/screenshot-6.png" width="100%" height="100%">
      <img src="./docs/screenshot-7.png" width="100%" height="100%">
    </td>
    <td valign="top" width="35%">
      <img src="./docs/screenshot-1.png" width="100%" height="100%">
       <img src="./docs/screenshot-2.png" width="100%" height="100%">
        <img src="./docs/screenshot-3.png" width="100%" height="100%">
         <img src="./docs/screenshot-4.png" width="100%" height="100%">
    </td>
    <td valign="top" width="35%">
      <img src="./docs/screenshot-5.png" width="100%" height="100%">
    </td>
  </tr>
 </table>

## Installation

Make sure you have setup react native environment [here](https://reactnative.dev/docs/environment-setup)

- [windows setup](https://microsoft.github.io/react-native-windows/docs/getting-started)

Clone this repo

```bash
git clone https://github.com/dev6699/rntv.git
cd rntv
```

Install dependencies

```bash
yarn
```

## Development

For android

```
yarn android
```

For windows

```
yarn windows
```

### Add your video sources

- Sample source can be found at [/src/services/tv/sample.ts](/src/services/tv/sample.ts)

1. Add your source satisfy the following [types](/src/services/tv/types.ts).

   ```typescript
   export type TVideoProvider = {
     getHomeVideoList(): Promise<TVideosRec[]>;
     getVideoCategory(path: string): Promise<TVideosRec[]>;
     getVideoCategoryList(path: string): Promise<TVideosRec[]>;
     getVideoSources(path: string): Promise<TVideoSources>;
     getVideoUrl(path: string): Promise<string>;
     getVideoSearchResult(keyword: string): Promise<TVideo[]>;
     updateVideoStatus(video: TVideo): Promise<TVideo>;
   };
   ```

2. Include the source in [/src/services/tv/index.ts](/src/services/tv/index.ts)

   ```typescript
   import { TVideoProvider } from './types';
   import * as sample from './sample';

   export * from './types';

   export const TVService: Record<string, TVideoProvider> = {
     sample,
   } as const;
   ```

## Release build

For android, find `app-release.apk` at [/android/app/build/outputs/apk/release](/android/app/build/outputs/apk/release)

```
yarn build
```

For windows

```
yarn build:win
```

## License

[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/dev6699/rntv/blob/main/LICENSE)

This project is licensed under the terms of the [MIT license](/LICENSE).
