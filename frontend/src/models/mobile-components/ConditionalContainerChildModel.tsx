/* eslint-disable import/no-default-export */
import { action, observable } from 'mobx';
import React from 'react';
import ZConditionalContainerChild, {
  ZConditionalContainerChildDefaultDataAttributes,
  ZConditionalContainerChildDefaultReferenceAttributes,
} from '../../components/mobile-components/ZConditionalContainerChild';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import ConstantCondition, {
  ConstantConditionType,
} from '../../shared/type-definition/conditions/ConstantCondition';
import { AllCondition } from '../../shared/type-definition/conditions/Condition';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import {
  ComponentFrameConfiguration,
  ComponentLayoutConfiguration,
} from '../interfaces/ComponentModel';
import { ConditionalChild } from '../interfaces/ContainerModel';
import ZFrame from '../interfaces/Frame';

export default class ConditionalContainerChildModel
  extends BaseMobileContainerModel
  implements ConditionalChild
{
  constructor(parentMRef: ShortId, isDefault = false) {
    super(parentMRef);

    this.isDefaultCase = isDefault;
    this.initIfCondition = this.isDefaultCase
      ? ConstantCondition.from(ConstantConditionType.DEFAULT)
      : ConstantCondition.from(ConstantConditionType.ALWAYS);
  }

  public readonly type: ComponentModelType = ComponentModelType.CONDITIONAL_CONTAINER_CHILD;

  public defaultDataAttributes(): Record<string, any> {
    return ZConditionalContainerChildDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getComponentFrame(): ZFrame {
    return this.parent().getComponentFrame();
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as ConditionalContainerChildModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZConditionalContainerChildDefaultReferenceAttributes
      );
      clonedModel.initIfCondition = this.isDefaultCase
        ? ConstantCondition.from(ConstantConditionType.DEFAULT)
        : ConstantCondition.from(ConstantConditionType.ALWAYS);
    }
    return clonedModel;
  }

  public canCreateComponentTemplate(): boolean {
    return false;
  }

  // switching cases
  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: false,
      sizeEnabled: false,
    };
  }

  public readonly isDefaultCase: boolean;

  @observable
  public initIfCondition: AllCondition;

  @action
  public setInitIfCondition(condition: AllCondition): void {
    this.initIfCondition = condition;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZConditionalContainerChild mRef={this.previewMRef} />;
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      ...super.getLayoutConfiguration(),
      floatEnabled: false,
    };
  }

  public hasDeleteConfiguration(): boolean {
    return !this.isDefaultCase;
  }
}
