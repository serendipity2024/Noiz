import React from 'react';
import uniqid from 'uniqid';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  LottieAction,
  LottieHandleBinding,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
import LottieActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/LottieActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';

export class LottieActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.LOTTIE;

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.LOTTIE,
      targetMRef: '',
      action: LottieAction.PLAY,
      startFrame: DataBinding.withSingleValue(IntegerType.INTEGER),
      endFrame: DataBinding.withSingleValue(IntegerType.INTEGER),
      direction: DataBinding.withLiteral(1, IntegerType.INTEGER),
    };
  }

  public getDependentList(
    eventBinding: LottieHandleBinding,
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
      <LottieActionRow
        componentModel={componentModel}
        event={event as LottieHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
