import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import OpenRewardedVideoAdActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/OpenRewardedVideoAdActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class OpenRewardedVideoAdActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.OPEN_REWARDED_VIDEO_AD;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.OPEN_REWARDED_VIDEO_AD,
      advertId: '',
      onCloseWithEndedActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <OpenRewardedVideoAdActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
