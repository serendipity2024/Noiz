/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZCountDown, {
  CountDownAttributes,
  ZCountDownDefaultDataAttributes,
  ZCountDownDefaultFrame,
  ZCountDownDefaultReferenceAttributes,
} from '../../components/mobile-components/ZCountDown';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class CountDownModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.COUNT_DOWN;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZCountDownDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as CountDownAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZCountDownDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as CountDownModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZCountDownDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCountDown mRef={this.previewMRef} />;
  }
}
