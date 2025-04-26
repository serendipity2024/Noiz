/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import BaseContainerModel from '../models/base/BaseContainerModel';
import BasicMobileModel from '../models/basic-components/BasicMobileModel';
import BasicWebModel from '../models/basic-components/BasicWebModel';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { ShortId } from '../shared/type-definition/ZTypes';
import useStores from './useStores';

export default function useScreenModels(): BaseContainerModel[] {
  const { coreStore, editorStore } = useStores();
  let screens: BaseContainerModel[];
  return useObserver(() => {
    switch (editorStore.editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        screens = coreStore.wechatRootMRefs.map(
          (mRef: ShortId) => coreStore.getModel(mRef) as BasicMobileModel
        );
        break;

      case ZedSupportedPlatform.MOBILE_WEB:
        screens = coreStore.mobileWebRootMRefs.map(
          (mRef: ShortId) => coreStore.getModel(mRef) as BasicMobileModel
        );
        break;
      case ZedSupportedPlatform.WEB:
        screens = coreStore.webRootMRefs.map(
          (mRef: ShortId) => coreStore.getModel(mRef) as BasicWebModel
        );
        break;
      default:
        break;
    }
    return screens;
  });
}

export function useScreenMRefs(): ShortId[] {
  const { coreStore, editorStore } = useStores();
  let screenMRefs: ShortId[];
  return useObserver(() => {
    switch (editorStore.editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        screenMRefs = coreStore.wechatRootMRefs;
        break;

      case ZedSupportedPlatform.MOBILE_WEB:
        screenMRefs = coreStore.mobileWebRootMRefs;
        break;
      case ZedSupportedPlatform.WEB:
        screenMRefs = coreStore.webRootMRefs;
        break;
      default:
        break;
    }
    return screenMRefs;
  });
}
