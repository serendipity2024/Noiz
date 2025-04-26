/* eslint-disable import/no-default-export */
import { action, observable } from 'mobx';
import { ComponentModelLayout, ZedSupportedPlatform } from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import BaseComponentModel, { DefaultComponentModelLayout } from './BaseComponentModel';

export const DummyComponentFrame = {
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
};

export default abstract class BaseMobileComponentModel extends BaseComponentModel {
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

  public getComponentFrame(): ZFrame {
    return this.componentFrame;
  }

  @action
  public setComponentFrame(frame: ZFrame): void {
    this.componentFrame = frame;
  }

  @observable
  private componentFrame: ZFrame = this.getDefaultComponentFrame();
}
