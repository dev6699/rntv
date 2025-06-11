import { NavigatorScreenParams } from "@react-navigation/native";
import { TVideo } from "../services";

type HomeTabParamList = {
    Home: undefined;
    Library: undefined;
    Web: undefined;
};

export type RootStackParamList = {
    HomeTabs: NavigatorScreenParams<HomeTabParamList>
    Home: undefined
    Library: undefined
    Web: undefined

    Category: { path: string, name: string }
    List: { path: string, name: string }
    Detail: { video: TVideo }
    Play: {
        local: boolean
        video: {
            title: string;
            source: string;
            ep: string;
            url: string;
            eps: {
                href: string;
                ep: string;
            }[];
            index: number;
        }
    }
};