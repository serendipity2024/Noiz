/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZStatusBar from '../../components/mobile-components/ZStatusBar';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel, { DummyComponentFrame } from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class StatusBarModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.MOBILE_STATUS_BAR;

  public defaultDataAttributes(): Record<string, any> {
    return {};
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return DummyComponentFrame;
  }

  public getComponentFrame(): ZFrame {
    return this.getDefaultComponentFrame();
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZStatusBar key={this.mRef.toString()} />;
  }
}
