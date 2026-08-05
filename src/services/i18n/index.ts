import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import gu from './locales/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  mr: { translation: mr },
  bn: { translation: bn },
  te: { translation: te },
  ta: { translation: ta },
  gu: { translation: gu },
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  lng: typeof Localization.locale === 'string' ? Localization.locale.split('-')[0] : 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
