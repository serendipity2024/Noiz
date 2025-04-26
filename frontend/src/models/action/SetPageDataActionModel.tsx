import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  SetPageDataHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { SetPageDataActionRow } from '../../components/side-drawer-tabs/right-drawer/action-row/SetPageDataActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import StoreHelpers from '../../mobx/StoreHelpers';
import BasicMobileModel from '../basic-components/BasicMobileModel';
import { DataBindingKind, PAGE_DATA_PATH } from '../../shared/type-definition/DataBinding';

export class SetPageDataActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.SET_PAGE_DATA;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.SET_PAGE_DATA,
    };
  }

  public getDependentList(
    eventBinding: EventBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const screenModel = StoreHelpers.fetchRootModel(componentModel) as BasicMobileModel;
    if (!screenModel || !screenModel.isRootContainer) return [];
    const pathComponents = (eventBinding as SetPageDataHandleBinding).pathComponents ?? [];
    if (pathComponents.length <= 0) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.PAGE_VARIABLE_TABLE,
        rootMRef: screenModel.mRef,
        dataName: pathComponents[0].name,
        relation: {
          kind: DataBindingKind.VARIABLE,
          pathComponents: [PAGE_DATA_PATH, ...pathComponents],
        },
        diffPathComponents,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <SetPageDataActionRow
        componentModel={componentModel}
        event={event as SetPageDataHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
