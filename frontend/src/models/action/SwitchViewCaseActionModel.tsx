/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SwitchViewCaseHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import StoreHelpers from '../../mobx/StoreHelpers';
import ComponentModelType from '../../shared/type-definition/ComponentModelType';
import ConditionalContainerModel from '../mobile-components/ConditionalContainerModel';
import BaseComponentModel from '../base/BaseComponentModel';
import SwitchViewCaseActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SwitchViewCaseActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class SwitchViewCaseActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SWITCH_VIEW_CASE;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.SWITCH_VIEW_CASE,
      value: obj.name,
      target: obj.value,
      parent: obj.target,
    };
  }

  public getDependentList(
    eventBinding: SwitchViewCaseHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.parent,
        diffPathComponents,
        relation: eventBinding,
      },
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.target,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public getCascaderOption(componentModel: BaseComponentModel): CascaderOptionType | undefined {
    const screen = StoreHelpers.fetchRootModel(componentModel);
    if (screen) {
      const conditionalContainers = StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => model.type === ComponentModelType.CONDITIONAL_CONTAINER,
      }) as ConditionalContainerModel[];
      const getContainerFields = (container: ConditionalContainerModel) =>
        container.children().map((child) => ({
          isLeaf: true,
          name: child.componentName,
          value: child.mRef,
          target: container.mRef,
        }));
      const availableSwitchViewCases = conditionalContainers.map(
        (container: ConditionalContainerModel) => ({
          isLeaf: true,
          name: container.componentName,
          value: container.mRef,
          fields: getContainerFields(container),
        })
      );
      return {
        name: this.getName().action[this.type],
        value: this.type,
        fields: availableSwitchViewCases,
        isLeaf: false,
        disabled: !availableSwitchViewCases || availableSwitchViewCases.length === 0,
      };
    }
    return undefined;
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <SwitchViewCaseActionRow
        componentModel={componentModel}
        event={event as SwitchViewCaseHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
