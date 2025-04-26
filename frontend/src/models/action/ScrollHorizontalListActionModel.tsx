import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ScrollHorizontalListDirection,
  ScrollHorizontalListHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ScrollHorizontalListActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ScrollHorizontalListActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class ScrollHorizontalListActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SCROLL_HORIZONTAL_LIST;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SCROLL_HORIZONTAL_LIST,
      targetMRef: '',
      direction: ScrollHorizontalListDirection.FORWARD,
    };
  }

  public getDependentList(
    eventBinding: ScrollHorizontalListHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.targetMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.targetMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ScrollHorizontalListActionRow
        componentModel={componentModel}
        event={event as ScrollHorizontalListHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
