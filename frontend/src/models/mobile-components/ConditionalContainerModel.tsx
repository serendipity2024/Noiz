/* eslint-disable import/no-default-export */
import { action, observable } from 'mobx';
import React from 'react';
import ZConditionalContainerFocusView from '../../components/focus-view/ZConditionalContainerFocusView';
import ZConditionalContainer, {
  ZConditionalContainerDefaultDataAttributes,
  ZConditionalContainerDefaultFrame,
} from '../../components/mobile-components/ZConditionalContainer';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import { Conditional, DefaultConditionName } from '../interfaces/ContainerModel';
import ZFrame from '../interfaces/Frame';
import ConditionalContainerChildModel from './ConditionalContainerChildModel';

export default class ConditionalContainerModel
  extends BaseMobileContainerModel
  implements Conditional
{
  constructor(parentMRef: ShortId) {
    super(parentMRef);
    if (this.childMRefs.length + this.unsavedChildren.length < 1) {
      this.createChild(DefaultConditionName, true);
      this.unsavedChildren[0].componentName = DefaultConditionName;
    }
  }

  public readonly type: ComponentModelType = ComponentModelType.CONDITIONAL_CONTAINER;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZConditionalContainerDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZConditionalContainerDefaultFrame;
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // conditional logics
  @action
  public createChild(name: string, isDefault = false): void {
    const child = new ConditionalContainerChildModel(this.mRef, isDefault);
    child.componentName = name;
    this.unsavedChildren.unshift(child);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZConditionalContainer mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZConditionalContainerFocusView mRef={this.previewMRef} />;
  }
}
