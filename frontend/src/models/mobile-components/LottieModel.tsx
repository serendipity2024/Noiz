/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZLottie, {
  ZLottieDefaultDataAttributes,
  LottieAttributes,
  ZLottieDefaultFrame,
} from '../../components/mobile-components/ZLottie';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class LottieModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.LOTTIE;

  public defaultDataAttributes(): Record<string, any> {
    return ZLottieDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as LottieAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZLottieDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZLottie mRef={this.previewMRef} />;
  }
}
