/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import ZModalView, { ZModalViewDefaultFrame } from '../../components/mobile-components/ZModalView';
import ZModalViewFocusView, {
  ModalViewAttributes,
  ZModalViewDefaultDataAttributes,
} from '../../components/focus-view/ZModalViewFocusView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ZFrame from '../interfaces/Frame';
import { ComponentLayoutConfiguration } from '../interfaces/ComponentModel';

export default class ModalViewModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.MODAL_VIEW;

  @observable
  public isFloating = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZModalViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as ModalViewAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZModalViewDefaultFrame;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      floatEnabled: false,
    };
  }

  public hasDeleteConfiguration(): boolean {
    return false;
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  public canCopy(): boolean {
    return true;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZModalView mRef={this.mRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZModalViewFocusView mRef={this.mRef} />;
  }
}
