import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventProps } from '../interfaces/EventModel';
import { BaseType } from '../../shared/type-definition/DataModel';
import OpenWebViewActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/OpenWebViewActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class OpenWebViewActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.OPEN_WEBVIEW;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.OPEN_WEBVIEW,
      src: DataBinding.withSingleValue(BaseType.TEXT),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <OpenWebViewActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
