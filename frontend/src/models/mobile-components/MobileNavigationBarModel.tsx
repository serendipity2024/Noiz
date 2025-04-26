/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZMobileNavigationBar, {
  MobileNavigationBarAttributes,
  ZMobileNavigationBarDefaultDataAttributes,
} from '../../components/mobile-components/ZMobileNavigationBar';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import {
  ComponentFrameConfiguration,
  ComponentLayoutConfiguration,
  ZedSupportedPlatform,
} from '../interfaces/ComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';

export default class MobileNavigationBarModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.MOBILE_NAVIGATION_BAR;

  public readonly applicablePlatforms: ZedSupportedPlatform[] = [ZedSupportedPlatform.MOBILE_WEB];

  public defaultDataAttributes(): Record<string, any> {
    return ZMobileNavigationBarDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as MobileNavigationBarAttributes;

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: false,
      sizeEnabled: false,
    };
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      floatEnabled: false,
      locationEnabled: false,
      layoutModeEnabled: false,
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
    return <ZMobileNavigationBar mRef={this.mRef} />;
  }
}
