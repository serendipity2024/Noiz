/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZFilePicker, {
  ZFilePickerDefaultDataAttributes,
  ZFilePickerDefaultFrame,
} from '../../components/mobile-components/ZFilePicker';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class FilePickerModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.FILE_PICKER;

  public defaultDataAttributes(): Record<string, any> {
    return ZFilePickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZFilePickerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZFilePicker mRef={this.previewMRef} />;
  }
}
