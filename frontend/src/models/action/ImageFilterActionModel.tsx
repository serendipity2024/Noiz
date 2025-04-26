import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ImageFilterHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BITMAP } from '../../shared/type-definition/DataModel';
import ImageFilterActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ImageFilterActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class ImageFilterActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.IMAGE_FILTER;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.IMAGE_FILTER,
      bitmap: DataBinding.withSingleValue(BITMAP),
      assignTo: [],
      successActions: [],
    };
  }

  public getDependentList(
    eventBinding: ImageFilterHandleBinding,
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
      <ImageFilterActionRow
        componentModel={componentModel}
        event={event as ImageFilterHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
