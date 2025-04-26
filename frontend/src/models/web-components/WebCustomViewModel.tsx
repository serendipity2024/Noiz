/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZWebViewFocusView from '../../components/focus-view/ZWebViewFocusView';
import ZWebCustomView, {
  WebCustomViewAttributes,
  ZWebCustomViewDefaultDataAttributes,
  ZWebCustomViewDefaultGridLayout,
  ZWebCustomViewDefaultReferenceAttributes,
} from '../../components/web-components/ZWebCustomView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseWebContainerModel from '../base/BaseWebContainerModel';
import ZGridLayout from '../interfaces/GridLayout';

export default class WebCustomViewModel extends BaseWebContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.WEB_CUSTOM_VIEW;

  @observable
  public gridLayout: ZGridLayout = ZWebCustomViewDefaultGridLayout;

  public defaultDataAttributes(): Record<string, any> {
    return ZWebCustomViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes: WebCustomViewAttributes = this.defaultDataAttributes() as WebCustomViewAttributes;

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as WebCustomViewModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZWebCustomViewDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZWebCustomView mRef={this.mRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZWebViewFocusView mRef={this.mRef} />;
  }
}
