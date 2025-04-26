import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ImagePickerReplaceImageHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ImagePickerReplaceImageRow from '../../components/side-drawer-tabs/right-drawer/action-row/ImagePickerReplaceImageRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ImagePickerReplaceImageActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.IMAGE_PICKER_REPLACE_IMAGE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.IMAGE_PICKER_REPLACE_IMAGE,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ImagePickerReplaceImageRow
        componentModel={componentModel}
        event={event as ImagePickerReplaceImageHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
