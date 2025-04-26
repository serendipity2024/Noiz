/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZScrollView, {
  ZScrollViewDefaultDataAttributes,
  ZScrollViewDefaultFrame,
} from '../../components/mobile-components/ZScrollView';
import ZViewFocusView from '../../components/focus-view/ZViewFocusView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ZFrame from '../interfaces/Frame';

export default class ScrollViewModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.SCROLL_VIEW;

  public defaultDataAttributes(): Record<string, any> {
    return ZScrollViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZScrollViewDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZScrollView mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZViewFocusView mRef={this.previewMRef} />;
  }
}
