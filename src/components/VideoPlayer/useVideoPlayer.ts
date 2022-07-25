import React, { useRef, useState } from "react";
import { Animated, Easing, HWEvent, PanResponder, useTVEventHandler } from "react-native";

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
}

type RNVideoData = {
    currentTime: number
    duration: number
    playableDuration: number
}


export const useVideoPlayer = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paused, setPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [playablePosition, setPlayablePosition] = useState(0)
    const [seekerPosition, setSeekerPosition] = useState(0)
    const [seeking, setSeeking] = useState(false)

    useTVEventHandler((e: HWEvent & { target?: number }) => {
        if (e.eventType === 'up' && !showControls) {
            showControl()
        }

        if (e.eventType === 'down' && showControls) {
            hideControls()
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
            marginBottom: new Animated.Value(0),
            opacity: new Animated.Value(1),
        },
        loader: {
            rotate: new Animated.Value(0),
            MAX_VALUE: 360,
        },
    })

    const animations = animationsRef.current

    const loadAnimation = () => {
        if (!loading) {
            return;
        }

        Animated.sequence([
            Animated.timing(animations.loader.rotate, {
                toValue: animations.loader.MAX_VALUE,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(animations.loader.rotate, {
                toValue: 0,
                duration: 0,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const onLoadStart = () => {
        setLoading(true);
        loadAnimation();
    };

    const onLoad = (data = {} as RNVideoData) => {
        setDuration(data.duration);
        setLoading(false);
    };

    const onProgress = (data = {} as RNVideoData) => {
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
    };

    const onSeek = (data = {} as RNVideoData) => {
        setCurrentTime(data.currentTime);
    };


    const onError = (err: Error) => {
        console.log(err);
        setLoading(false);
        setError(true);
    };

    const onScreenTouch = () => {
        if (showControls) {
            hideControls()
        } else {
            showControl()
        }
    }

    const showControl = () => {
        setShowControls(true)
        showControlAnimation();
        videoPlayerRef.current?.dismissFullscreenPlayer()
    }

    const hideControls = () => {
        setShowControls(false);
        hideControlAnimation();
        videoPlayerRef.current?.presentFullscreenPlayer()
    };

    const showControlAnimation = () => {
        Animated.parallel([
            Animated.timing(animations.controlBar.opacity, {
                toValue: 1,
                duration: CONFIG.CONTROL_ANIMATION_TIMING,
                useNativeDriver: false,
            }),
            Animated.timing(animations.controlBar.marginBottom, {
                toValue: 0,
                duration: CONFIG.CONTROL_ANIMATION_TIMING,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const hideControlAnimation = () => {
        Animated.parallel([
            Animated.timing(animations.controlBar.opacity, {
                toValue: 0,
                duration: CONFIG.CONTROL_ANIMATION_TIMING,
                useNativeDriver: false,
            }),
            Animated.timing(animations.controlBar.marginBottom, {
                toValue: -100,
                duration: CONFIG.CONTROL_ANIMATION_TIMING,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const actionable = (func: (player: RNVideo) => void) => {
        if (!showControls || !duration || !videoPlayerRef.current) {
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
            onLoadStart,
            onScreenTouch
        },

        actions: {
            rewind,
            fforward,
            skipNext,
            skipPrev,
            setPlayRate,
            setPlayPause,
        }
    } as const
}