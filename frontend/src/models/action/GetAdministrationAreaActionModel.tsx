import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  GetAdministrationAreaHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { LocationType } from '../../shared/type-definition/DataModel';
import GetAdministrationAreaActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/GetAdministrationAreaActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';
import { isDefined } from '../../utils/utils';

export class GetAdministrationAreaActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.GET_ADMINISTRATION_AREA;

  public canSelect(): boolean {
    return AllStores.editorStore.editorPlatform === ZedSupportedPlatform.WECHAT;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.GET_ADMINISTRATION_AREA,
      location: DataBinding.withSingleValue(LocationType.GEO_POINT),
      assignTo: [],
      successActions: [],
    };
  }

  public getDependentList(
    eventBinding: GetAdministrationAreaHandleBinding,
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
      <GetAdministrationAreaActionRow
        componentModel={componentModel}
        event={event as GetAdministrationAreaHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
