/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZIcon, {
  ZIconDefaultDataAttributes,
  ZIconDefaultFrame,
  ZIconDefaultReferenceAttributes,
} from '../../components/mobile-components/ZIcon';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class IconModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.ICON;

  public defaultDataAttributes(): Record<string, any> {
    return ZIconDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZIconDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as IconModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZIconDefaultReferenceAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZIcon mRef={this.previewMRef} />;
  }
}
