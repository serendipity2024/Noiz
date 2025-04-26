import { NumericFormulaOperator } from './DataBinding';
import { NumberTransform } from './Transform';

export type NumberFormat = (FormattedNumber | string)[];

export type FormattedNumber = {
  transform: NumberTransform;
  formatOptions?: NumberFormatOptions;
};

export type NumberFormatOptions = {
  zeroPaddingLength?: number;
  fixedDigits?: number;
  lowerBound?: { value: number; include: boolean };
  upperBound?: { value: number; include: boolean };
  prefix?: string;
  postfix?: string;
};

export enum DefaultNumberFormat {
  COUNTDOWN = 'countdown',
  COUNTDOWN_WITHOUT_UNIT = 'countdown-without-unit',
  DISTANCE = 'distance',
  NONE = 'none',
}

export const DefaultNumberFormats: Record<DefaultNumberFormat, NumberFormat> = {
  distance: [
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.DIVIDE,
        leftOperand: { type: 'unaryNumeric', operator: 'identity' },
        rightOperand: 1000,
      },
      formatOptions: { fixedDigits: 0, lowerBound: { value: 100, include: true }, postfix: '公里' },
    },
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.DIVIDE,
        leftOperand: { type: 'unaryNumeric', operator: 'identity' },
        rightOperand: 1000,
      },
      formatOptions: {
        fixedDigits: 1,
        lowerBound: { value: 1, include: true },
        upperBound: { value: 100, include: false },
        postfix: '公里',
      },
    },
    {
      transform: { type: 'unaryNumeric', operator: 'identity' },
      formatOptions: { fixedDigits: 1, upperBound: { value: 1000, include: false }, postfix: '米' },
    },
  ],
  countdown: [
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.DIVIDE,
        leftOperand: { type: 'unaryNumeric', operator: 'identity' },
        rightOperand: 60 * 60 * 1000,
      },
      formatOptions: { fixedDigits: 0, lowerBound: { value: 1, include: true }, postfix: '时' },
    },
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.DIVIDE,
        leftOperand: { type: 'unaryNumeric', operator: 'identity' },
        rightOperand: 60 * 1000,
      },
      formatOptions: {
        zeroPaddingLength: 2,
        fixedDigits: 0,
        lowerBound: { value: 1, include: true },
        postfix: '分',
      },
    },
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.MODULO,
        leftOperand: {
          type: 'binaryNumeric',
          operator: NumericFormulaOperator.DIVIDE,
          leftOperand: { type: 'unaryNumeric', operator: 'identity' },
          rightOperand: 1000,
        },
        rightOperand: 60,
      },
      formatOptions: { zeroPaddingLength: 2, fixedDigits: 0, postfix: '秒' },
    },
  ],
  'countdown-without-unit': [
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.DIVIDE,
        leftOperand: { type: 'unaryNumeric', operator: 'identity' },
        rightOperand: 60 * 60 * 1000,
      },
      formatOptions: { zeroPaddingLength: 2, fixedDigits: 0, postfix: ':' },
    },
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.MODULO,
        leftOperand: {
          type: 'binaryNumeric',
          operator: NumericFormulaOperator.DIVIDE,
          leftOperand: { type: 'unaryNumeric', operator: 'identity' },
          rightOperand: 60 * 1000,
        },
        rightOperand: 60,
      },
      formatOptions: { zeroPaddingLength: 2, fixedDigits: 0, postfix: ':' },
    },
    {
      transform: {
        type: 'binaryNumeric',
        operator: NumericFormulaOperator.MODULO,
        leftOperand: {
          type: 'binaryNumeric',
          operator: NumericFormulaOperator.DIVIDE,
          leftOperand: { type: 'unaryNumeric', operator: 'identity' },
          rightOperand: 1000,
        },
        rightOperand: 60,
      },
      formatOptions: { zeroPaddingLength: 2, fixedDigits: 0 },
    },
  ],
  none: [
    {
      transform: {
        type: 'unaryNumeric',
        operator: 'identity',
      },
    },
  ],
};
