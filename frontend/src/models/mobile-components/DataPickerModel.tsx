/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZDataPicker, {
  DataPickerAttributes,
  DataPickerMode,
  ZDataPickerDefaultDataAttributes,
  ZDataPickerDefaultFrame,
  ZDataPickerDefaultReferenceAttributes,
} from '../../components/mobile-components/ZDataPicker';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import DataBindingHelper from '../../utils/DataBindingHelper';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ZFrame from '../interfaces/Frame';

export default class DataPickerModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.DATA_PICKER;

  public readonly isList: boolean = true;

  public readonly isInput: boolean = true;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZDataPickerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as DataPickerAttributes;

  public get sourceType(): string | undefined {
    switch (this.dataAttributes.mode) {
      case DataPickerMode.DATE:
      case DataPickerMode.TIME: {
        return this.dataAttributes.valueType;
      }
      case DataPickerMode.OBJECT: {
        return DataBindingHelper.getListQueryDataType(this);
      }
      default:
        throw new Error(`DataPickerModel sourceType error: ${JSON.stringify(this)}`);
    }
  }

  public getDefaultComponentFrame(): ZFrame {
    return ZDataPickerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as DataPickerModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZDataPickerDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZDataPicker mRef={this.previewMRef} />;
  }
}
