/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  CustomRequestBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import CustomMutationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/CustomMutationActionRow';
import { getCustomRequestRegistry } from '../../hooks/useCustomRequestRegistry';
import { AllStores } from '../../mobx/StoreContexts';
import { BaseActionModel } from '../base/BaseActionModel';

export class FunctorMutationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.FUNCTOR_API;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.FUNCTOR_API,
      value: obj.value,
      requestId: `${obj.value}_${uniqid.process()}`,
      invokeApiName: obj.invokeApiName,
      operation: obj.operation,
      input: obj.input,
      output: obj.output,
      functorId: obj.functorId,
      successActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public getCascaderOption(): CascaderOptionType | undefined {
    const { customFunctorMutations } = getCustomRequestRegistry(AllStores.coreStore);
    return customFunctorMutations.length > 0
      ? {
          name: this.getName().action[this.type],
          value: this.type,
          fields: customFunctorMutations.map((e) => ({
            ...e,
            name: e.value,
            isLeaf: true,
          })),
          isLeaf: false,
        }
      : undefined;
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <CustomMutationActionRow
        componentModel={componentModel}
        event={event as CustomRequestBinding}
        onEventChange={onChange}
      />
    );
  }
}
