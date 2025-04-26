import { isArray, isObject } from 'lodash';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ColumnType,
  ColumnTypes,
  NumericTypes,
  NumericType,
  BaseType,
  DecimalType,
  TimeTypes,
  TimeType,
  MediaTypes,
  MediaType,
  LocationTypes,
  LocationType,
  JsonTypes,
  JsonType,
} from './DataModel';
import { TableFilterExp } from './TableFilterExp';
import { HexColor, ShortId } from './ZTypes';
import { NumberFormat } from './NumberFormat';
import { ObjectTransform, TextTransform, NumberTransform } from './Transform';
import { AllCondition } from './conditions/Condition';

export const LOGGED_IN_USER = 'logged-in-user';
export const LOGICAL_DATA = 'logical-data';
export const PAGE_DATA = 'page-data';
export const GLOBAL_DATA = 'global-data';
export const LINKED_DATA = 'linked-data';
export const REMOTE_DATA = 'remote-data';
export const LOCAL_DATA = 'local-data';
export const ITEM_DATA = 'item-data';
export const RESULT_DATA = 'result-data';
export const REQUEST_STATUS_DATA = 'request-status-data';
export const CONSTANT_DATA = 'constant-data';
export const ACTION_DATA = 'action-data';
export const COMPONENT_INPUT_DATA = 'component-input-data';
export const COMPONENT_OUTPUT_DATA = 'component-output-data';
export const ACTION_FLOW_DATA = 'action-flow-data';

export const INPUTS = 'inputs';
export const SELECTIONS = 'selections';

export const NOW = 'now';
export const TODAY = 'today';
export const TIMESTAMP = 'timestamp';
export const NULL = 'null';

export const CLIPBOARD_DATA = 'clipboard-data';
export const FORMULA_DATA = 'formula-data';
export const CONDITIONAL_DATA = 'conditional-data';
export const REQUEST_STATUS = 'request-status';
export const AGGREGATE = 'aggregate';

export const THEME_COLOR_PREFIX = '$$';

export const REMOTE_DATA_PATH = {
  name: REMOTE_DATA,
  type: REMOTE_DATA,
};

export const PAGE_DATA_PATH = {
  name: PAGE_DATA,
  type: PAGE_DATA,
};

export const COMPONENT_OUTPUT_DATA_PATH = {
  name: COMPONENT_OUTPUT_DATA,
  type: COMPONENT_OUTPUT_DATA,
};

export enum AggregateType {
  MAX = 'max',
  MIN = 'min',
  SUM = 'sum',
  AVG = 'avg',
}

export enum DataBindingKind {
  LITERAL = 'literal',
  VARIABLE = 'variable',
  ARRAY_ELEMENT_MAPPING = 'arrayElementMapping',
  INPUT = 'input',
  SELECTION = 'selection',
  THEME = 'theme',
  FUNCTION = 'function',
  FORMULA = 'formula',
  JSON = 'json',
  CONDITIONAL = 'conditional',
  LIST = 'list',
  EMPTY = 'empty',
}

export enum ValueOperator {
  CONCAT = 'concat',
}

export enum ArithmeticOperator {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}

export enum TimeFormatType {
  ELAPSED_TIME = 'elapsed-time',
  DATE = 'yyyy/MM/dd',
  MONTH_DAY = 'MM/dd',
  DATE_TIME = 'yyyy/MM/dd HH:mm',
  DAY_OF_WEEK = 'E',
  TIME = 'HH:mm',
  NONE = 'yyyy/MM/ddThh:mmTZD',
}

export enum DataConditionType {
  FILLED = 'filled',
  EMPTY = 'empty',
  EMAIL = 'email',
  PHONE_NUMBER = 'phone-number',
  AUDITED_CONETNT = 'audited-content',
  REGEX = 'regex',
}

export enum TemporalUnit {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}

export enum TimeDirection {
  LATER = 'later',
  BEFORE = 'before',
}

export enum ArrayMapping {
  FIELD = 'Field',
  OBJECT = 'Object',
}

export enum PredefinedFunctionName {
  GET_CURRENT_DATE = 'getCurrentDate',
  GET_CURRENT_TIME = 'getCurrentTime',
  GET_TIMESTAMP = 'getTimestamp',
  GET_CLIPBOARD_DATA = 'getClipboardData',
  GET_NULL = 'getNull',
  GET_ISIOS = 'getIsIOS',
  GET_ISANDROID = 'getIsAndroid',
}

export enum RequestStatus {
  NORMAL = 'normal',
  LOADING = 'loading',
  SUCCESSFUL = 'successful',
  NETWORK_ERROR = 'network-error',
  BUSINESS_ERROR = 'business-error',
}

export type Variable = {
  type: string | 'array';
  itemType?: string;
  nullable?: boolean;
  unique?: boolean;
  args?: VariableTable;
  pathComponents?: PathComponent[];
};

export interface DataCondition {
  conditionId: string;
  conditionType: DataConditionType;
  errorMessage?: string;
  regExp?: string;
}

export function convertAggregateTargetType(type: string, aggregate: AggregateType): string {
  switch (aggregate) {
    case AggregateType.MAX:
    case AggregateType.MIN:
    case AggregateType.SUM: {
      return type;
    }
    case AggregateType.AVG: {
      return DecimalType.FLOAT8;
    }
    default:
      return BaseType.TEXT;
  }
}

export function isObjectType(name: string): boolean {
  return (
    !isBasicType(name) &&
    !isNumericType(name) &&
    !isTimeType(name) &&
    !isMediaType(name) &&
    !isMediaListType(name)
  );
}

export function isBasicType(name: string): boolean {
  if (name === AGGREGATE) {
    return true;
  }
  if (ColumnTypes.includes(name as ColumnType)) {
    return !isMediaType(name) && !isLocationType(name);
  }
  return false;
}

export function isNumericType(name: string): boolean {
  return NumericTypes.includes(name as NumericType);
}

export function isTimeType(name: string): boolean {
  return TimeTypes.includes(name as TimeType);
}

export function isJsonType(name: string): boolean {
  return JsonTypes.includes(name as JsonType);
}

export function isMediaType(name: string): boolean {
  return MediaTypes.includes(name as MediaType);
}

export function isMediaListType(name: string): boolean {
  return name === MediaType.IMAGE_LIST;
}

export function isLocationType(name: string): boolean {
  return LocationTypes.includes(name as LocationType);
}

export type VariableTable = Record<string, Variable>;

export type PathComponent = {
  name: string;
  type: string;
  itemType?: string;
  args?: Record<string, any>;
  alias?: string;
  componentMRef?: ShortId; // 当前数据所在组件的mRef
};

export interface VariableBinding {
  kind: DataBindingKind.VARIABLE;
  pathComponents: PathComponent[];
  displayName?: string;

  where?: TableFilterExp;
  distinctOnFieldNames?: string[];
  shouldDependentsUpdateOnValueChange?: boolean;

  // data transformation
  dataFormat?: TimeFormatType | NumberFormat;
  arrayMappingType?: ArrayMapping;
  arrayElementFieldMapping?: PathComponent;
  arrayElementObjectMapping?: string[];
  arrayMappings?: (NumberTransform | TextTransform | ObjectTransform)[];
}

export interface ArrayElementMappingBinding {
  kind: DataBindingKind.ARRAY_ELEMENT_MAPPING;
  pathComponents: PathComponent[];
  arrayElementFieldMapping?: PathComponent;
}

export enum DateTimeFormulaOperator {
  ADD = '+',
  SUBTRACT = '-',
}

export enum NumericFormulaOperator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  MODULO = '%',
  MIN = 'min',
  MAX = 'max',
  CEIL = 'ceil',
  FLOOR = 'floor',
  TRUNC = 'trunc',
}

// TODO: 旧数据存在stringLength, 后面重构改成 统一 length (含义collectionLength)
export enum CollectionFormulaOperator {
  STRING_LENGTH = 'stringLength',
  ARRAY_LENGTH = 'arrayLength',
}

// 两个比较 （对象比较id）
export enum BooleanFormulaOperator {
  EQUAL = 'equal',
  NOT_EQUAL = 'not_equal',
}

export enum TextFormulaOperator {
  SUBSTRING = 'substring',
  TO_LOWER_CASE = 'toLowerCase',
  TO_UPPER_CASE = 'toUpperCase',
  ARRAY_JOIN = 'array_join',
}

export enum JsonFormulaOperator {
  GET_VALUE_FROM_JSON = 'get_value_from_json',
}

export type FormulaOperator =
  | NumericFormulaOperator
  | BooleanFormulaOperator
  | TextFormulaOperator
  | DateTimeFormulaOperator
  | JsonFormulaOperator
  | CollectionFormulaOperator;

export const NumericFormulaBinaryOperators = [
  NumericFormulaOperator.ADD,
  NumericFormulaOperator.SUBTRACT,
  NumericFormulaOperator.MULTIPLY,
  NumericFormulaOperator.DIVIDE,
  NumericFormulaOperator.MODULO,
  NumericFormulaOperator.MIN,
  NumericFormulaOperator.MAX,
] as const;

export const NumericFormulaUnaryOperators = [
  NumericFormulaOperator.SUBTRACT,
  NumericFormulaOperator.CEIL,
  NumericFormulaOperator.FLOOR,
  NumericFormulaOperator.TRUNC,
] as const;

export const isNumericFormulaOperator = (
  operator: FormulaOperator | string
): operator is NumericFormulaOperator => {
  return !!Object.values(NumericFormulaOperator).find((op) => op === operator);
};
export const isNumericFormulaBinaryOperator = (
  operator: NumericFormulaOperator | string
): operator is typeof NumericFormulaBinaryOperators[number] => {
  return !!NumericFormulaBinaryOperators.find((op) => op === operator);
};

export const isNumericFormulaUnaryOperator = (
  operator: NumericFormulaOperator | string
): operator is typeof NumericFormulaUnaryOperators[number] => {
  return !!NumericFormulaUnaryOperators.find((op) => op === operator);
};

export interface ConditionalBinding {
  kind: DataBindingKind.CONDITIONAL;
  resultType: string;
  conditionalData: ConditionalData[];
}

export interface ConditionalData {
  id: string;
  name?: string;
  condition: AllCondition;
  value: DataBinding;
}

export interface FormulaBinding {
  kind: DataBindingKind.FORMULA;
  resultType: string;
  op?: FormulaOperator;
  valueRecord: Record<string, DataBinding>;
}

export interface DateTimeFormulaBinding extends FormulaBinding {
  durations?: TimestampItem[];
}

export interface JsonFormulaBinding extends FormulaBinding {
  json: DataBinding;
  keyPath?: string;
  valueType?: ColumnType | 'array';
  arrayElementObjectMapping?: string[];
}

export interface LiteralBinding {
  kind: DataBindingKind.LITERAL;
  value: any;
}

export interface ColorBinding {
  kind: DataBindingKind.LITERAL | DataBindingKind.THEME;
  value: string | HexColor;
}

export interface InputBinding extends ComponentBinding {
  kind: DataBindingKind.INPUT;
}

export interface SelectBinding extends ComponentBinding {
  kind: DataBindingKind.SELECTION;
}

export interface ComponentBinding {
  kind: DataBindingKind.SELECTION | DataBindingKind.INPUT;
  value: string; // component mRef
  label: string;
  pathComponents: PathComponent[];
  dataFormat?: TimeFormatType | NumberFormat;
  shouldDependentsUpdateOnValueChange: boolean;
}

export interface EmptyBinding {
  kind: DataBindingKind.EMPTY;
}

export interface FunctionBinding {
  kind: DataBindingKind.FUNCTION;
  value: string;
  label: string;
  config?: TimestampConfiguration;
  dataFormat?: TimeFormatType | NumberFormat;
}

export interface TimestampConfiguration {
  offset: TimestampItem;
  instant?: TimestampItem[];
}

export interface TimestampItem {
  amount?: DataBinding;
  temporalUnit: TemporalUnit;
  direction?: TimeDirection;
}

export interface JsonBinding {
  kind: DataBindingKind.JSON;
  data: Record<string, DataBinding>;
}

export interface ListBinding {
  kind: DataBindingKind.LIST;
  itemType: string;
  object: Record<string, DataBinding>;
  listSourceData?: DataBinding;
}

export type ValueBinding =
  | LiteralBinding
  | VariableBinding
  | ArrayElementMappingBinding
  | InputBinding
  | SelectBinding
  | ColorBinding
  | FunctionBinding
  | FormulaBinding
  | ConditionalBinding
  | JsonBinding
  | ListBinding
  | EmptyBinding;

export type CompositeBinding = DataBinding | ValueBinding;

export class DataBinding {
  public type: string = BaseType.TEXT;

  public itemType?: string;

  // to be used valueOperator in or notin
  public typeParameter?: string;

  public valueBinding: ValueBinding | CompositeBinding[] = [];

  public op?: ValueOperator;

  public arithmeticOperator?: ArithmeticOperator;

  public conditionsToVerify: DataCondition[] = [];

  // to be used in codegen
  public mRef?: string;

  public get isEmpty(): boolean {
    if (isArray(this.valueBinding)) return this.valueBinding.length === 0;
    if (isObject(this.valueBinding)) return this.valueBinding.kind === DataBindingKind.EMPTY;
    return this.valueBinding === undefined;
  }

  public static isDataBinding(input: any): boolean {
    return input && typeof input === 'object' && input.type && input.valueBinding;
  }

  public static withLiteral(value: any, type: string = BaseType.TEXT): DataBinding {
    const obj = new DataBinding();
    obj.type = type;
    obj.valueBinding = {
      kind: DataBindingKind.LITERAL,
      value,
    };
    return obj;
  }

  public static withTextVariable(
    valueBinding: ValueBinding | CompositeBinding[] = [],
    op: ValueOperator = ValueOperator.CONCAT
  ): DataBinding {
    const obj = new DataBinding();
    obj.type = BaseType.TEXT;
    obj.valueBinding = valueBinding;
    obj.op = op;
    return obj;
  }

  public static withSingleValue(type: string, itemType?: string): DataBinding {
    const obj = new DataBinding();
    obj.type = type;
    obj.itemType = itemType;
    obj.valueBinding =
      type === BaseType.TEXT
        ? []
        : {
            kind: DataBindingKind.EMPTY,
          };
    obj.op = type === BaseType.TEXT ? ValueOperator.CONCAT : undefined;
    return obj;
  }

  public static withColor(value: string): DataBinding {
    const obj = new DataBinding();
    obj.type = BaseType.TEXT;
    obj.valueBinding = {
      kind:
        value.slice(0, 2) === THEME_COLOR_PREFIX ? DataBindingKind.THEME : DataBindingKind.LITERAL,
      value: value.replace(THEME_COLOR_PREFIX, ''),
    };
    return obj;
  }

  public static buildFromObject(object: Record<string, any>): DataBinding | undefined {
    if (this.isDataBinding(object)) {
      const value = object as DataBinding;
      const dataBinding = new DataBinding();
      dataBinding.type = value.type;
      dataBinding.itemType = value.itemType;
      dataBinding.typeParameter = value.typeParameter;
      dataBinding.op = value.op;
      dataBinding.arithmeticOperator = value.arithmeticOperator;
      dataBinding.valueBinding = value.valueBinding;
      dataBinding.conditionsToVerify = value.conditionsToVerify;
      return dataBinding;
    }
    return undefined;
  }

  public get effectiveValue(): any {
    let text = '';
    if (!this.op) {
      const valueBinding = this.valueBinding as ValueBinding;
      text = this.valueBindingEffectiveValue(valueBinding);
    } else if (this.op === ValueOperator.CONCAT) {
      const list = this.valueBinding as CompositeBinding[];
      const textList = list
        .map((e) => {
          const valueBinding: ValueBinding = e as ValueBinding;
          return this.valueBindingEffectiveValue(valueBinding);
        })
        .filter((e) => e);
      if (textList.length > 0) {
        text = textList.reduce((previousValue, currentValue) => previousValue + currentValue);
      }
    } else {
      throw new Error('unsupported valueBinding op');
    }
    return text;
  }

  public valueBindingEffectiveValue(valueBinding: ValueBinding): any | undefined {
    switch (valueBinding.kind) {
      case DataBindingKind.LITERAL: {
        return valueBinding.value;
      }
      case DataBindingKind.FUNCTION: {
        return (valueBinding as FunctionBinding).label;
      }
      case DataBindingKind.FORMULA: {
        return FORMULA_DATA;
      }
      case DataBindingKind.INPUT: {
        const inputBinding = valueBinding as InputBinding;
        return (inputBinding.pathComponents ?? [])
          .map((element) =>
            element.name === inputBinding.value ? inputBinding.label : element.name
          )
          .join('/');
      }
      case DataBindingKind.SELECTION: {
        const selectBinding = valueBinding as SelectBinding;
        return (selectBinding.pathComponents ?? [])
          .map((element) =>
            element.name === selectBinding.value ? selectBinding.label : element.name
          )
          .join('/');
      }
      case DataBindingKind.VARIABLE: {
        const variableBinding = valueBinding as VariableBinding;
        if (variableBinding.displayName) {
          return variableBinding.displayName;
        }
        const pathComponents = variableBinding.pathComponents ?? [];
        if (pathComponents.length === 0) {
          return undefined;
        }
        if (pathComponents.length === 1) {
          return pathComponents[0].name;
        }
        const lastObject = pathComponents[pathComponents.length - 1];
        let newValue: string = pathComponents
          .filter((_, index) => index !== pathComponents.length - 1)
          .map((element) => element.name)
          .join('/');
        newValue += `${lastObject.type === AGGREGATE ? ':' : '/'}${lastObject.name}`;
        return newValue;
      }
      default:
        return undefined;
    }
  }
}

export type DataAttributes = Record<string, DataBinding>;
