/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZText, {
  ZTextDefaultDataAttributes,
  ZTextDefaultFrame,
  ZTextDefaultReferenceAttributes,
} from '../../components/mobile-components/ZText';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';

export default class TextModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.TEXT;

  public defaultDataAttributes(): Record<string, any> {
    return ZTextDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZTextDefaultFrame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: true,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as TextModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZTextDefaultReferenceAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZText mRef={this.previewMRef} />;
  }
}
