/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZMultiImagePicker, {
  ZMultiImagePickerDefaultDataAttributes,
  ZMultiImagePickerDefaultFrame,
  ZMultiImagePickerDefaultReferenceAttributes,
} from '../../components/mobile-components/ZMultiImagePicker';
import { ComponentModelLayout } from '../interfaces/ComponentModel';
import { VerticalDirection, VerticalLayoutMode } from '../../shared/type-definition/Layout';

export default class MultiImagePickerModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.MULTI_IMAGE_PICKER;

  public readonly isInput: boolean = true;

  @observable
  public verticalLayout: ComponentModelLayout = {
    location: VerticalDirection.TOP_DOWN,
    layoutMode: VerticalLayoutMode.WRAP_CONTENT,
  };

  public defaultDataAttributes(): Record<string, any> {
    return ZMultiImagePickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZMultiImagePickerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as MultiImagePickerModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZMultiImagePickerDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZMultiImagePicker mRef={this.previewMRef} />;
  }
}
