/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZSwitchInput, {
  ZSwitchInputDefaultDataAttributes,
  ZSwitchInputDefaultFrame,
} from '../../components/mobile-components/ZSwitch';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import { ComponentFrameConfiguration } from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';

export default class SwitchModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.SWITCH;

  public readonly isInput: boolean = true;

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZSwitchInputDefaultFrame;
  }

  public defaultDataAttributes(): Record<string, any> {
    return ZSwitchInputDefaultDataAttributes;
  }

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: true,
      sizeEnabled: false,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  public renderForPreview(): React.ReactNode {
    return <ZSwitchInput mRef={this.previewMRef} />;
  }
}
