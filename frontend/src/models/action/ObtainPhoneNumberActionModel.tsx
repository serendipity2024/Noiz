import React from 'react';
import {
  DataDependency,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  ObtainPhoneNumberHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ObtainPhoneNumberActioRow from '../../components/side-drawer-tabs/right-drawer/action-row/ObtainPhoneNumberActioRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { isDefined } from '../../utils/utils';

export class ObtainPhoneNumberActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.OBTAIN_PHONE_NUMBER;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.OBTAIN_PHONE_NUMBER,
      target: [],
      successActions: [],
    };
  }

  public getDependentList(
    eventBinding: ObtainPhoneNumberHandleBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependency = getEventBindingPageDataDependency(
      eventBinding.target,
      diffPathComponents,
      componentModel
    );
    return [dataDependency].filter(isDefined);
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ObtainPhoneNumberActioRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
