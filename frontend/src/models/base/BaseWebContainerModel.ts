/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import { ShortId } from '../../shared/type-definition/ZTypes';
import {
  ComponentFrameConfiguration,
  ComponentLayoutConfiguration,
  ZedSupportedPlatform,
} from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import ZGridLayout, { DEFAULT_GRID_LAYOUT } from '../interfaces/GridLayout';
import BaseContainerModel from './BaseContainerModel';
import { DummyComponentFrame } from './BaseMobileComponentModel';

export enum WebContainerCompactType {
  VERTICAL = 'vertical',
  Horizontal = 'horizontal',
}
export default abstract class BaseWebContainerModel extends BaseContainerModel {
  public readonly applicablePlatforms: ZedSupportedPlatform[] = [ZedSupportedPlatform.WEB];

  @observable
  public isFloating = undefined;

  @observable
  public verticalLayout = undefined;

  @observable
  public gridLayout: ZGridLayout = DEFAULT_GRID_LAYOUT;

  public autoSize = false;

  @observable
  public compactType = WebContainerCompactType.VERTICAL;

  @observable
  public childMRefs: ShortId[] = [];

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
