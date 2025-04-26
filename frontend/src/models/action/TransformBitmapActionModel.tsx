import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  TransformBitmapToImageHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BITMAP } from '../../shared/type-definition/DataModel';
import TransformBitmapActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/TransformBitmapActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class TransformBitmapActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.TRANSFORM_BITMAP_TO_IMAGE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.TRANSFORM_BITMAP_TO_IMAGE,
      bitmap: DataBinding.withSingleValue(BITMAP),
      assignTo: [],
      successActions: [],
    };
  }

  public getDependentList(
    eventBinding: TransformBitmapToImageHandleBinding,
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
      <TransformBitmapActionRow
        componentModel={componentModel}
        event={event as TransformBitmapToImageHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
