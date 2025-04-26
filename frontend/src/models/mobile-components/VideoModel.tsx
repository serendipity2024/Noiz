/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZVideo, {
  ZVideoDefaultDataAttributes,
  ZVideoDefaultFrame,
} from '../../components/mobile-components/ZVideo';
import { VideoSourceDefaultDataAttributes } from '../../components/side-drawer-tabs/right-drawer/config-row/VideoSourceConfigRow';

export default class VideoModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.VIDEO;

  public defaultDataAttributes(): Record<string, any> {
    return ZVideoDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZVideoDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as VideoModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, VideoSourceDefaultDataAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZVideo mRef={this.previewMRef} />;
  }
}
