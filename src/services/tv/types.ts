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
    /**
     * Called when application first boot up, showing videos in home screen
     */
    getHomeVideoList(): Promise<TVideosRec[]>

    /**
     * Called when `more` button is clicked on home screen
     * @param path url to the video category
     */
    getVideoCategory(path: string): Promise<TVideosRec[]>

    /**
     * Called when `more` button is clicked on category screen
     * @param path url to the video category list
     */
    getVideoCategoryList(path: string): Promise<TVideosRec[]>

    /**
     * Called when video card is clicked
     * @param path url to the video
     */
    getVideoSources(path: string): Promise<TVideoSources>

    /**
     * Called when video episode is clicked
     * @param path url to find the playable video url (e.g. mp4, m3u8...)
     */
    getVideoUrl(path: string): Promise<string>

    /**
     * Called when video search is performed
     * @param keyword video search keyword
     */
    getVideoSearchResult(keyword: string): Promise<TVideo[]>

    /**
     * Called when favourite videos are loaded from local storage
     * to ensure videos status are up to date
     * @param video favourite video stored in local
     */
    updateVideoStatus(video: TVideo): Promise<TVideo>
}
export type TProviderServices = Record<string, TVideoProvider>
