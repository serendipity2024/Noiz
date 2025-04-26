import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ScanQRCodeHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ScanQRCodeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ScanQRCodeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ScanQRCodeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SCAN_QR_CODE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SCAN_QR_CODE,
      expectedFields: {},
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
      <ScanQRCodeActionRow
        componentModel={componentModel}
        event={event as ScanQRCodeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
