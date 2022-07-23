export type TVideosRec = { title: string, href: string, videos: TVideo[] }
export type TVideo = {
    title: string
    href: string
    img: string
    status: string
}
export type TVideoWithSource = TVideo & { source: TVideoSources };
export type TVideoSources = Record<string, { href: string, ep: string }[]>

export type TVideoProvider = {
    getHomeVideoList(): Promise<TVideosRec[]>
    getVideoCategory(path: string): Promise<TVideosRec[]>
    getVideoCategoryList(path: string): Promise<TVideosRec[]>
    getVideoSources(path: string): Promise<TVideoSources>
    getVideoUrl(path: string): Promise<string>
    getVideoSearchResult(keyword: string): Promise<TVideo[]>
    updateVideoStatus(video: TVideo): Promise<TVideo>
}
export type TProviderServices = Record<string, TVideoProvider>
