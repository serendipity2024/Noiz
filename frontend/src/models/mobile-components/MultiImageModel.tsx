/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZMultiImage, {
  ZMultiImageDefaultDataAttributes,
  ZMultiImageDefaultFrame,
  ZMultiImageDefaultReferenceAttributes,
} from '../../components/mobile-components/ZMultiImage';
import { ComponentModelLayout } from '../interfaces/ComponentModel';
import { VerticalDirection, VerticalLayoutMode } from '../../shared/type-definition/Layout';

export default class MultiImageModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.MULTI_IMAGE;

  @observable
  public verticalLayout: ComponentModelLayout = {
    location: VerticalDirection.TOP_DOWN,
    layoutMode: VerticalLayoutMode.WRAP_CONTENT,
  };

  public defaultDataAttributes(): Record<string, any> {
    return ZMultiImageDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZMultiImageDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as MultiImageModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZMultiImageDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZMultiImage mRef={this.previewMRef} />;
  }
}
