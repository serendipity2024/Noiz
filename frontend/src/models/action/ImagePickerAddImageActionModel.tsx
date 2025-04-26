import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ImagePickerAddImageHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ImagePickerAddImageRow from '../../components/side-drawer-tabs/right-drawer/action-row/ImagePickerAddImageRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ImagePickerAddImageActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.IMAGE_PICKER_ADD_IMAGE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.IMAGE_PICKER_ADD_IMAGE,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ImagePickerAddImageRow
        componentModel={componentModel}
        event={event as ImagePickerAddImageHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
