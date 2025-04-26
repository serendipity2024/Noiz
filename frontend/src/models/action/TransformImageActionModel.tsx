import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  TransformImageToBitmapHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { MediaType } from '../../shared/type-definition/DataModel';
import TransformImageActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/TransformImageActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class TransformImageActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.TRANSFORM_IMAGE_TO_BITMAP;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.TRANSFORM_IMAGE_TO_BITMAP,
      image: DataBinding.withSingleValue(MediaType.IMAGE),
      assignTo: [],
      successActions: [],
    };
  }

  public getDependentList(
    eventBinding: TransformImageToBitmapHandleBinding,
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
      <TransformImageActionRow
        componentModel={componentModel}
        event={event as TransformImageToBitmapHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
