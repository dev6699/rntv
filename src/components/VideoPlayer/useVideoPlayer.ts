import React, { useRef, useState } from "react";
import {
    Animated, PanResponder, Platform,
    useTVEventHandler as _useTVEventHandler, HWEvent,
} from "react-native";

// Fix windows issue
const useTVEventHandler = _useTVEventHandler || function () { }

export type TVideoPlayerContext = ReturnType<typeof useVideoPlayer>

export const VideoPlayerContext = React.createContext<TVideoPlayerContext>({} as TVideoPlayerContext);
export const useVideoPlayerContext = () => React.useContext(VideoPlayerContext);
const RATE = [1.0, 1.5, 2.0];

const CONFIG = {
    MAX_VIDEO_CHUNK: 10,
    ADJUST_SECOND: 10,
    CONTROL_ANIMATION_TIMING: 500,
    CONTROL_TIMEOUT_DELAY: 10000

} as const

type RNVideo = {
    seek(time: number): void
    dismissFullscreenPlayer(): void
    presentFullscreenPlayer(): void
    _root: {
        setNativeProps(props: { fullscreen: boolean, controls: boolean }): void
    }
}

type RNVideoData = {
    currentTime: number
    duration: number
    playableDuration: number
}

export const useVideoPlayer = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [duration, setDuration] = useState(0);
    const [controlsShown, setControlsShown] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [playablePosition, setPlayablePosition] = useState(0)
    const [seekerPosition, setSeekerPosition] = useState(0)
    const [seeking, setSeeking] = useState(false)

    const selectedTargetRef = useRef<number>()

    useTVEventHandler((e: HWEvent & { target?: number }) => {
        if (e.eventType === 'up' && !controlsShown) {
            // show controls when 'up' press and controls not shown
            if (!e.target) {
                // e.target will be undefined when contorls refocus(shown on screen)
                // state: hide -> show
                selectedTargetRef.current = e.target
            }
            showControl()
        }


        if (e.eventType === 'down' && controlsShown && (selectedTargetRef.current === e.target || !selectedTargetRef.current)) {
            // hide controls when 'down' press and controls showing and 
            // down target is same as old target(at bottom)
            // or target is undefined(only refocus) without other key pressed (state: hide -> show -> hide)
            hideControls()
        }

        if (e.eventType !== 'blur' && e.eventType !== 'focus' && e.target) {
            // update last selected target
            selectedTargetRef.current = e.target
        }
    })

    const seekBarRef = useRef(0)

    const seekPanResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
            const position = e.nativeEvent.locationX;
            setSeekerPosition(position);
            setSeeking(true)
            setLoading(true)
        },
        onPanResponderMove: (e) => {
            let position = e.nativeEvent.locationX;
            position = position > 0 ? Math.min(position, seekBarRef.current) : Math.max(position, 0)
            setSeekerPosition(position);
        },
        onPanResponderRelease: (e) => {
            let position = e.nativeEvent.locationX;
            position = position > 0 ? Math.min(position, seekBarRef.current) : Math.max(position, 0)

            setDuration(d => {
                const percent = position / seekBarRef.current
                const time = d * percent;
                videoPlayerRef.current?.seek(time)
                return d
            })
            setSeeking(false)
        }
    })).current

    const videoPlayerRef = useRef<RNVideo>()
    const animationsRef = useRef({
        controlBar: {
            opacity: new Animated.Value(1),
        },
    })

    const animations = animationsRef.current

    const withData = (func: (data: RNVideoData) => void) => {
        return (data = {} as (RNVideoData & { nativeEvent?: RNVideoData })) => {
            // Fix data in nativeEvent on windows
            func(data.nativeEvent || data)
        }
    }

    const onLoad = withData((data) => {
        setDuration(data.duration);
        setLoading(false);
    });

    const onProgress = withData((data) => {
        if (duration === 0) {
            return
        }

        setCurrentTime(data.currentTime);
        let percent = data.currentTime / duration;
        let position = (seekBarRef.current * percent) || 0
        position = Math.min(position, seekBarRef.current)
        if (!seeking) {
            setSeekerPosition(position);
        }

        percent = data.playableDuration / duration;
        position = (seekBarRef.current * percent) || 0
        position = Math.min(position, seekBarRef.current)

        setPlayablePosition(position)
    });

    const onSeek = () => {
        setLoading(false)
    }

    const onError = (err: Error) => {
        console.log(err);
        setLoading(false);
        setError(true);
        showControl()
    };

    const onScreenTouch = () => {
        if (controlsShown) {
            hideControls()
        } else {
            showControl()
        }
    }

    const showControl = () => {
        setControlsShown(true)
        Animated.timing(animations.controlBar.opacity, {
            toValue: 1,
            duration: CONFIG.CONTROL_ANIMATION_TIMING,
            useNativeDriver: false,
        }).start()

        if (Platform.OS !== 'windows') {
            videoPlayerRef.current?.dismissFullscreenPlayer()
        } else {
            videoPlayerRef.current?._root.setNativeProps({ fullscreen: false, controls: false });
        }
    }

    const hideControls = () => {
        Animated.timing(animations.controlBar.opacity, {
            toValue: 0,
            duration: CONFIG.CONTROL_ANIMATION_TIMING,
            useNativeDriver: false,
        }).start(() => {
            setControlsShown(false)
            if (Platform.OS !== 'windows') {
                videoPlayerRef.current?.presentFullscreenPlayer()
            }
        })
    };


    const actionable = (func: (player: RNVideo) => void) => {
        if (!controlsShown || !duration || !videoPlayerRef.current) {
            return
        }
        func(videoPlayerRef.current)
    }

    const rewind = () => actionable((player) => {
        player.seek(Math.max(currentTime - CONFIG.ADJUST_SECOND, 0))
    })

    const fforward = () => actionable((player) => {
        player.seek(Math.min(currentTime + CONFIG.ADJUST_SECOND, duration))
    })

    const skipPrev = () => actionable((player) => {
        const chunk = Math.floor(currentTime / (duration / CONFIG.MAX_VIDEO_CHUNK))
        player.seek(Math.max(((chunk - 1) * duration / CONFIG.MAX_VIDEO_CHUNK), 0))
    })

    const skipNext = () => actionable((player) => {
        const chunk = Math.floor(currentTime / (duration / CONFIG.MAX_VIDEO_CHUNK))
        player.seek(Math.min(((chunk + 1) * duration / CONFIG.MAX_VIDEO_CHUNK), duration))
    })

    const fullscreen = () => actionable((player) => {
        hideControls()
        player.presentFullscreenPlayer()
    })

    const setPlayPause = () => actionable(() => {
        setPaused(p => !p)
    })

    const setPlayRate = () => actionable(() => {
        setRate(RATE[(RATE.indexOf(rate) + 1) % RATE.length])
    })

    return {
        seekPanResponder,

        state: {
            rate,
            error,
            paused,
            loading,
            duration,
            currentTime,
            controlsShown,
            seekerPosition,
            playablePosition
        },

        refs: {
            seekBarRef,
            animationsRef,
            videoPlayerRef,
        },

        events: {
            onSeek,
            onLoad,
            onError,
            onProgress,
            onScreenTouch,
        },

        actions: {
            rewind,
            fforward,
            skipNext,
            skipPrev,
            fullscreen,
            setPlayRate,
            setPlayPause,
        }
    } as const
}