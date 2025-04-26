import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  RefreshHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import RefreshComponentActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/RefreshComponentActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class RefreshActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.REFRESH;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.REFRESH,
      refreshList: [],
    };
  }

  public getDependentList(
    eventBinding: RefreshHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    return eventBinding.refreshList
      .filter((mRef) => mRef && mRef.length > 0)
      .map((mRef) => ({
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: mRef,
        diffPathComponents,
        relation: eventBinding,
      }));
  }

  public getCascaderOption(): CascaderOptionType {
    return {
      name: this.getName().action.refresh,
      value: this.type,
      isLeaf: true,
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <RefreshComponentActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
