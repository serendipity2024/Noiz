import React from 'react';
import uniqid from 'uniqid';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  WechatNotificationHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
import WechatNotificationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/WechatNotificationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class WechatNotificationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.WECHAT_NOTIFICATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.WECHAT_NOTIFICATION,
      id: uniqid.process(),
      templateId: '',
      accountId: DataBinding.withSingleValue(IntegerType.INTEGER),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <WechatNotificationActionRow
        componentModel={componentModel}
        event={event as WechatNotificationHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
