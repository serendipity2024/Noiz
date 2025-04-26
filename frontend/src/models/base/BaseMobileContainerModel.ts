/* eslint-disable import/no-default-export */
import { action, observable } from 'mobx';
import { ShortId } from '../../shared/type-definition/ZTypes';
import {
  ComponentLayoutConfiguration,
  ComponentModelLayout,
  ZedSupportedPlatform,
} from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import { DefaultComponentModelLayout } from './BaseComponentModel';
import BaseContainerModel from './BaseContainerModel';

export default abstract class BaseMobileContainerModel extends BaseContainerModel {
  public readonly applicablePlatforms: ZedSupportedPlatform[] = [
    ZedSupportedPlatform.WECHAT,
    ZedSupportedPlatform.MOBILE_WEB,
  ];

  public readonly isDraggable: boolean = true;

  @observable
  public isFloating = false;

  @observable
  public verticalLayout: ComponentModelLayout = DefaultComponentModelLayout;

  @observable
  public gridLayout = undefined;

  @observable
  public childMRefs: ShortId[] = [];

  @observable
  public isAdaptive = true;

  public getComponentFrame(): ZFrame {
    return this.componentFrame;
  }

  @action
  public setComponentFrame(frame: ZFrame): void {
    this.componentFrame = frame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: true,
    };
  }

  @observable
  private componentFrame: ZFrame = this.getDefaultComponentFrame();
}
