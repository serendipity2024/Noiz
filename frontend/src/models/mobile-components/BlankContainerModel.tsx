/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { observable } from 'mobx';
import React from 'react';
import ZBlankContainer, {
  BlankContainerAttributes,
  ZBlankContainerDefaultDataAttributes,
  ZBlankContainerDefaultReferenceAttributes,
} from '../../components/mobile-components/ZBlankContainer';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import {
  ComponentFrameConfiguration,
  ComponentLayoutConfiguration,
} from '../interfaces/ComponentModel';

export default class BlankContainerModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.BLANK_CONTAINER;

  public defaultDataAttributes(): Record<string, any> {
    return ZBlankContainerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as BlankContainerAttributes;

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: false,
      sizeEnabled: false,
    };
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      floatEnabled: false,
    };
  }

  public hasDeleteConfiguration(): boolean {
    return false;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as BlankContainerModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZBlankContainerDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZBlankContainer mRef={this.previewMRef} />;
  }
}
