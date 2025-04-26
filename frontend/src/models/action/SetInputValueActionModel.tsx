import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetInputValueHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import SetValueActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SetValueActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class SetInputValueActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_INPUT_VALUE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_INPUT_VALUE,
      targetMRef: '',
      value: DataBinding.withTextVariable(),
    };
  }

  public getDependentList(
    eventBinding: SetInputValueHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.targetMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.targetMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <SetValueActionRow
        componentModel={componentModel}
        event={event as SetInputValueHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
