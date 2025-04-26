/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  MediaAction,
  VideoHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import VideoActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/VideoActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class VideoActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.VIDEO;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.VIDEO,
      action: obj.value,
    };
  }

  public getDependentList(
    eventBinding: VideoHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.target) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.target,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public getCascaderOption(): CascaderOptionType {
    return {
      name: this.getName().action[this.type],
      value: this.type,
      isLeaf: false,
      fields: Object.values(MediaAction).map((action) => ({
        name: this.getName().media[action],
        value: action,
        isLeaf: true,
      })),
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <VideoActionRow
        componentModel={componentModel}
        event={event as VideoHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
