import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ImagePickerDeleteImageHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ImagePickerDeleteImageRow from '../../components/side-drawer-tabs/right-drawer/action-row/ImagePickerDeleteImageRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class ImagePickerDeleteImageActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.IMAGE_PICKER_DELETE_IMAGE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.IMAGE_PICKER_DELETE_IMAGE,
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ImagePickerDeleteImageRow
        componentModel={componentModel}
        event={event as ImagePickerDeleteImageHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
