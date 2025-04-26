/* eslint-disable import/no-default-export */
import ConditionCategory from './ConditionCategory';

export type ConstantConditionInput = {
  category: ConditionCategory.CONSTANT;
  type: ConstantConditionType;
};

export default class ConstantCondition {
  public static from(type: ConstantConditionType): ConstantCondition {
    return new ConstantCondition(ConstantConditionMap[type]);
  }

  public readonly category: ConditionCategory.CONSTANT = ConditionCategory.CONSTANT;

  public readonly type: ConstantConditionType;

  public readonly label: string;

  public readonly updateable: boolean;

  private constructor(input: ConstantConditionMeta) {
    this.type = input.type;
    this.label = input.label;
    this.updateable = input.updateable;
  }
}

export enum ConstantConditionType {
  ALWAYS = 'always',
  DEFAULT = 'default',
  NEVER = 'never',
}

interface ConstantConditionMeta {
  type: ConstantConditionType;
  label: string;
  updateable: boolean;
}

const ConstantConditionMap: Record<ConstantConditionType, ConstantConditionMeta> = {
  [ConstantConditionType.ALWAYS]: {
    type: ConstantConditionType.ALWAYS,
    label: 'always',
    updateable: true,
  },
  [ConstantConditionType.DEFAULT]: {
    type: ConstantConditionType.DEFAULT,
    label: 'default',
    updateable: false,
  },
  [ConstantConditionType.NEVER]: {
    type: ConstantConditionType.NEVER,
    label: 'never',
    updateable: true,
  },
};

export const AllConstantConditions: ConstantCondition[] = Object.values(ConstantConditionMap).map(
  (cc: ConstantConditionMeta) => ConstantCondition.from(cc.type)
);
