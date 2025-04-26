import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ScrollPageToHandleBinding,
  ScrollPageToMode,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ScrollPageToActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ScrollPageToActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ScrollPageToActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SCROLL_PAGE_TO;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SCROLL_PAGE_TO,
      mode: ScrollPageToMode.TOP,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ScrollPageToActionRow
        componentModel={componentModel}
        event={event as ScrollPageToHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
