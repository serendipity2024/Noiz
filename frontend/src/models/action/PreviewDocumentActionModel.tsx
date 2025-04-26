import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  PreviewDocumentHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventProps } from '../interfaces/EventModel';
import { MediaType } from '../../shared/type-definition/DataModel';
import PreviewDocumentActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/PreviewDocumentActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class PreviewDocumentActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.PREVIEW_DOCUMENT;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.PREVIEW_DOCUMENT,
      fileId: DataBinding.withSingleValue(MediaType.FILE),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <PreviewDocumentActionRow
        componentModel={componentModel}
        event={event as PreviewDocumentHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
