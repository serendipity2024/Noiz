import React from 'react';
import ShowToastActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ShowToastActionRow';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import {
  EventBinding,
  EventType,
  ShowToastHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { BaseActionModel } from '../base/BaseActionModel';

export class ShowToastActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SHOW_TOAST;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SHOW_TOAST,
      title: DataBinding.withTextVariable(),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ShowToastActionRow
        componentModel={componentModel}
        event={event as ShowToastHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
