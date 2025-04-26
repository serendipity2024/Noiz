import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  FunctorHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import FunctorActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/FunctorActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class FunctorActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.FUNCTOR;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.FUNCTOR,
      name: '',
      args: {},
      onSucceedActions: [],
      onFailedActions: [],
    };
  }

  public getDependentList(
    eventBinding: FunctorHandleBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependency = getEventBindingPageDataDependency(
      eventBinding.resultAssociatedPathComponents,
      diffPathComponents,
      componentModel
    );
    return [dataDependency].filter(isDefined);
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <FunctorActionRow
        model={componentModel}
        event={event as FunctorHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
