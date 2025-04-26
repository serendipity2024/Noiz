/* eslint-disable import/no-default-export */

export interface AndExp<T> {
  _and: BoolExp<T>[];
}

export interface OrExp<T> {
  _or: BoolExp<T>[];
}

export interface NotExp<T> {
  _not: BoolExp<T>;
}

export type BoolExp<T> = T | AndExp<T> | OrExp<T> | NotExp<T>;