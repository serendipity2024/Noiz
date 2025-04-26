import { CascaderOptionType } from 'antd/lib/cascader';
import { DataDependency } from '../../mobx/stores/ValidationStore';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import { EventBinding, EventType } from '../../shared/type-definition/EventBinding';
import BaseComponentModel from '../base/BaseComponentModel';

export enum ActionConfigMode {
  NORMAL = 'normal',
  TRIGGER = 'trigger',
}

export interface EventProps {
  componentModel: BaseComponentModel;
  event: EventBinding;
  configMode?: ActionConfigMode;
  onChange: () => void;
}

export interface EventExtraActionProps {
  event: EventBinding;
  componentModel: BaseComponentModel;
  onDelete: () => void;
}

export interface EventModel {
  readonly type: EventType;

  canSelect(): boolean;
  getDefaultEventBinding(object: any): EventBinding;
  getDependentList(
    eventBinding: EventBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[];
  getCascaderOption(
    componentModel: BaseComponentModel,
    enabledSubTypes: string[] | undefined
  ): CascaderOptionType | undefined;
  renderForConfigRow(props: EventProps): React.ReactNode;
  renderForExtraAction(props: EventExtraActionProps): React.ReactNode;
}
