/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZProgressBar, {
  ProgressBarAttributes,
  ZProgressBarDefaultFrame,
  ZProgressBarDefaultDataAttributes,
} from '../../components/mobile-components/ZProgressBar';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { IntegerType } from '../../shared/type-definition/DataModel';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';

export default class ProgressBarModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.PROGRESS_BAR;

  public defaultDataAttributes(): Record<string, any> {
    return ZProgressBarDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as ProgressBarAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZProgressBarDefaultFrame;
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    this.localVariableTable = {
      progress: {
        type: IntegerType.INTEGER,
      },
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZProgressBar mRef={this.previewMRef} />;
  }
}
