import React from 'react';
import uniqid from 'uniqid';
import {
  DataDependency,
  DataDependencyType,
  getEventBindingPageDataDependency,
} from '../../mobx/stores/ValidationStore';
import {
  EventBinding,
  EventType,
  GenerateMiniProgramCodeHandleBinding,
  MiniAppCodeType,
} from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import GenerateMiniProgramCodeActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/GenerateMiniProgramCodeActionRow';
import { BaseActionModel } from '../base/BaseActionModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import BaseComponentModel from '../base/BaseComponentModel';
import { AllStores } from '../../mobx/StoreContexts';
import { ZedSupportedPlatform } from '../interfaces/ComponentModel';

export class GenerateMiniProgramCodeActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.GENERATE_MINI_PROGRAM_CODE;

  public canSelect(): boolean {
    return AllStores.editorStore.editorPlatform === ZedSupportedPlatform.WECHAT;
  }

  public getDefaultEventBinding(): EventBinding {
    return {
      type: EventType.GENERATE_MINI_PROGRAM_CODE,
      codeType: MiniAppCodeType.WECHAT,
      size: 430,
      assignTo: [],
      successActions: [],
      failedActions: [],
    };
  }

  public getDependentList(
    eventBinding: GenerateMiniProgramCodeHandleBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependencies: DataDependency[] = [];
    if (eventBinding.pageMRef) {
      dataDependencies.push({
        id: uniqid.process(),
        dependencyType: DataDependencyType.COMPONENT,
        targetMRef: eventBinding.pageMRef,
        diffPathComponents,
        relation: eventBinding,
      });
    }
    const assignToDependency = getEventBindingPageDataDependency(
      eventBinding.assignTo,
      diffPathComponents,
      componentModel
    );
    if (assignToDependency) {
      dataDependencies.push(assignToDependency);
    }
    return dataDependencies;
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange } = props;
    return (
      <GenerateMiniProgramCodeActionRow
        componentModel={componentModel}
        event={event as GenerateMiniProgramCodeHandleBinding}
        onEventChange={onChange}
      />
    );
  }
}
