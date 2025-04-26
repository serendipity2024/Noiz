import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { BaseActionModel } from '../base/BaseActionModel';
import { Empty } from '../../zui';

export class FullscreenImageActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.FULLSCREEN_IMAGE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.FULLSCREEN_IMAGE,
    };
  }

  public canSelect(): boolean {
    return false;
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(): React.ReactNode {
    return <Empty description={false} />;
  }
}
