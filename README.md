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
- [Flow](#flow)
- [Installation](#installation)
- [Development](#development)
- [Add your video sources](#add-your-video-sources)
- [Release build](#release-build)
- [License](#license)

## Flow

Made with _[Lunacy](https://icons8.com/lunacy)_

<img src="./docs/flow.png" width="100%" height="100%">

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
     /**
      * Called when application first boot up, showing videos in home screen
      */
     getHomeVideoList(): Promise<TVideosRec[]>;

     /**
      * Called when `more` button is clicked on home screen
      * @param path url to the video category
      */
     getVideoCategory(path: string): Promise<TVideosRec[]>;

     /**
      * Called when `more` button is clicked on category screen
      * @param path url to the video category list
      */
     getVideoCategoryList(path: string): Promise<TVideosRec[]>;

     /**
      * Called when video card is clicked
      * @param path url to the video
      */
     getVideoSources(path: string): Promise<TVideoSources>;

     /**
      * Called when video episode is clicked
      * @param path url to find the playable video url (e.g. mp4, m3u8...)
      */
     getVideoUrl(path: string): Promise<string>;

     /**
      * Called when video search is performed
      * @param keyword video search keyword
      */
     getVideoSearchResult(keyword: string): Promise<TVideo[]>;

     /**
      * Called when favourite videos are loaded from local storage
      * to ensure videos status are up to date
      * @param video favourite video stored in local
      */
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
