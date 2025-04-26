/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CascaderOptionType } from 'antd/lib/cascader';
import { DeleteFilled } from '@ant-design/icons';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import { EventProps, EventModel, EventExtraActionProps } from '../interfaces/EventModel';
import BaseComponentModel from './BaseComponentModel';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import i18n from '../../hooks/useLocalizeEventBindingTitle.i18n.json';
import { AllStores } from '../../mobx/StoreContexts';
import DataAttributesHelper from '../../utils/DataAttributesHelper';
import { getDeleteCustomModalViewDiffItems } from '../../components/side-drawer-tabs/right-drawer/action-row/ShowModalActionRow';

export abstract class BaseActionModel implements EventModel {
  public abstract readonly type: EventType;

  public abstract getDefaultEventBinding(obj: any): EventBinding;

  public abstract getDependentList(
    eventBinding: EventBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[];

  public abstract renderForConfigRow(props: EventProps): React.ReactNode;

  public renderForExtraAction(props: EventExtraActionProps): React.ReactNode {
    return (
      <DeleteFilled
        style={styles.deleteIcon}
        onClick={(e) => {
          e.stopPropagation();
          const showModalEvents = DataAttributesHelper.fetchShowModalEvents(props.event);
          showModalEvents.forEach((showModalEvent) => {
            getDeleteCustomModalViewDiffItems(showModalEvent).forEach((diffItem) =>
              props.componentModel.unexecutedDiffItems.push(diffItem)
            );
          });
          props.onDelete();
        }}
      />
    );
  }

  public getCascaderOption(
    componentModel: BaseComponentModel,
    enabledSubTypes: string[] | undefined
  ): CascaderOptionType | undefined {
    return {
      name: this.getName().action[this.type],
      value: this.type,
      isLeaf: true,
    };
  }

  public canSelect(): boolean {
    return true;
  }

  public getName() {
    return i18n[AllStores.persistedStore.locale];
  }
}

const styles: Record<string, React.CSSProperties> = {
  deleteIcon: {
    fontSize: '16px',
  },
};
