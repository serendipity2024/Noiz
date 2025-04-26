import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetGlobalDataHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import SetGlobalDataActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SetGlobalDataActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import { DataBindingKind } from '../../shared/type-definition/DataBinding';

export class SetGlobalDataActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_GLOBAL_DATA;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_GLOBAL_DATA,
    };
  }

  public getDependentList(
    eventBinding: SetGlobalDataHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    const pathComponents = eventBinding.pathComponents ?? [];
    if (pathComponents.length <= 0) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.GLOBAL_VARIABLE_TABLE,
        dataName: pathComponents[0].name,
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
      <SetGlobalDataActionRow
        componentModel={componentModel}
        event={event as SetGlobalDataHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
