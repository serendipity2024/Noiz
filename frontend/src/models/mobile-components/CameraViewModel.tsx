/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZCameraView, {
  ZCameraDefaultDataAttributes,
  CameraViewAttributes,
  ZCameraViewDefaultFrame,
} from '../../components/mobile-components/ZCameraView';

export default class CameraViewModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.CAMERA_VIEW;

  public defaultDataAttributes(): Record<string, any> {
    return ZCameraDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as CameraViewAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZCameraViewDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCameraView mRef={this.previewMRef} />;
  }
}
