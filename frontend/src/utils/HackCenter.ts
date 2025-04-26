/* eslint-disable import/no-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
import { AndExp, NotExp, OrExp } from '../shared/type-definition/BoolExp';
import {
  TableFilterExp,
  ColumnFilterExp,
  ColumnValueExp,
} from '../shared/type-definition/TableFilterExp';
import {
  DataBinding,
  isMediaType,
  isMediaListType,
  ValueBinding,
  DataBindingKind,
  REMOTE_DATA,
  LOGGED_IN_USER,
  RESULT_DATA,
  SELECTIONS,
  ACTION_DATA,
} from '../shared/type-definition/DataBinding';
import { ID, IntegerType } from '../shared/type-definition/DataModel';

/*
search hack code directory
    1. hack media id
*/

export default class HackCenter {
  public static hackMediaDataDinding = (dataBinding: DataBinding): DataBinding => {
    if (isMediaType(dataBinding.type) && !isMediaListType(dataBinding.type)) {
      if (dataBinding.valueBinding.hasOwnProperty('kind')) {
        const valueBinding = dataBinding.valueBinding as ValueBinding;
        switch (valueBinding.kind) {
          case DataBindingKind.VARIABLE:
          case DataBindingKind.SELECTION: {
            const kindPathComponent = valueBinding.pathComponents[0];
            if (
              kindPathComponent &&
              (kindPathComponent.name === REMOTE_DATA ||
                kindPathComponent.name === RESULT_DATA ||
                kindPathComponent.name === ACTION_DATA ||
                kindPathComponent.name === LOGGED_IN_USER ||
                kindPathComponent.name === SELECTIONS)
            ) {
              const lastPathComponent =
                valueBinding.pathComponents[valueBinding.pathComponents.length - 1];
              if (
                lastPathComponent &&
                lastPathComponent.type !== IntegerType.BIGSERIAL &&
                lastPathComponent.name !== ID
              ) {
                valueBinding.pathComponents = [
                  ...valueBinding.pathComponents,
                  {
                    name: ID,
                    type: IntegerType.BIGSERIAL,
                  },
                ];
              }
            }
            break;
          }
          default:
            break;
        }
      }
    }
    return dataBinding;
  };

  public static hackMediaBoolExp = (boolExp: TableFilterExp): TableFilterExp => {
    if (boolExp.hasOwnProperty('_and')) {
      const andExp = boolExp as AndExp<ColumnFilterExp>;
      return { _and: andExp._and.map((be) => HackCenter.hackMediaBoolExp(be)) };
    }
    if (boolExp.hasOwnProperty('_or')) {
      const orExp = boolExp as OrExp<ColumnFilterExp>;
      return { _or: orExp._or.map((be) => HackCenter.hackMediaBoolExp(be)) };
    }
    if (boolExp.hasOwnProperty('_not')) {
      const notExp = boolExp as NotExp<ColumnFilterExp>;
      return { _not: HackCenter.hackMediaBoolExp(notExp._not) };
    }
    const columnValueExp: ColumnValueExp = boolExp as ColumnValueExp;
    HackCenter.hackMediaDataDinding(columnValueExp.value);
    return columnValueExp;
  };
}
