import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  ConfigureCameraHandleBinding,
  EventBinding,
  EventType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import ConfigureCameraActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/ConfigureCameraActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class ConfigureCameraActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.CONFIGURE_CAMERA;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.CONFIGURE_CAMERA,
    };
  }

  public getDependentList(
    eventBinding: ConfigureCameraHandleBinding,
    diffPathComponents: DiffPathComponent[]
  ): DataDependency[] {
    if (!eventBinding.targetMRef) return [];
    return [
      {
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.targetMRef,
        diffPathComponents,
        relation: eventBinding,
      },
    ];
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <ConfigureCameraActionRow
        componentModel={componentModel}
        event={event as ConfigureCameraHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
