import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ScrollToHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ScrollToActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ScrollToActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class ScrollToActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SCROLL_TO;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SCROLL_TO,
    };
  }

  public getDependentList(
    eventBinding: ScrollToHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.target) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.target,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ScrollToActionRow componentModel={componentModel} event={event} onEventChange={onChange} />
    );
  }
}
