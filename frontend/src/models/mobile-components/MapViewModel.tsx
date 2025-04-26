/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZMapView, {
  ZMapDefaultReferenceAttributes,
  ZMapViewDefaultDataAttributes,
  ZMapViewDefaultFrame,
} from '../../components/mobile-components/ZMapView';

export default class MapViewModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.MAP_VIEW;

  public defaultDataAttributes(): Record<string, any> {
    return ZMapViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZMapViewDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as MapViewModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clonedModel, ZMapDefaultReferenceAttributes);
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZMapView mRef={this.previewMRef} />;
  }
}
