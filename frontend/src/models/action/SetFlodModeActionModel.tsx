import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetFlodModeHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import SetFoldModeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SetFoldModeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class SetFlodModeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_FOLD_MODE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_FOLD_MODE,
    };
  }

  public getDependentList(
    eventBinding: SetFlodModeHandleBinding,
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
      <SetFoldModeActionRow
        componentModel={componentModel}
        event={event as SetFlodModeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
