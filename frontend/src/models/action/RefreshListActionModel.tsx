import React from 'react';
import {
  ComponentDependency,
  DataDependency,
  DataDependencyType,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  RefreshListHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import RefreshListActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/RefreshListActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import { isDefined } from '../../utils/utils';

export class RefreshListActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.REFRESH_LIST;

  public canSelect(): boolean {
    return false;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.REFRESH_LIST,
      refreshPathComponents: [],
    };
  }

  public getDependentList(
    eventBinding: RefreshListHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (eventBinding.refreshPathComponents.length <= 0) return [];
    return eventBinding.refreshPathComponents
      .map((refreshPathComponent) => {
        if (!refreshPathComponent.listMRef) return undefined;
        return {
          dependencyType: DataDependencyType.COMPONENT,
          targetMRef: refreshPathComponent.listMRef,
          diffPathComponents,
          relation: eventBinding,
        };
      })
      .filter(isDefined) as ComponentDependency[];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <RefreshListActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
