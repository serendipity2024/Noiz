/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZViewFocusView from '../../components/focus-view/ZViewFocusView';
import ZCustomView, {
  CustomViewAttributes,
  ZCustomViewDefaultDataAttributes,
  ZCustomViewDefaultFrame,
  ZCustomViewDefaultReferenceAttributes,
} from '../../components/mobile-components/ZCustomView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { FoldingMode } from '../../shared/type-definition/EventBinding';
import { StickyMode } from '../../shared/type-definition/Layout';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';

export default class CustomViewModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.CUSTOM_VIEW;

  public defaultDataAttributes(): Record<string, any> {
    return ZCustomViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes: CustomViewAttributes = this.defaultDataAttributes() as CustomViewAttributes;

  @observable
  public stickyMode?: StickyMode;

  @observable
  public stickyMarginTop?: number;

  public getDefaultComponentFrame(): ZFrame {
    return ZCustomViewDefaultFrame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      layoutModeEnabled: this.dataAttributes.foldingMode === FoldingMode.NONE,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as CustomViewModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZCustomViewDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCustomView mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZViewFocusView mRef={this.previewMRef} />;
  }
}
