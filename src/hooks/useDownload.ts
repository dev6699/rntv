import axios from 'axios';
import { PermissionsAndroid } from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob, { FetchBlobResponse, StatefulPromise } from "react-native-blob-util";

export type TDownloadContext = ReturnType<typeof useDownload>
export const DownloadContext = React.createContext<TDownloadContext>({} as TDownloadContext);
export const useDownloadContext = () => React.useContext(DownloadContext);

export type Download = {
    name: string
    ep: string
    href: string
    provider: string
    // download is considered done once path is defined
    path?: string
}
export type DownloadList = Record<string, Download>

const WIFI_KEY = 'wifi'
const AUTO_DOWNLOAD_KEY = 'auto'
const DOWNLOAD_KEY = 'download'
const FETCH_BLOB = RNFetchBlob
const FS = RNFetchBlob.fs
const DOWNLOAD_DIR = FS.dirs.DownloadDir
const VIDEO_EXT = '.ts'
const PNG_EXT = '.png'

enum DownloadListActionType {
    NEW,
    COMPLETE,
    DELETE,
    MISSING
}
type NewDownloadListAction = { type: DownloadListActionType.NEW, payload: DownloadList }
type CompleteDownloadListAction = { type: DownloadListActionType.COMPLETE, payload: { href: string, path: string } }
type DeleteDownloadListAction = { type: DownloadListActionType.DELETE, payload: string[] }
type MissingDownloadListAction = { type: DownloadListActionType.MISSING, payload: string }
type DownloadListAction = NewDownloadListAction | CompleteDownloadListAction | DeleteDownloadListAction | MissingDownloadListAction

const downloadListReducer = (state: DownloadList, action: DownloadListAction): DownloadList => {
    switch (action.type) {
        case DownloadListActionType.NEW: {
            return {
                ...action.payload,
                ...state,
            };
        }

        case DownloadListActionType.COMPLETE: {
            return {
                ...state,
                [action.payload.href]: {
                    ...state[action.payload.href],
                    path: action.payload.path
                }
            };
        }

        case DownloadListActionType.DELETE: {
            const stateClone = JSON.parse(JSON.stringify(state))
            for (const d of action.payload) {
                delete stateClone[d]
            }
            return stateClone
        }

        case DownloadListActionType.MISSING: {
            return {
                ...state,
                [action.payload]: {
                    ...state[action.payload],
                    path: undefined
                }
            };
        }

    }
}

export const useDownload = (props: { getVideoUrl: (url: string, provider: string) => Promise<string | undefined> }) => {

    const [downloadList, dispatch] = useReducer(downloadListReducer, {} as DownloadList)
    const [wifiOnly, setWifiOnly] = useState(true)
    const [autoDownload, setAutoDownload] = useState(false)
    const [downloading, setDownloading] = useState('')
    const [progress, setProgress] = useState('')
    const tasksRef = useRef<(StatefulPromise<FetchBlobResponse> | null)[]>([])
    const pauseCh = useRef<((_: unknown) => void) | null>(null)
    const mountedRef = useRef(false)

    useEffect(() => {
        (async () => {
            const wifiStr = await AsyncStorage.getItem(WIFI_KEY)
            if (wifiStr === 'false') {
                setWifiOnly(false)
            }

            const autoDownloadStr = await AsyncStorage.getItem(AUTO_DOWNLOAD_KEY)
            const autoDownload = autoDownloadStr === 'true'
            if (autoDownload) {
                setAutoDownload(true)
            }

            const existingDownloadsStr = await AsyncStorage.getItem(DOWNLOAD_KEY)
            if (existingDownloadsStr) {
                const existingDownloads: DownloadList = JSON.parse(existingDownloadsStr)
                dispatch({ type: DownloadListActionType.NEW, payload: existingDownloads })
            }
            mountedRef.current = true
        })()
    }, [])

    useEffect(() => {
        if (!mountedRef.current) {
            return
        }
        (async () => {
            const downloadListStr = JSON.stringify(downloadList)
            await AsyncStorage.setItem(DOWNLOAD_KEY, downloadListStr)
            if (!downloading && !pauseCh.current && autoDownload) {
                const keys = Object.keys(downloadList)
                const nextDownloadKey = keys.find(k => {
                    return !downloadList[k].path
                })

                if (nextDownloadKey) {
                    startDownload({ ...downloadList[nextDownloadKey] })
                }
            }
        })()
    }, [downloadList, autoDownload])

    const loadVideoChunks = async (url: string): Promise<string[]> => {
        const res = await axios.get(url)

        if ((res.data as string).includes('m3u8')) {
            const lines: string[] = res.data.split('\n')
            let m3u8 = lines.find(l => l.includes('m3u8'))

            if (!(m3u8!.startsWith('http://') || m3u8!.startsWith('https://'))) {
                const urlParts = url.split('/')
                const hostname = urlParts[0] + "//" + urlParts[2]
                m3u8 = hostname + m3u8

                return loadVideoChunks(m3u8)
            }
        }

        const chunks = res.data.split('\n')

        const files: string[] = []
        for (const line of chunks) {
            if (
                line.endsWith(VIDEO_EXT) ||
                line.includes(VIDEO_EXT + "?") ||
                line.endsWith(PNG_EXT) ||
                line.includes(PNG_EXT + "?")
            ) {
                if (line.startsWith('http://') || line.startsWith('https://')) {
                    files.push(line)
                }
            }
        }
        return files
    }

    const startTasks = async<T = any>(
        taskGroupName: string,
        taskName: string,
        taskList: string[],
        taskHandlePromise: (item: string, taskGroupName: string, taskName: string, id: number) => Promise<T>,
        updateFunc: (completed: number, total: number) => void,
        limit = 3
    ) => {
        const results: T[] = []

        let total = taskList.length
        let completed = 0

        const _runTask = async (arr: {
            t: string;
            id: number;
        }[]): Promise<any> => {

            const item = arr.shift()
            if (!item) {
                return
            }

            try {
                const r = await taskHandlePromise(item.t, taskGroupName, taskName, item.id)
                results[item.id] = r
                completed++
                updateFunc(completed, total)
                if (arr.length !== 0 && !pauseCh.current) {
                    return _runTask(arr);
                }

            } catch (err) {
                if (pauseCh.current) {
                    return
                }
                arr.push(item);
                return _runTask(arr);
            }
        };

        const idTaskList = taskList.map((t, idx) => ({
            t,
            id: idx
        }))

        const asyncTaskList: Promise<string>[] = [];
        let thread = Math.min(limit, idTaskList.length)
        while (thread > 0) {
            asyncTaskList.push(_runTask(idTaskList));
            thread--;
        }

        await Promise.all(asyncTaskList);

        return results
    };

    const mergeFiles = async (dirname: string, videoname: string, files: string[]) => {
        console.log('merging...')
        setProgress('Processing files...')

        const outFile = `${DOWNLOAD_DIR}/${dirname}/${videoname}${VIDEO_EXT}`
        const exist = await FS.exists(outFile)
        if (exist) {
            await FS.unlink(outFile)
        }

        for (const f of files) {
            await FS.appendFile(outFile, f, 'uri')
        }

        await FS.unlink(`${DOWNLOAD_DIR}/${dirname}/${videoname}`)

        console.log('done.')
        return outFile
    }

    const downloadVideoFile = async (url: string, dirname: string, videoname: string, id: number) => {
        const path = DOWNLOAD_DIR + `/${dirname}/${videoname}/${id}${VIDEO_EXT}`
        const exist = await FS.exists(path)
        if (exist) {
            return path
        }

        const task = FETCH_BLOB
            .config({
                wifiOnly: true,
                path,
            })
            .fetch("GET", url)
            .progress((received, total) => {
                // console.log('prog:', received, total)
            })

        tasksRef.current[id] = task
        return task.then((res) => {
            tasksRef.current[id] = null
            return res.path()
        })
    }

    const downloadFailed = () => {
        setProgress('Failed.')
        setDownloading('')
    }

    const startDownload = async (d?: Download, manual = false) => {
        if (!d) {
            console.log('no download')
            return
        }

        if (manual && downloading) {
            // pause current download if another download is started manually 
            await pauseDownload()
        }

        setProgress('Connecting...')
        setDownloading(d.href)

        try {
            const vidUrl = await props.getVideoUrl(d.href, d.provider)
            if (!vidUrl) {
                downloadFailed()
                return
            }
            const videoChunks = await loadVideoChunks(vidUrl)
            if (videoChunks.length === 0) {
                // failed to get chunks, probably some weird extension
                downloadFailed()
                return
            }

            const videoName = `${d.name} ${d.ep}`

            const files = await startTasks(
                d.name,
                videoName,
                videoChunks,
                downloadVideoFile,
                (completed, total) => {
                    setProgress(`Downloading... ${(completed / total * 100).toFixed(2)}%`)
                    // console.log("Progress: ", videoName, (completed / total * 100).toFixed(2))
                },
                5
            )

            if (releasePause()) {
                return
            }

            const path = await mergeFiles(d.name, videoName, files)
            d.path = path
            setDownloading('')
            dispatch({ type: DownloadListActionType.COMPLETE, payload: { href: d.href, path: d.path! } })
            releasePause()
        } catch (err) {
            downloadFailed()
            console.error(err)
        }
    }

    const releasePause = () => {
        if (pauseCh.current) {
            pauseCh.current(true)
            pauseCh.current = null
            return true
        }
        return false
    }

    const addDownloads = async (downloads: Download[]) => {
        if (downloads.length === 0) {
            return
        }

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'RNTV Files Permission',
                message:
                    'RNTV needs access to your photos and media ' +
                    'in order for you to download videos for offline usage.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            // TODO handle permission never ask
            return false
        }

        const incomingDownloadList: DownloadList = {}
        for (const d of downloads) {
            incomingDownloadList[d.href] = d
        }

        dispatch({ type: DownloadListActionType.NEW, payload: incomingDownloadList })
        return true
    }

    const pauseDownload = async () => {
        if (pauseCh.current) {
            // can't have multiple pause
            return
        }

        console.log('pause')
        const wait = new Promise((res) => {
            pauseCh.current = res
        })

        for (const t of tasksRef.current) {
            if (t) {
                await t.cancel()
            }
        }

        tasksRef.current = []
        await wait
        setDownloading('')
        console.log('pause ok')
    }

    const deleteDownload = async (dl: DownloadList) => {
        const keys = Object.keys(dl)
        const deleteDownloading = keys.find(k => {
            return downloadList[k].href === downloading
        })

        if (deleteDownloading) {
            // make sure the downloading has been paused before delete
            await pauseDownload()
        }

        for (const k of keys) {
            const d = downloadList[k]
            try {
                if (d.path) {
                    // delete video file
                    await FS.unlink(d.path)
                } else {
                    // delete video chunks
                    const chunksDir = DOWNLOAD_DIR + `/${d.name} ${d.ep}`
                    const chunksExist = await FS.exists(chunksDir)
                    if (chunksExist) {
                        await FS.unlink(chunksDir)
                    }
                }
            } catch (err) {
                console.error('error remove files:', err)
            }
        }
        dispatch({ type: DownloadListActionType.DELETE, payload: keys })
    }

    const checkDownloadExist = async (d: Download) => {
        if (!d.path) {
            return false
        }
        return await FS.exists(d.path)
    }

    const markDownloadMissing = async (d: Download) => {
        dispatch({ type: DownloadListActionType.MISSING, payload: d.href })
    }

    const toggleWifiOnly = async () => {
        setWifiOnly(w => !w)
        await AsyncStorage.setItem(WIFI_KEY, `${!wifiOnly}`)
    }

    const toggleAutoDownload = async () => {
        setAutoDownload(w => !w)
        await AsyncStorage.setItem(AUTO_DOWNLOAD_KEY, `${!autoDownload}`)
    }

    return {
        state: {
            downloading,
            progress,
            downloadList,
            wifiOnly,
            autoDownload
        },

        actions: {
            addDownloads,
            startDownload,
            pauseDownload,
            deleteDownload,
            checkDownloadExist,
            markDownloadMissing,
            toggleWifiOnly,
            toggleAutoDownload
        }
    }
}