import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  ChooseLocationHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ChooseLocationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ChooseLocationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class ChooseLocationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.CHOOSE_LOCATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.CHOOSE_LOCATION,
      successActions: [],
      authorizationFailedActions: [],
    };
  }

  public getDependentList(
    eventBinding: ChooseLocationHandleBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const geoPointDependency = getEventBindingPageDataDependency(
      eventBinding.geoPointAssociatedPathComponents,
      diffPathComponents,
      componentModel
    );
    const addressDependency = getEventBindingPageDataDependency(
      eventBinding.addressAssociatedPathComponents,
      diffPathComponents,
      componentModel
    );
    const nameDependency = getEventBindingPageDataDependency(
      eventBinding.nameAssociatedPathComponents,
      diffPathComponents,
      componentModel
    );
    return [geoPointDependency, addressDependency, nameDependency].filter(isDefined);
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ChooseLocationActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
