/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZButton, {
  ButtonAttributes,
  ZButtonDefaultDataAttributes,
  ZButtonDefaultFrame,
  ZButtonDefaultReferenceAttributes,
} from '../../components/mobile-components/ZButton';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class ButtonModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.BUTTON;

  public defaultDataAttributes(): Record<string, any> {
    return ZButtonDefaultDataAttributes;
  }

  @observable
  public dataAttributes: ButtonAttributes = this.defaultDataAttributes() as ButtonAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZButtonDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as ButtonModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZButtonDefaultReferenceAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZButton mRef={this.previewMRef} />;
  }
}
