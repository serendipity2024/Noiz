/* eslint-disable import/no-default-export */
import ConditionCategory from './ConditionCategory';
import ConstantCondition, {
  AllConstantConditions,
  ConstantConditionType,
  ConstantConditionInput,
} from './ConstantCondition';
import ExpressionCondition, {
  AllExpressionConditions,
  ExpressionConditionInput,
} from './ExpressionCondition';
import EnvironmentCondition, {
  AllEnvironmentConditions,
  EnvironmentConditionInput,
} from './EnvironmentCondition';
import { BoolExp } from '../BoolExp';

type Condition = ConstantCondition | ExpressionCondition | EnvironmentCondition;

export default Condition;

export type AllCondition = Condition | BoolExp<Condition>;

// helpers
export const AllConditions: Condition[] = ([] as Condition[])
  .concat(AllConstantConditions)
  .concat(AllExpressionConditions)
  .concat(AllEnvironmentConditions);

export const AllConditionSet = new Set(AllConditions);

export const AllConditionLabels: string[] = AllConditions.map((c) => c.label);

export type ConditionInput =
  | ConstantConditionInput
  | ExpressionConditionInput
  | EnvironmentConditionInput;

export function toCondition(input: ConditionInput): Condition {
  switch (input.category) {
    case ConditionCategory.EXPRESSION: {
      return ExpressionCondition.from(input);
    }
    case ConditionCategory.ENVIRONMENT: {
      return EnvironmentCondition.from(input);
    }
    case ConditionCategory.CONSTANT:
    default:
      return ConstantCondition.from(input.type as ConstantConditionType);
  }
}
