import {
  NumericFormulaBinaryOperators,
  NumericFormulaUnaryOperators,
  TextFormulaOperator,
} from './DataBinding';

export const Identity = 'identity' as const;
export const Const = 'const' as const;

export enum NumberTransformType {
  UNARY_NUMERIC = 'unaryNumeric',
  BINARY_NUMERIC = 'binaryNumeric',
}

export type NumberTransform =
  | {
      type: 'unaryNumeric';
      operator: typeof NumericFormulaUnaryOperators[number] | typeof Identity;
    }
  | {
      type: 'binaryNumeric';
      operator: typeof NumericFormulaBinaryOperators[number];
      leftOperand: number | NumberTransform;
      rightOperand: number | NumberTransform;
    };

export enum TextTransformType {
  UNARY_TEXT = 'unaryText',
}

export type TextTransform = {
  type: TextTransformType.UNARY_TEXT;
} & (
  | {
      operator: TextFormulaOperator.SUBSTRING;
      start?: number;
      end?: number;
    }
  | {
      operator: typeof Const;
      value: string;
    }
  | {
      operator:
        | TextFormulaOperator.TO_LOWER_CASE
        | TextFormulaOperator.TO_UPPER_CASE
        | typeof Identity;
    }
);

export enum ObjectTransformType {
  UNARY_OBJECT = 'unaryObject',
}

export enum ObjectTransformOperator {
  MAP_KEY = 'mapKey',
  MAP_VALUE = 'mapValue',
}

export type ObjectTransform =
  | {
      type: ObjectTransformType.UNARY_OBJECT;
      operator: ObjectTransformOperator.MAP_KEY;
      objectKey: string;
      transform: TextTransform;
    }
  | {
      type: ObjectTransformType.UNARY_OBJECT;
      operator: ObjectTransformOperator.MAP_VALUE;
      objectKey: string;
      transform: TextTransform | NumberTransform;
    };
