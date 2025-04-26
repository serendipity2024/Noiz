import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  UploadFileHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import UploadFileActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/UploadFileActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class UploadFileActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.UPLOAD_FILE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.UPLOAD_FILE,
      successActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <UploadFileActionRow
        componentModel={componentModel}
        event={event as UploadFileHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
