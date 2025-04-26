/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZNumberInput, {
  ZNumberInputDefaultDataAttributes,
  ZNumberInputDefaultFrame,
  ZNumberInputDefaultReferenceAttributes,
} from '../../components/mobile-components/ZNumberInput';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class NumberInputModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.NUMBER_INPUT;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZNumberInputDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZNumberInputDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as NumberInputModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZNumberInputDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZNumberInput mRef={this.previewMRef} />;
  }
}
