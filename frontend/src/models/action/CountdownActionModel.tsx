/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  CountdownAction,
  CountdownHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import CountdownActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/CountdownActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class CountdownActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.COUNTDOWN;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.COUNTDOWN,
      action: obj.value,
      targetMRef: '',
    };
  }

  public getDependentList(
    eventBinding: CountdownHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.targetMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.targetMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public getCascaderOption(): CascaderOptionType {
    return {
      name: this.getName().action.countdown,
      value: this.type,
      isLeaf: false,
      fields: Object.values(CountdownAction).map((action) => ({
        name: this.getName().countdown[action],
        value: action,
        isLeaf: true,
      })),
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <CountdownActionRow
        componentModel={componentModel}
        event={event as CountdownHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
