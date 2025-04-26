/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  UserLoginActionHandleBinding,
  UserLoginActionType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import UserLoginActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/UserLoginActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import BaseComponentModel from '../base/BaseComponentModel';

export class UserLoginActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.USER_LOGIN;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.USER_LOGIN,
      value: obj.value,
      successActions: [],
      failedActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public getCascaderOption(
    componentModel: BaseComponentModel,
    enabledSubTypes: string[] | undefined
  ): CascaderOptionType | undefined {
    if (enabledSubTypes) {
      return {
        name: this.getName().action[this.type],
        value: this.type,
        fields: enabledSubTypes.map((value) => ({
          name: this.getName().userLogin[value as UserLoginActionType],
          value,
          isLeaf: true,
        })),
        isLeaf: false,
      };
    }
    return {
      name: this.getName().action[this.type],
      value: this.type,
      fields: Object.values(UserLoginActionType).map((value) => ({
        name: this.getName().userLogin[value],
        value,
        isLeaf: true,
      })),
      isLeaf: false,
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <UserLoginActionRow
        componentModel={componentModel}
        event={event as UserLoginActionHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
