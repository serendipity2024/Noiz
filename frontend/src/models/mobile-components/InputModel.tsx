/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZInput, {
  InputAttributes,
  ZInputDefaultDataAttributes,
  ZInputDefaultFrame,
  ZInputDefaultReferenceAttributes,
} from '../../components/mobile-components/ZInput';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';

export default class InputModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.INPUT;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZInputDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as InputAttributes;

  public get valueType(): string {
    return this.dataAttributes.defaultValue.type;
  }

  public getDefaultComponentFrame(): ZFrame {
    return ZInputDefaultFrame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: true,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as InputModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZInputDefaultReferenceAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZInput mRef={this.previewMRef} />;
  }
}
