import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  CallPhoneHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import CallPhoneActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/CallPhoneActionRow';
import { EventProps } from '../interfaces/EventModel';
import { BaseActionModel } from '../base/BaseActionModel';

export class CallPhoneActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.CALL_PHONE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.CALL_PHONE,
      phoneNumber: DataBinding.withTextVariable(),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <CallPhoneActionRow
        componentModel={componentModel}
        event={event as CallPhoneHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
