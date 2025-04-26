/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import uniqid from 'uniqid';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { EventProps } from '../interfaces/EventModel';
import MutationActionRow from '../../components/side-drawer-tabs/right-drawer/action-row/MutationActionRow';
import { USER_ROLE } from '../../shared/type-definition/DataModel';
import DataBindingHelper from '../../utils/DataBindingHelper';
import { DataModelRegistry, Field } from '../../shared/type-definition/DataModelRegistry';
import { AllStores } from '../../mobx/StoreContexts';
import { BaseActionModel } from '../base/BaseActionModel';
import { alwaysTrueFilter } from '../../shared/type-definition/TableFilterExp';

export class MutationActionModel extends BaseActionModel {
  public readonly type: EventType = EventType.MUTATION;

  public getDefaultEventBinding(obj: any): EventBinding {
    return {
      type: EventType.MUTATION,
      listMutation: false,
      value: obj.value,
      role: USER_ROLE,
      requestId: `${obj.value}_${uniqid.process()}`,
      operation: obj.operation,
      rootFieldType: obj.type,
      object: DataBindingHelper.convertGraphQLObjectArgs((obj as Field).object ?? []),
      where: obj.operation === 'insert' ? alwaysTrueFilter : { _and: [] },
      isWhereError: obj.operation !== 'insert',
      successActions: [],
    };
  }

  public getDependentList(): DataDependency[] {
    return [];
  }

  public getCascaderOption(): CascaderOptionType {
    const { dataModel } = AllStores.coreStore;
    const dataModelRegistry = new DataModelRegistry(dataModel);
    return {
      name: this.getName().action[this.type],
      value: this.type,
      fields: dataModelRegistry.getMutations().map((element: Field) => ({
        ...element,
        value: element.name,
        isLeaf: true,
      })),
      isLeaf: false,
    };
  }

  public renderForConfigRow(props: EventProps): React.ReactNode {
    const { componentModel, event, onChange, configMode } = props;
    return (
      <MutationActionRow
        configMode={configMode}
        componentModel={componentModel}
        event={event}
        onEventChange={onChange}
      />
    );
  }
}
