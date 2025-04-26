import React from 'react';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventProps } from '../interfaces/EventModel';
import { BaseType, LocationType } from '../../shared/type-definition/DataModel';
import OpenLocationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/OpenLocationActionRow';
import { BaseActionModel } from '../base/BaseActionModel';

export class OpenLocationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.OPEN_LOCATION;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.OPEN_LOCATION,
      geoPoint: DataBinding.withSingleValue(LocationType.GEO_POINT),
      address: DataBinding.withSingleValue(BaseType.TEXT),
      name: DataBinding.withSingleValue(BaseType.TEXT),
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <OpenLocationActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
