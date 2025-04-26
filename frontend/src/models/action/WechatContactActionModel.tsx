import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { BaseActionModel } from '../base/BaseActionModel';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import { Empty } from '../../zui';

export class WechatContactActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.WECHAT_CONTACT;

  public canSelect(): boolean {
    return AllStores.editorStore.editorPlatform === ZedSupportedPlatform.WECHAT;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.WECHAT_CONTACT,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(): React.ReactNode {
    return <Empty description={false} />;
  }
}
