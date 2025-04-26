/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  AudioHandleBinding,
  EventBinding,
  EventType,
  MediaAction,
} from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventProps } from '../interfaces/EventModel';
import AudioActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/AudioActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class AudioActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.AUDIO;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.AUDIO,
      src: DataBinding.withTextVariable(),
      action: obj.value,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
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
      <AudioActionRow
        componentModel={componentModel}
        event={event as AudioHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
