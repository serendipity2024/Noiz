import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  UserRegisterActionHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import UserRegisterActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/UserRegisterActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class UserRegisterActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.USER_REGISTER;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.USER_REGISTER,
      registrationForm: {
        email: DataBinding.withTextVariable(),
        emailVerificationCode: DataBinding.withTextVariable(),
        username: DataBinding.withTextVariable(),
        password: DataBinding.withTextVariable(),
        verifyPassword: DataBinding.withTextVariable(),
      },
      successActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <UserRegisterActionRow
        componentModel={componentModel}
        event={event as UserRegisterActionHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
