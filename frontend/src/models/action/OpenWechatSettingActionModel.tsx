import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { BaseActionModel } from '../base/BaseActionModel';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import { Empty } from '../../zui';

export class OpenWechatSettingActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.OPEN_WECHAT_SETTING;

  public canSelect(): boolean {
    return AllStores.editorStore.editorPlatform === ZedSupportedPlatform.WECHAT;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.OPEN_WECHAT_SETTING,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(): React.ReactNode {
    return <Empty description={false} />;
  }
}
