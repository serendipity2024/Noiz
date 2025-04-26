/* eslint-disable import/no-default-export */
import {
  DataBinding,
  ValueBinding,
  DataBindingKind,
  FunctionBinding,
  InputBinding,
  SelectBinding,
  VariableBinding,
  AGGREGATE,
  ValueOperator,
  CompositeBinding,
  FORMULA_DATA,
  LOGICAL_DATA,
  LOCAL_DATA,
  REMOTE_DATA,
  PAGE_DATA,
  LOGGED_IN_USER,
  ITEM_DATA,
  INPUTS,
  LINKED_DATA,
  RESULT_DATA,
  SELECTIONS,
  CONDITIONAL_DATA,
  ArrayElementMappingBinding,
  PathComponent,
} from '../shared/type-definition/DataBinding';
import i18n from './useShowDataBinding.i18n.json';
import useLocale from './useLocale';

const SEPERATOR = '/';
const predefinedCategories = [
  LOGGED_IN_USER,
  LOGICAL_DATA,
  PAGE_DATA,
  REMOTE_DATA,
  LINKED_DATA,
  LOCAL_DATA,
  ITEM_DATA,
  RESULT_DATA,
  INPUTS,
  SELECTIONS,
] as const;
type PredefinedCategory = typeof predefinedCategories[number];
const isPredefinedCategory = (pathComponentName: string): pathComponentName is PredefinedCategory =>
  (predefinedCategories as Readonly<string[]>).includes(pathComponentName);

// Copied from DataBinding.valueBindingEffectiveValue
export const useShowValueBinding: () => (valueBinding: ValueBinding) => string = () => {
  const { localizedContent: content } = useLocale(i18n);

  const translatePathComponentName = (pathComponentName: PredefinedCategory): string =>
    content.pathComponent[pathComponentName];

  const translatePathComponent = (pathComponents: PathComponent[]): string => {
    if (pathComponents.length === 0) {
      return '';
    }
    if (pathComponents.length === 1) {
      return isPredefinedCategory(pathComponents[0].name)
        ? translatePathComponentName(pathComponents[0].name)
        : pathComponents[0].name;
    }
    const lastObject = pathComponents[pathComponents.length - 1];
    let newValue: string = pathComponents
      .filter((_, index) => index !== pathComponents.length - 1)
      .map((element) =>
        isPredefinedCategory(element.name) ? translatePathComponentName(element.name) : element.name
      )
      .join(SEPERATOR);
    newValue += `${lastObject.type === AGGREGATE ? ':' : SEPERATOR}${lastObject.name}`;
    return newValue;
  };

  return (valueBinding: ValueBinding): string => {
    switch (valueBinding.kind) {
      case DataBindingKind.LITERAL: {
        return valueBinding.value;
      }
      case DataBindingKind.FUNCTION: {
        return (
          (content.function as Record<string, any>)[(valueBinding as FunctionBinding).value] ??
          (valueBinding as FunctionBinding).value
        );
      }
      case DataBindingKind.FORMULA: {
        return content.label[FORMULA_DATA];
      }
      case DataBindingKind.CONDITIONAL: {
        return content.label[CONDITIONAL_DATA];
      }
      case DataBindingKind.INPUT: {
        const inputBinding = valueBinding as InputBinding;
        return (inputBinding.pathComponents ?? [])
          .map((element) => {
            if (isPredefinedCategory(element.name)) return translatePathComponentName(element.name);
            return element.name === inputBinding.value ? inputBinding.label : element.name;
          })
          .join(SEPERATOR);
      }
      case DataBindingKind.SELECTION: {
        const selectBinding = valueBinding as SelectBinding;
        return (selectBinding.pathComponents ?? [])
          .map((element) => {
            if (isPredefinedCategory(element.name)) return translatePathComponentName(element.name);
            return element.name === selectBinding.value ? selectBinding.label : element.name;
          })
          .join(SEPERATOR);
      }
      case DataBindingKind.VARIABLE: {
        const variableBinding = valueBinding as VariableBinding;
        if (variableBinding.displayName) {
          return variableBinding.displayName
            .split(SEPERATOR)
            .map((element, index) =>
              index === 0 && isPredefinedCategory(element)
                ? translatePathComponentName(element)
                : element
            )
            .join(SEPERATOR);
        }
        const pathComponents = variableBinding.pathComponents ?? [];
        return translatePathComponent(pathComponents);
      }
      case DataBindingKind.ARRAY_ELEMENT_MAPPING: {
        const arrayElementMappingBinding = valueBinding as ArrayElementMappingBinding;
        const pathComponents = arrayElementMappingBinding.pathComponents ?? [];
        return translatePathComponent(pathComponents);
      }
      default:
        return '';
    }
  };
};

// Copied from DataBinding.effectiveValue
const useShowDataBinding: () => (dataBinding: DataBinding) => string = () => {
  const showValueBinding = useShowValueBinding();
  return (dataBinding: DataBinding) => {
    if (!dataBinding.op) {
      const valueBinding = dataBinding.valueBinding as ValueBinding;
      return showValueBinding(valueBinding);
    }
    if (dataBinding.op === ValueOperator.CONCAT) {
      const list = dataBinding.valueBinding as CompositeBinding[];
      return list.map((e) => showValueBinding(e as ValueBinding)).join('');
    }
    throw new Error('unsupported valueBinding op');
  };
};
export default useShowDataBinding;
