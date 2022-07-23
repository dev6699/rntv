import React from "react";
import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";


export type TNavContext = ReturnType<typeof useNav>
export const NavContext = React.createContext<TNavContext>({} as TNavContext);
export const useNavContext = () => React.useContext(NavContext);

export const useNav = () => {
    const [page, setPage] = useState<'home' | 'category' | 'list' | 'detail' | 'play'>('home');

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

                case 'category':
                    setPage('home');
                    break;

                case 'list':
                    setPage('category');
                    break;

                case 'detail':
                    setPage('home');
                    break;

                case 'play':
                    setPage('detail');
                    break;

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
        setPage
    }
}