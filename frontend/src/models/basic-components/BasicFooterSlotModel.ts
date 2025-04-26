/* eslint-disable import/no-default-export */
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import { DummyComponentFrame } from '../base/BaseMobileComponentModel';
import BaseMobileSlotModel from '../base/BaseMobileSlotModel';
import ZFrame from '../interfaces/Frame';

export default class BasicFooterSlotModel extends BaseMobileSlotModel {
  public readonly type: ComponentModelType = ComponentModelType.SLOT_FOOTER;

  public defaultComponentFrame(): ZFrame {
    return DummyComponentFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as BasicFooterSlotModel;
    clonedModel.childMRefs = [];
    clonedModel.unsavedChildren = [];
    return clonedModel;
  }
}
