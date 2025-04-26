/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import { ShortId } from '../../shared/type-definition/ZTypes';
import {
  ComponentFrameConfiguration,
  ComponentModelLayout,
  ZedSupportedPlatform,
} from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import { DefaultComponentModelLayout } from './BaseComponentModel';
import BaseContainerModel from './BaseContainerModel';

export default abstract class BaseMobileSlotModel extends BaseContainerModel {
  public readonly applicablePlatforms: ZedSupportedPlatform[] = [
    ZedSupportedPlatform.WECHAT,
    ZedSupportedPlatform.MOBILE_WEB,
  ];

  public readonly isSlot: boolean = true;

  @observable
  public isFloating = false;

  @observable
  public verticalLayout: ComponentModelLayout = DefaultComponentModelLayout;

  @observable
  public gridLayout = undefined;

  public defaultDataAttributes(): Record<string, any> {
    return {};
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  @observable
  public childMRefs: ShortId[] = [];

  public getChildMRef(): string | undefined {
    // expect exactly one child in the slot
    return this.childMRefs.length === 1 ? this.childMRefs[0] : undefined;
  }

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: false,
      sizeEnabled: false,
    };
  }

  public hasDeleteConfiguration(): boolean {
    return false;
  }

  public getComponentFrame(): ZFrame {
    return this.getDefaultComponentFrame();
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return null;
  }
}
