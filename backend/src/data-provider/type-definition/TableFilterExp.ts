/* eslint-disable @typescript-eslint/ban-types */

/*
{
    "_and" :[
      {
        "column": "id",
        "op": "_eq",
        "value": {
          type: "BIGSERIAL",
          "op": "concat",
          "valueBinding": {
            "kind": "literal",
            "value": "10086"
          }
        }
      }
    ]
}
*/

import { BoolExp } from './BoolExp';

export type TableName = string;

export type ColumnFilterExp = ExistsExp | ColumnValueExp | AlwaysTrueFilter;

export type TableFilterExp = BoolExp<ColumnFilterExp>;

export interface ExistsExp {
  _exists: {
    _table: TableName;
    _where: TableFilterExp;
  };
}

export type ColumnName = string;

export type ColumnValueExp = {
  column: ColumnName;
  op: Operator;
  value: any;
};

// In cases where we want the filter to always evaluate to true, we save only an
// empty object, i.e. `filter: {}`. So we make up a class that's distinguished
// from `any` type, but still doesn't have any properties of its own.
export class AlwaysTrueFilter {
  literalValue(): boolean {
    return true;
  }
}

export const alwaysTrueFilter = new AlwaysTrueFilter();

export type ColumnOperator = '_ceq' | '_cne' | '_cgt' | '_clt' | '_cgte' | '_clte';

export enum GenericOperator {
  EQ = '_eq',
  NEQ = '_neq',
  GT = '_gt',
  LT = '_lt',
  GTE = '_gte',
  LTE = '_lte',
  ISNULL = '_is_null',
  ISNOTNULL = '_is_not_null',
  IN = '_in',
  NOTIN = '_nin',
}

export enum CollectionOperator {
  ISEMPTY = '_is_empty',
  ISNOTEMPTY = '_is_not_empty',
  INCLUDES = 'includes',
}

export enum TextOperator {
  LIKE = '_like',
  NLIKE = '_nlike',
  ILIKE = '_ilike',
  NILIKE = '_nilike',
  SIMILAR = '_similar',
  NSIMILAR = '_nsimilar',
}

export type JSONBOperator =
  | '_contains'
  | '_contained_in'
  | '_has_key'
  | '_has_keys_any'
  | '_has_keys_all';

export type Operator = GenericOperator | TextOperator | JSONBOperator | CollectionOperator;
