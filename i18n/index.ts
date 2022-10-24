import { I18n } from "i18n-js";
import { NativeModules } from 'react-native'

// For Android
const locale = NativeModules.I18nManager.localeIdentifier.split('_')[0]

type Translation = {
    search: string
    more: string
    nextEp: string
    addFav: string
    ok: string
    cancel: string
    exitTitle: string
    exitMsg: string
}

const en: Translation = {
    search: 'Search',
    more: 'More',
    nextEp: 'Next Ep',
    addFav: 'Add Fav',
    ok: 'OK',
    cancel: 'Cancel',
    exitTitle: 'Hold on!',
    exitMsg: 'Are you sure you want to go back?'
};

const zh: Translation = {
    search: '搜索',
    more: '更多',
    nextEp: '下集',
    addFav: '加入最爱',
    ok: '确定',
    cancel: '取消',
    exitTitle: '稍等!',
    exitMsg: '是否退出程序?'
};

export const i18n = new I18n({
    en,
    zh,
});

// fallback to defaultLocale if translation does not exist for current locale
i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.locale = locale