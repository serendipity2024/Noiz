import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import BatchEventActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/BatchEventActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class BatchMutationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.BATCH_MUTATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.BATCH_MUTATION,
      eventList: [],
      successActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <BatchEventActionRow componentModel={componentModel} event={event} onEventChange={onChange} />
    );
  }
}
