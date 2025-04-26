/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZRichText, {
  RichTextAttributes,
  ZRichTextDefaultDataAttributes,
  ZRichTextDefaultFrame,
  ZRichTextDefaultReferenceAttributes,
} from '../../components/mobile-components/ZRichText';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';

export default class RichTextModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.RICH_TEXT;

  public defaultDataAttributes(): Record<string, any> {
    return ZRichTextDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as RichTextAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZRichTextDefaultFrame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: true,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as RichTextModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZRichTextDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZRichText mRef={this.previewMRef} />;
  }
}
