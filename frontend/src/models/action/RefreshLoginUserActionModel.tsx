import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { BaseActionModel } from '../base/BaseActionModel';

export class RefreshLoginUserActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.REFRESH_LOGIN_USER;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.REFRESH_LOGIN_USER,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public getCascaderOption(): CascaderOptionType {
    return {
      name: this.getName().action[EventType.REFRESH_LOGIN_USER],
      value: this.type,
      isLeaf: true,
    };
  }

  public renderForConfigRow(): React.ReactNode {
    return null;
  }
}
