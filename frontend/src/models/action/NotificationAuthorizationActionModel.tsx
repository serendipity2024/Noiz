import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  NotificationAuthorizationHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import NotificationAuthorizationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/NotificationAuthorizationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class NotificationAuthorizationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.NOTIFICATION_AUTHORIZATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.NOTIFICATION_AUTHORIZATION,
      templateIds: [],
      successActions: [],
      failedActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <NotificationAuthorizationActionRow
        componentModel={componentModel}
        event={event as NotificationAuthorizationHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
