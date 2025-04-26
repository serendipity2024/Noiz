/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import {
  ComponentFrameConfiguration,
  ComponentLayoutConfiguration,
  ZedSupportedPlatform,
} from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import ZGridLayout, { DEFAULT_GRID_LAYOUT } from '../interfaces/GridLayout';
import BaseComponentModel from './BaseComponentModel';

export const DummyComponentFrame = {
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
};

export default abstract class BaseWebComponentModel extends BaseComponentModel {
  public readonly applicablePlatforms: ZedSupportedPlatform[] = [ZedSupportedPlatform.WEB];

  @observable
  public isFloating = undefined;

  @observable
  public verticalLayout = undefined;

  @observable
  public gridLayout: ZGridLayout = DEFAULT_GRID_LAYOUT;

  @observable
  public autoSize = false;

  public getComponentFrame(): ZFrame {
    return DummyComponentFrame;
  }

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
}
