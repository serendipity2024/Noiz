import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  TakePhotoHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import TakePhotoActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/TakePhotoActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class TakePhotoActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.TAKE_PHOTO;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.TAKE_PHOTO,
      assignTo: [],
      successActions: [],
      failedActions: [],
    };
  }

  public getDependentList(
    eventBinding: TakePhotoHandleBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependency = getEventBindingPageDataDependency(
      eventBinding.assignTo,
      diffPathComponents,
      componentModel
    );
    return [dataDependency].filter(isDefined);
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <TakePhotoActionRow
        componentModel={componentModel}
        event={event as TakePhotoHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
