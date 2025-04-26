import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import LogActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/LogActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class LogActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.LOG;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.LOG,
      title: 'default',
      args: {},
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return <LogActionRow componentModel={componentModel} event={event} onEventChange={onChange} />;
  }
}
