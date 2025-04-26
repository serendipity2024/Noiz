/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZImagePicker, {
  ZImagePickerDefaultDataAttributes,
  ZImagePickerDefaultFrame,
} from '../../components/mobile-components/ZImagePicker';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import { ImageSourceDefaultDataAttributes } from '../../components/side-drawer-tabs/right-drawer/config-row/ImageSourceConfigRow';

export default class ImagePickerModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.IMAGE_PICKER;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZImagePickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZImagePickerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as ImagePickerModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ImageSourceDefaultDataAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZImagePicker mRef={this.previewMRef} />;
  }
}
