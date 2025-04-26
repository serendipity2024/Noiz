import { useObserver } from 'mobx-react';
import CoreStore from '../mobx/stores/CoreStore';
import { CompositeConfiguration } from '../mobx/stores/CoreStoreDataType';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import useStores from './useStores';

export function useConfiguration(): CompositeConfiguration {
  const { coreStore, editorStore } = useStores();
  return useObserver(() => getConfiguration(coreStore, editorStore.editorPlatform));
}

export function getConfiguration(
  coreStore: CoreStore,
  editorPlatform: ZedSupportedPlatform
): CompositeConfiguration {
  let configuration: CompositeConfiguration;
  switch (editorPlatform) {
    case ZedSupportedPlatform.WECHAT:
      configuration = coreStore.wechatConfiguration;
      break;
    case ZedSupportedPlatform.WEB:
      configuration = coreStore.webConfiguration;
      break;
    case ZedSupportedPlatform.MOBILE_WEB:
      configuration = coreStore.mobileWebConfiguration;
      break;
    default:
      configuration = coreStore.wechatConfiguration;
  }
  return configuration;
}
