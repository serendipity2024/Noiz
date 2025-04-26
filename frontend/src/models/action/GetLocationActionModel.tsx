import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  GetLocationHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import GetLocationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/GetLocationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';

export class GetLocationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.GET_LOCATION;

  public canSelect(): boolean {
    return AllStores.editorStore.editorPlatform === ZedSupportedPlatform.WECHAT;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.GET_LOCATION,
      successActions: [],
      authorizationFailedActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <GetLocationActionRow
        componentModel={componentModel}
        event={event as GetLocationHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
