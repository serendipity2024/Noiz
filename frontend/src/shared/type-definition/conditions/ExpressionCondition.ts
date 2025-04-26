/* eslint-disable import/no-default-export */
import { CollectionOperator, GenericOperator } from '../TableFilterExp';
import { DataBinding } from '../DataBinding';
import ConditionCategory from './ConditionCategory';

export interface ExpressionConditionInput {
  category: ConditionCategory.EXPRESSION;
  type: GenericOperator | CollectionOperator;
  target?: DataBinding;
  value?: DataBinding;
}

export default class ExpressionCondition {
  public static from(input: ExpressionConditionInput): ExpressionCondition {
    return new ExpressionCondition({ ...ExpressionConditionMetaByOperator[input.type], ...input });
  }

  public readonly category: ConditionCategory.EXPRESSION = ConditionCategory.EXPRESSION;

  public readonly type: GenericOperator | CollectionOperator;

  public readonly label: string;

  public readonly updateable: boolean;

  public target?: DataBinding;

  public value?: DataBinding;

  private constructor(input: ExpressionConditionMeta) {
    this.updateable = true;
    this.type = input.type;
    this.label = input.label;
    this.target = input.target;
    this.value = input.value;
  }
}

interface ExpressionConditionMeta {
  type: GenericOperator | CollectionOperator;
  label: string;
  target?: DataBinding;
  value?: DataBinding;
}

const ExpressionConditionMetaByOperator: Record<
  GenericOperator | CollectionOperator,
  ExpressionConditionMeta
> = {
  [GenericOperator.EQ]: {
    type: GenericOperator.EQ,
    label: 'equal to',
  },
  [GenericOperator.NEQ]: {
    type: GenericOperator.NEQ,
    label: 'not equal to',
  },
  [GenericOperator.GT]: {
    type: GenericOperator.GT,
    label: 'greater than',
  },
  [GenericOperator.LT]: {
    type: GenericOperator.LT,
    label: 'lower than',
  },
  [GenericOperator.GTE]: {
    type: GenericOperator.GTE,
    label: 'greater than or equal to',
  },
  [GenericOperator.LTE]: {
    type: GenericOperator.LTE,
    label: 'lower than or equal to',
  },
  [GenericOperator.ISNULL]: {
    type: GenericOperator.ISNULL,
    label: 'is null',
  },
  [GenericOperator.ISNOTNULL]: {
    type: GenericOperator.ISNOTNULL,
    label: 'is not null',
  },
  [GenericOperator.IN]: {
    type: GenericOperator.IN,
    label: 'in',
  },
  [GenericOperator.NOTIN]: {
    type: GenericOperator.NOTIN,
    label: 'not in',
  },
  [CollectionOperator.ISEMPTY]: {
    type: CollectionOperator.ISEMPTY,
    label: 'is empty',
  },
  [CollectionOperator.ISNOTEMPTY]: {
    type: CollectionOperator.ISNOTEMPTY,
    label: 'is not empty',
  },
  [CollectionOperator.INCLUDES]: {
    type: CollectionOperator.INCLUDES,
    label: 'includes',
  },
};

export const AllExpressionConditions: ExpressionCondition[] = Object.values(
  ExpressionConditionMetaByOperator
).map((ec) => ExpressionCondition.from({ type: ec.type } as ExpressionConditionInput));
