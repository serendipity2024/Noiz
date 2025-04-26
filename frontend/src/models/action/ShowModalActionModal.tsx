import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import {
  EventBinding,
  EventType,
  ModalViewMode,
  ShowModalHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ShowModalActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ShowModalActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class ShowModalActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SHOW_MODAL;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SHOW_MODAL,
      title: '',
      detail: DataBinding.withTextVariable(),
      cancelTitle: 'CANCEL',
      confirmTitle: 'OK',
      confirmActions: [],
      mode: ModalViewMode.ALERT,
    };
  }

  public getDependentList(
    eventBinding: ShowModalHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.modalViewMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.modalViewMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ShowModalActionRow componentModel={componentModel} event={event} onEventChange={onChange} />
    );
  }
}
