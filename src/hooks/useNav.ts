import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";


export type TNavContext = ReturnType<typeof useNav>
export const NavContext = React.createContext<TNavContext>({} as TNavContext);
export const useNavContext = () => React.useContext(NavContext);

type TPage = 'home' | 'category' | 'list' | 'detail' | 'play'

export const useNav = () => {
    const [page, _setPage] = useState<TPage>('home');

    const history = useRef<TPage[]>(['home']).current

    const setPage = (p: TPage, replace?: boolean) => {
        if (replace) {
            history[history.length - 1] = p
        } else {
            history.push(p)
        }
        _setPage(p)
    }

    const popPage = () => {
        history.pop()
        const toPage = history[history.length - 1]
        _setPage(toPage)
    }

    useEffect(() => {
        const backAction = () => {
            switch (page) {

                case 'home':
                    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
                        {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                        },
                        { text: 'YES', onPress: () => BackHandler.exitApp() },
                    ]);
                    break;
                default:
                    popPage()
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [page]);

    return {
        page,
        setPage,
        popPage
    }
}