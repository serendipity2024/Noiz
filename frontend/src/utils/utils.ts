import { Component, FunctionComponent } from 'react';
import { isNull, isUndefined } from 'lodash';
import { Fn, Vector2 } from '../types';

export type PropsOf<P> = P extends Component<infer P>
  ? P
  : P extends FunctionComponent<infer P>
  ? P
  : never;

export function isNotNull<T>(obj: T | null): obj is T {
  return !isNull(obj);
}

export function isDefined<T>(obj: T | undefined): obj is T {
  return !isUndefined(obj);
}

export function filterNotNullOrUndefined<T>(items: Array<T | null | undefined>): Array<T> {
  return items.filter((e) => !isNull(e) && !isUndefined(e)) as Array<T>;
}

export type RequiredNonNullable<P> = {
  [K in keyof P]-?: NonNullable<P[K]> extends any[]
    ? NonNullable<NonNullable<P[K]>[number]>[]
    : NonNullable<P[K]>;
};

// blank function
export function noop() {}
// returns a function that chains all functions given as parameters
export const chainFns = (...fns: Fn[]): Fn => (...args: any[]) => fns.forEach(fn => fn(...args))

export const def = {
  array: <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value, value]),
  withDefault: <T>(value: T | undefined, defaultIfUndefined: T): T => (value !== void 0 ? value : defaultIfUndefined),
}

export function matchKeysFromObject<T extends object, K extends object>(obj: T, matchingObject: K): Partial<T> {
  const o: Partial<T> = {}
  Object.entries(obj).forEach(
    ([key, value]) => (value !== void 0 || key in matchingObject) && (o[key as keyof T] = value)
  )
  return o
}

export function valueFn(v: Vector2 | (() => Vector2)) {
  return typeof v === 'function' ? v() : v
}
