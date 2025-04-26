import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  GenerateQRCodeHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import GenerateQRCodeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/GenerateQRCodeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class GenerateQRCodeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.GENERATE_QR_CODE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.GENERATE_QR_CODE,
      size: 430,
      assignTo: [],
      args: {},
      successActions: [],
      failedActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <GenerateQRCodeActionRow
        componentModel={componentModel}
        event={event as GenerateQRCodeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
