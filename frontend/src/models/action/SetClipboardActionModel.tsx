import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetClipboardHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import ClipboardActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ClipboardActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class SetClipboardActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_CLIPBOARD;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_CLIPBOARD,
      text: DataBinding.withTextVariable(),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ClipboardActionRow
        componentModel={componentModel}
        event={event as SetClipboardHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
