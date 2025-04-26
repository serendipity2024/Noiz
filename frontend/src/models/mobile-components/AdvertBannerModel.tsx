/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZAdvertBanner, {
  AdvertBannerAttributes,
  ZAdvertBannerDefaultDataAttributes,
  ZAdvertBannerDefaultFrame,
} from '../../components/mobile-components/ZAdvertBanner';
import { ComponentFrameConfiguration } from '../interfaces/ComponentModel';

export default class AdvertBannerModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.ADVERT_BANNER;

  public defaultDataAttributes(): Record<string, any> {
    return ZAdvertBannerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as AdvertBannerAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZAdvertBannerDefaultFrame;
  }

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: true,
      sizeEnabled: false,
    };
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZAdvertBanner mRef={this.previewMRef} />;
  }
}
