import React from 'react';
import {
  EditFilterAndStickerHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import EditFilterAndStickerActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/EditFilterAndStickerActionRow';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { MediaType } from '../../shared/type-definition/DataModel';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';

export class EditFilterAndStickerActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.EDIT_FILTER_AND_STICKER;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.EDIT_FILTER_AND_STICKER,
      image: DataBinding.withSingleValue(MediaType.IMAGE),
      assignTo: [],
    };
  }

  public getDependentList(
    eventBinding: EditFilterAndStickerHandleBinding,
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
      <EditFilterAndStickerActionRow
        componentModel={componentModel}
        event={event as EditFilterAndStickerHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
