import React from 'react';
import uniqid from 'uniqid';
import ActionFlowRow from '../../components/side-drawer-tabs/right-drawer/action-row/ActionFlowRow';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  ActionFlowHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { BaseActionModel } from '../base/BaseActionModel';
import { EventProps } from '../interfaces/EventModel';

export class ActionFlowActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.ACTION_FLOW;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.ACTION_FLOW,
      successActions: [],
      failedActions: [],
      actionFlowId: '',
      actionId: uniqid.process(),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ActionFlowRow
        model={componentModel}
        event={event as ActionFlowHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
