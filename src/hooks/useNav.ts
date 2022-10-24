import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";

import { i18n } from '../../i18n';

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
                    Alert.alert(i18n.t('exitTitle'), i18n.t('exitMsg'), [
                        {
                            text: i18n.t('cancel'),
                            onPress: () => null,
                            style: 'cancel',
                        },
                        { text: i18n.t('ok'), onPress: () => BackHandler.exitApp() },
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