import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TNavContext } from "./useNav";
import { TVideo, TVideosRec, TVideoWithSource, TVService } from "../services";

export type TVideoContext = ReturnType<typeof useVideo>
export const VideoContext = React.createContext<TVideoContext>({} as TVideoContext);
export const useVideoContext = () => React.useContext(VideoContext);

export const useVideo = (nav: TNavContext) => {
    const [init, setInit] = useState(false)
    const [loading, setLoading] = useState(false);

    const [provider, setProvider] = useState<string>(Object.keys(TVService)[0])

    const [videos, setVideos] = useState<TVideosRec[]>([]);
    const [videosCategory, setVideosCategory] = useState<TVideosRec[]>([]);
    const [videosList, setVideosList] = useState<TVideosRec[]>([]);

    const [searchVideos, setSearchVideos] = useState<TVideo[]>([]);
    const [favouriteVideos, setFavouriteVideos] = useState<TVideo[]>([]);

    const [videoDetail, setVideoDetail] = useState<TVideoWithSource>({} as TVideoWithSource);
    const [playVideoUrl, setPlayVideoUrl] = useState('');

    const tvService = TVService[provider]

    useEffect(() => {
        (async () => {
            if (!provider) {
                return
            }

            if (init) {
                setLoading(true)
            }

            const videos = await tvService.getHomeVideoList()
            setVideos(videos)
            await loadFavourite()
            setSearchVideos([])
            setLoading(false)
            if (!init) {
                setInit(true)
            }
        })()
    }, [provider]);

    const getVideoCategory = async (path: string) => {
        setLoading(true)
        const videos = await tvService.getVideoCategory(path)

        if (videos.length === 1) {
            setVideosList(videos)
            nav.setPage('list')
        } else {
            setVideosCategory(videos)
            nav.setPage('category')
        }
        setLoading(false)
    }

    const getVideoCategoryList = async (path: string) => {
        setLoading(true)
        const videos = await tvService.getVideoCategoryList(path)
        setVideosList(videos)
        nav.setPage('list')
        setLoading(false)
    }

    const playVideo = async (pageUrl: string) => {
        setLoading(true);
        const url = await tvService.getVideoUrl(pageUrl);
        setPlayVideoUrl(url);
        nav.setPage('play');
        setLoading(false);
    }

    const showVideoDetail = async (v: TVideo) => {
        setLoading(true);
        const source = await tvService.getVideoSources(v.href);
        setVideoDetail({ ...v, source });
        nav.setPage('detail');
        setLoading(false);
    }

    const searchVideo = async (keyword: string) => {
        setLoading(true);
        const result = await tvService.getVideoSearchResult(keyword);
        setSearchVideos(result);
        setLoading(false);
    }

    const loadFavourite = async () => {
        setFavouriteVideos([])

        const favouriteVideosStr = await AsyncStorage.getItem(provider)
        if (!favouriteVideosStr) {
            return
        }

        const favVids = JSON.parse(favouriteVideosStr) as TVideo[]
        setFavouriteVideos(favVids)

        const promises = favVids.map(tvService.updateVideoStatus)
        Promise.all(promises).then(async () => {
            await AsyncStorage.setItem(provider, JSON.stringify(favVids))
            setFavouriteVideos(favVids)
        })
    }

    const saveFavourite = async (video: TVideo) => {
        const favVids: TVideo[] = [
            ...favouriteVideos,
            { href: video.href, img: video.img, title: video.title, status: video.status }
        ]

        await AsyncStorage.setItem(provider, JSON.stringify(favVids))
        setFavouriteVideos(favVids)
    }

    const removeFavourite = async (video: TVideo) => {
        const favVids = favouriteVideos.filter(v => v.href !== video.href)
        await AsyncStorage.setItem(provider, JSON.stringify(favVids))
        setFavouriteVideos(favVids)
    }

    const isFavourite = (video: TVideo) => {
        return !!favouriteVideos.find(v => v.href === video.href)
    }

    return {
        state: {
            init,
            videos,
            videosCategory,
            videosList,
            loading,
            provider,
            videoDetail,
            playVideoUrl,
            searchVideos,
            favouriteVideos,
            providers: Object.keys(TVService),
        },

        actions: {
            playVideo,
            searchVideo,
            setProvider,
            setVideoDetail,
            setPlayVideoUrl,
            getVideoCategory,
            getVideoCategoryList,
            showVideoDetail,
            saveFavourite,
            isFavourite,
            removeFavourite
        }
    } as const
}