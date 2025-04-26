import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetComponentOutputHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import SetComponentOutputActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SetComponentOutputActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import { DataBindingKind } from '../../shared/type-definition/DataBinding';

export class SetComponentOutputDataActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_COMPONENT_OUTPUT_DATA;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_COMPONENT_OUTPUT_DATA,
    };
  }

  public getDependentList(
    eventBinding: SetComponentOutputHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    const pathComponents = eventBinding.pathComponents ?? [];
    if (pathComponents.length <= 2) return [];
    const componentPathComponent = pathComponents[1];
    const dataPathComponent = pathComponents[2];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.SHARED_COMPONENT_OUTPUT,
        rootMRef: componentPathComponent.name,
        dataName: dataPathComponent.name,
        relation: {
          kind: DataBindingKind.VARIABLE,
          pathComponents,
        },
        diffPathComponents,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <SetComponentOutputActionRow
        componentModel={componentModel}
        event={event as SetComponentOutputHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
