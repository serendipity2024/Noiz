import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  CheckVerificationCodeHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import CheckVerificationCodeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/CheckVerificationCodeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class CheckVerificationCodeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.CHECK_VERIFICATION_CODE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.CHECK_VERIFICATION_CODE,
      target: DataBinding.withTextVariable(),
      verificationCode: DataBinding.withTextVariable(),
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
      <CheckVerificationCodeActionRow
        componentModel={componentModel}
        event={event as CheckVerificationCodeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
