import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SendVerificationCodeHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import SendVerificationCodeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/SendVerificationCodeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class SendVerificationCodeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SEND_VERIFICATION_CODE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SEND_VERIFICATION_CODE,
      target: DataBinding.withTextVariable(),
      contactType: 'phone',
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
      <SendVerificationCodeActionRow
        componentModel={componentModel}
        event={event as SendVerificationCodeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
