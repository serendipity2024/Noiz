/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZVideoPicker, {
  ZVideoPickerDefaultDataAttributes,
  ZVideoPickerDefaultFrame,
} from '../../components/mobile-components/ZVideoPicker';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class VideoPickerModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.VIDEO_PICKER;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZVideoPickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZVideoPickerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZVideoPicker mRef={this.previewMRef} />;
  }
}
