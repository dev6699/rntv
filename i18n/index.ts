import { I18n } from "i18n-js";
import { NativeModules } from 'react-native'

// For Android
const locale = NativeModules.I18nManager.localeIdentifier.split('_')[0]

type Translation = {
    search: string
    more: string
    nextEp: string
    addFav: string
}

const en: Translation = {
    search: 'Search',
    more: 'More',
    nextEp: 'Next Ep',
    addFav: 'Add Fav'
};

const zh: Translation = {
    search: '搜索',
    more: '更多',
    nextEp: '下集',
    addFav: '加入最爱'
};

export const i18n = new I18n({
    en,
    zh,
});

// fallback to defaultLocale if translation does not exist for current locale
i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.locale = locale