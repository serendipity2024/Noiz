import React from 'react';
import uniqid from 'uniqid';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SmsNotificationHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType } from '../../shared/type-definition/DataModel';
import { BaseActionModel } from '../base/BaseActionModel';
import SmsNotificationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SmsNotificationActionRow';

export class SmsNotificationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SMS_NOTIFICATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SMS_NOTIFICATION,
      id: uniqid.process(),
      templateId: '',
      phoneNumber: DataBinding.withSingleValue(BaseType.TEXT),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <SmsNotificationActionRow
        componentModel={componentModel}
        event={event as SmsNotificationHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
