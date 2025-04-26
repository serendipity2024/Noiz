/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZImage, {
  ImageAttributes,
  ZImageDefaultDataAttributes,
  ZImageDefaultFrame,
  ZImageDefaultReferenceAttributes,
} from '../../components/mobile-components/ZImage';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import {
  ImageSource,
  ImageSourceDefaultDataAttributes,
} from '../../components/side-drawer-tabs/right-drawer/config-row/ImageSourceConfigRow';

export default class ImageModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.IMAGE;

  public defaultDataAttributes(): Record<string, any> {
    return ZImageDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as ImageAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZImageDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as ImageModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZImageDefaultReferenceAttributes);

      if (clonedModel.dataAttributes.imageSource.effectiveValue !== ImageSource.UPLOAD) {
        super.resetDataAttributesToDefaultIfNecessary(
          clonedModel,
          ImageSourceDefaultDataAttributes
        );
      }
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZImage mRef={this.previewMRef} />;
  }
}
