/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZWechatNavigationBar, {
  ZWechatNavigationBarDefaultDataAttributes,
} from '../../components/mobile-components/ZWechatNavigationBar';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import { ComponentFrameConfiguration, ZedSupportedPlatform } from '../interfaces/ComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';

export default class WechatNavigationBarModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.WECHAT_NAVIGATION_BAR;

  public readonly applicablePlatforms: ZedSupportedPlatform[] = [ZedSupportedPlatform.WECHAT];

  public defaultDataAttributes(): Record<string, any> {
    return ZWechatNavigationBarDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: false,
      sizeEnabled: false,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZWechatNavigationBar mRef={this.mRef} />;
  }
}
