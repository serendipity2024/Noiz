/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  ConditionalActionHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ConditionalActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ConditionalActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ConditionalActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.CONDITIONAL;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.CONDITIONAL,
      conditionalActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ConditionalActionRow
        componentModel={componentModel}
        event={event as ConditionalActionHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
