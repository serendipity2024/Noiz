/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  RerunConditionHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import StoreHelpers from '../../mobx/StoreHelpers';
import ComponentModelType from '../../shared/type-definition/ComponentModelType';
import ConditionalContainerModel from '../mobile-components/ConditionalContainerModel';
import BaseComponentModel from '../base/BaseComponentModel';
import RerunConditionActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/RerunConditionActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class RerunConditionActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.RERUN_CONDITION;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.RERUN_CONDITION,
      value: obj.value,
    };
  }

  public getDependentList(
    eventBinding: RerunConditionHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.value,
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
      const containerFields = conditionalContainers.map((container: ConditionalContainerModel) => ({
        isLeaf: true,
        name: container.componentName,
        value: container.mRef,
      }));
      return {
        name: this.getName().action[this.type],
        value: this.type,
        fields: containerFields,
        isLeaf: false,
        disabled: !containerFields || containerFields.length === 0,
      };
    }
    return undefined;
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    return <RerunConditionActionRow event={props.event as RerunConditionHandleBinding} />;
  }
}
