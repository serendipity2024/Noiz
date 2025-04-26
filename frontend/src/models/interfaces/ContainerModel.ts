/* eslint-disable import/no-default-export */
import Condition from '../../shared/type-definition/conditions/Condition';
import { ShortId } from '../../shared/type-definition/ZTypes';
import ComponentModel, { ComponentFrameConfiguration } from './ComponentModel';

export default interface ContainerModel extends ComponentModel, Containable {}

export interface Containable {
  childMRefs: ShortId[];
  children(): ComponentModel[];
}

export interface Conditional {
  createChild(name: string, isDefault: boolean): void;
}

export interface ConditionalChild {
  readonly isDefaultCase: boolean;
  getFrameConfiguration(): ComponentFrameConfiguration;
  setInitIfCondition(condition: Condition): void;
}

export const DefaultConditionName = 'default';
