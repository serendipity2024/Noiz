/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../utils/ZConst';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import ZFrame from '../interfaces/Frame';
import ZCustomMultiImagePicker, {
  CustomMultiImagePickerAttributes,
  ZCustomMultiImagePickerDefaultDataAttributes,
  ZCustomMultilmagePickerDefaultFrame,
} from '../../components/mobile-components/ZCustomMultiImagePicker';
import ZCustomMultiImagePickerFocusView from '../../components/focus-view/ZCustomMultiImagePickerFocusView';
import { IntegerType, MediaType } from '../../shared/type-definition/DataModel';

export default class CustomMultiImagePickerModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER;

  public readonly isList: boolean = true;

  public readonly isInput: boolean = true;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZCustomMultiImagePickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as CustomMultiImagePickerAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZCustomMultilmagePickerDefaultFrame;
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    const itemSize = { width: 100, height: this.getComponentFrame().size?.height ?? 0 };
    const imageContainer = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileContainerModel;
    const addContainer = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileContainerModel;
    imageContainer.setComponentFrame({
      ...imageContainer.getComponentFrame(),
      size: itemSize,
    });
    addContainer.setComponentFrame({
      ...addContainer.getComponentFrame(),
      size: itemSize,
    });
    imageContainer.dataAttributes.backgroundColor = DataBinding.withColor(ZThemedColors.ACCENT);
    addContainer.dataAttributes.backgroundColor = DataBinding.withColor(
      ZThemedColors.SECONDARY_TEXT
    );

    this.dataAttributes.imageContainerMRef = imageContainer.mRef;
    this.dataAttributes.addContainerMRef = addContainer.mRef;
    this.unsavedChildren = [imageContainer, addContainer];

    this.localVariableTable = {
      item: {
        type: MediaType.IMAGE,
      },
      index: {
        type: IntegerType.INTEGER,
      },
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as CustomMultiImagePickerModel;
    if (!clonedModel) return null;

    const [imageContainerMRef, addContainerMRef] = clonedModel.unsavedChildren.map((e) => e.mRef);
    clonedModel.dataAttributes.imageContainerMRef = imageContainerMRef;
    clonedModel.dataAttributes.addContainerMRef = addContainerMRef;

    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCustomMultiImagePicker mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZCustomMultiImagePickerFocusView mRef={this.previewMRef} />;
  }
}
