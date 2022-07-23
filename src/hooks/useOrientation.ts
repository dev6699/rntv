import { useWindowDimensions } from "react-native";

export const useOrientation = () => {
    const { height, width } = useWindowDimensions();

    const orientation = height > width ? 'PORTRAIT' : 'LANDSCAPE';

    const isLandscape = orientation === 'LANDSCAPE'
    const isPortrait = !isLandscape

    return { height, width, orientation, isLandscape, isPortrait }
}