import React from 'react';
import uniqid from 'uniqid';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ListActionHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ListActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ListActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ListActionActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.LIST_ACTION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.LIST_ACTION,
      id: `${EventType.LIST_ACTION}-${uniqid.process()}`,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ListActionRow
        componentModel={componentModel}
        event={event as ListActionHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
