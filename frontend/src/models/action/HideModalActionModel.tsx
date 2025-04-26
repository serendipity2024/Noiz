/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import StoreHelpers from '../../mobx/StoreHelpers';
import BaseComponentModel from '../base/BaseComponentModel';
import { BaseActionModel } from '../base/BaseActionModel';
import { Empty } from '../../zui';

export class HideModalActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.HIDE_MODAL;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.HIDE_MODAL,
      modalViewMRef: obj.value,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public getCascaderOption(componentModel: BaseComponentModel): CascaderOptionType | undefined {
    const modalViewList = StoreHelpers.fetchParentModalViewList(componentModel);
    if (modalViewList.length > 0) {
      return {
        name: this.getName().action[this.type],
        value: this.type,
        isLeaf: false,
        fields: modalViewList.map((model) => ({
          name: model.componentName,
          value: model.mRef,
          isLeaf: true,
        })),
      };
    }
    return undefined;
  }

  public renderForConfigRow(): React.ReactNode {
    return <Empty description={false} />;
  }
}
