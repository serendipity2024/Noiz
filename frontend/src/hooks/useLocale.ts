/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import useStores from './useStores';

export enum Locale {
  EN = 'EN',
  ZH = 'ZH',
}

export const LocaleSpelloutMap: Record<Locale, string> = {
  EN: 'English',
  ZH: '中文',
};

export type I18nContent<T extends Record<string, any>> = Record<Locale, T>;

interface HookReturnType<T> {
  localizedContent: I18nContent<T>[Locale];
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export default function useLocale<T extends Record<string, any>>(
  content: I18nContent<T>
): HookReturnType<T> {
  const { persistedStore } = useStores();
  const locale: Locale = useObserver(() => persistedStore.locale);

  useEffect(() => {
    if (!isValidI18nContent(content)) throw new Error('invalid i18n content');
  }, [content]);

  const localizedContent = (content as any)[locale];
  const setLoc = (target: Locale) => {
    if (target !== locale) persistedStore.setLocale(target);
  };

  return { localizedContent, locale, setLocale: setLoc };
}

export const isValidI18nContent = <T extends Record<string, any>>(
  content: I18nContent<T>
): boolean => {
  if (!content) return false;

  // shallow comparison
  const enKeys = Object.keys(content.EN);
  for (const [loc, locContent] of Object.entries(content)) {
    if (loc !== 'EN')
      for (const k of enKeys) {
        if (!locContent[k]) return false;
      }
  }
  return true;
};
