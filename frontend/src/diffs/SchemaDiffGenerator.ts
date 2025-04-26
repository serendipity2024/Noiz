import _ from 'lodash';
import { DiffContent, DiffPathComponent } from '../shared/type-definition/Diff';
import CoreStoreDataType from '../mobx/stores/CoreStoreDataType';
import BaseComponentModel from '../models/base/BaseComponentModel';

const STRICT_EQ = (a: any, b: any) => a === b;

const ANY_MATCH = true;

const EQUALITY_OVERRIDES: [
  (DiffPathComponent | typeof ANY_MATCH)[],
  (v1: any, v2: any) => boolean
][] = [
  [[{ key: 'dataModel' }, { key: 'tableMetadata' }], (t1, t2) => t1.name === t2.name],
  [[{ key: 'actionFlows' }], (t1, t2) => t1.uniqueId === t2.uniqueId],
  [
    [{ key: 'actionFlows' }, ANY_MATCH, { key: 'allNodes' }],
    (t1, t2) => t1.uniqueId === t2.uniqueId,
  ],
];

export function generateSchemaDiff(
  before: CoreStoreDataType,
  after: CoreStoreDataType
): DiffContent {
  const result: DiffContent = [];
  generateDiffItems(before, after, [], result);
  return result;
}

function generateDiffItems(
  before: any,
  after: any,
  prefix: DiffPathComponent[],
  result: DiffContent
): void {
  if (before === after) {
    return;
  }

  const withNewKey = (key: string) => prefix.concat({ key });
  const withNewIndex = (index: number) => prefix.concat({ index });

  if (_.isPlainObject(before) && _.isPlainObject(after)) {
    const beforeKeys = Object.keys(before);
    const afterKeys = Object.keys(after);

    _.intersection(beforeKeys, afterKeys).forEach((key) => {
      generateDiffItems(before[key], after[key], withNewKey(key), result);
    });

    _.difference(beforeKeys, afterKeys).forEach((key) => {
      result.push({
        __typename: 'DiffItem',
        oldValue: before[key],
        operation: 'delete',
        pathComponents: withNewKey(key),
      });
    });

    _.difference(afterKeys, beforeKeys).forEach((key) => {
      result.push({
        __typename: 'DiffItem',
        newValue: after[key],
        operation: 'add',
        pathComponents: withNewKey(key),
      });
    });
  } else if (_.isArray(before) && _.isArray(after)) {
    const equalityFunc =
      EQUALITY_OVERRIDES.find((item) => pathMatches(prefix, item[0]))?.[1] ?? STRICT_EQ;
    const matches = getMaxArrayMatches(before, after, equalityFunc);

    const beforeIndexes = matches.map((p) => p.beforeIndex);
    let currNextElement;
    for (let i = before.length - 1; i >= 0; --i) {
      if (beforeIndexes.includes(i)) {
        currNextElement = before[i];
      } else {
        result.push({
          __typename: 'ArrayDiffItem',
          oldValue: before[i],
          previousValue: before[i - 1],
          nextValue: currNextElement,
          operation: 'delete',
          pathComponents: withNewIndex(i),
        });
      }
    }

    matches.forEach((pair, index) =>
      generateDiffItems(
        before[pair.beforeIndex],
        after[pair.afterIndex],
        withNewIndex(index),
        result
      )
    );

    const afterIndexes = matches.map((p) => p.afterIndex);
    let nextMatchIndex = 0;
    for (let i = 0; i < after.length; ++i) {
      if (afterIndexes.includes(i)) {
        ++nextMatchIndex;
      } else {
        result.push({
          __typename: 'ArrayDiffItem',
          newValue: after[i],
          previousValue: after[i - 1],
          nextValue:
            nextMatchIndex < matches.length ? after[matches[nextMatchIndex].afterIndex] : undefined,
          operation: 'insert',
          pathComponents: withNewIndex(i),
        });
      }
    }
  } else {
    const plainBefore = toPlainObject(before);
    const plainAfter = toPlainObject(after);
    if (plainBefore || plainAfter) {
      generateDiffItems(plainBefore ?? before, plainAfter ?? after, prefix, result);
      return;
    }

    result.push({
      __typename: 'DiffItem',
      oldValue: before,
      newValue: after,
      operation: 'update',
      pathComponents: prefix,
    });
  }
}

interface ArrayMatchPair {
  beforeIndex: number;
  afterIndex: number;
}

function getMaxArrayMatches<T>(before: T[], after: T[], isEqual: (a: T, b: T) => boolean) {
  const getMatchingPairs = _.memoize(
    (beforeIndex: number, afterIndex: number): ArrayMatchPair[] => {
      if (beforeIndex < 0 || afterIndex < 0) {
        return [];
      }
      if (isEqual(before[beforeIndex], after[afterIndex])) {
        return getMatchingPairs(beforeIndex - 1, afterIndex - 1).concat({
          beforeIndex,
          afterIndex,
        });
      }
      const result1 = getMatchingPairs(beforeIndex - 1, afterIndex);
      const result2 = getMatchingPairs(beforeIndex, afterIndex - 1);
      return result1.length > result2.length ? result1 : result2;
    },
    (a, b) => {
      const s = a + b;
      return (s * (s + 1)) / 2 + b;
    }
  );

  return getMatchingPairs(before.length - 1, after.length - 1);
}

function toPlainObject(obj: any): any {
  if (obj instanceof BaseComponentModel) {
    return { ...obj };
  }
  return null;
}

function pathMatches(
  path: DiffPathComponent[],
  pattern: (DiffPathComponent | typeof ANY_MATCH)[]
): boolean {
  if (path.length < pattern.length) return false;

  for (let i = 0; i < pattern.length; ++i) {
    if (pattern[i] !== ANY_MATCH && !_.isEqual(path[i], pattern[i])) return false;
  }
  return true;
}
