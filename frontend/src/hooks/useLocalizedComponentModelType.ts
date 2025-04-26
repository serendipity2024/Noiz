/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import { isValidI18nContent, Locale } from './useLocale';
import i18n from './useLocalizedComponentModelType.i18n.json';
import useStores from './useStores';

export default function useLocalizedComponentModelType(): (type: ComponentModelType) => string {
  const { persistedStore } = useStores();
  const locale = useObserver(() => persistedStore.locale);

  return (type: ComponentModelType) => getLocalizedComponentModelType(locale, type);
}

function getLocalizedComponentModelType(locale: Locale, key: ComponentModelType): string {
  return i18n[locale][key];
}

const isValidLocalizedComponentModelTypeContent = (): boolean => {
  if (!isValidI18nContent(i18n)) return false;
  const i18nKeys = new Set(Object.keys(i18n.EN));
  for (const key of Object.values(ComponentModelType)) {
    if (!i18nKeys.has(key)) return false;
  }
  return true;
};

if (!isValidLocalizedComponentModelTypeContent())
  throw new Error('invalid i18n content for `LocalizedComponentModelType`');
