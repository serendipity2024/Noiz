import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  RefreshCellHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import RefreshCellActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/RefreshCellActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class RefreshCellActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.REFRESH_CELL;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.REFRESH_CELL,
    };
  }

  public getDependentList(
    eventBinding: RefreshCellHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.listMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.listMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <RefreshCellActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
