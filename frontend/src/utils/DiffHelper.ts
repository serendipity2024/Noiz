/* eslint-disable import/no-default-export */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-eval */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
/* eslint-disable no-underscore-dangle */
import { transaction } from 'mobx';
import _, { isEqual, isEqualWith, isUndefined } from 'lodash';
import { AllStores } from '../mobx/StoreContexts';
import { ArrayDiffItem, Diff, DiffItem } from '../shared/type-definition/Diff';
import { SchemaDiffFragment } from '../graphQL/__generated__/SchemaDiffFragment';
import { MREF_MAP, ValidationResult } from '../mobx/stores/ValidationStore';
import { DataBinding, REMOTE_DATA } from '../shared/type-definition/DataBinding';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';

const MAX_DIFF_COUNT = 1000000;

interface DiffApplyResult {
  successful: boolean;
  errorContent?: Record<string, any>;
}

export default class DiffHelper {
  public static apply = (
    item: Diff | SchemaDiffFragment,
    validateDiff: (diff: Diff) => ValidationResult,
    isPendingApplicationDiff = false
  ): DiffApplyResult => {
    AllStores.diffStore.diffPendingApplication = undefined;

    const isNetworkSchemaDiff = !!(item as SchemaDiffFragment).uuid;
    const diff: Diff = isNetworkSchemaDiff ? (item as SchemaDiffFragment).content : item;

    let applyResult: DiffApplyResult = { successful: true };
    let completedCount = MAX_DIFF_COUNT;
    transaction(() => {
      for (let index = 0; index < diff.dataSource.length; index++) {
        const data = diff.dataSource[index];
        if (data.__typename === 'DiffItem') {
          const diffItem = data as DiffItem;
          applyResult = DiffHelper.applyDiffItem(diffItem);
        }
        if (data.__typename === 'ArrayDiffItem') {
          const arrayDiffItem = data as ArrayDiffItem;
          applyResult = DiffHelper.mergeArrayDiffItem(arrayDiffItem);
        }
        if (!applyResult.successful) {
          completedCount = index;
          break;
        }
      }
      // 发生错误后，回滚，并清除所有历史diff
      if (completedCount <= diff.dataSource.length - 1 && !isNetworkSchemaDiff) {
        AllStores.diffStore.clearAllDiffs();
        DiffHelper.apply(
          {
            id: diff.id,
            dataSource: diff.dataSource
              .filter((d, index) => index < completedCount)
              .map((data) => DiffHelper.reverseDiffItem(data))
              .reverse(),
          },
          validateDiff
        );
        return;
      }
      // 校验diff的完整性
      const validationResult = validateDiff(diff);
      if (validationResult.successful) {
        if (
          !isNetworkSchemaDiff &&
          (isPendingApplicationDiff || AllStores.diffStore.existsInLocalDiffs(diff.id))
        ) {
          AllStores.diffStore.addPendingUploadDiff(diff);
        }
        AllStores.typeSystemStore.applySchemaDiff(diff);
      } else {
        applyResult = { successful: false };
        const { diffs } = AllStores.diffStore;
        if (!isNetworkSchemaDiff && diffs.length > 0) {
          const currentDiff = diffs[diffs.length - 1];
          diffs.splice(diffs.length - 1, 1);
          DiffHelper.apply(
            {
              id: currentDiff.id,
              dataSource: currentDiff.dataSource
                .map((data) => DiffHelper.reverseDiffItem(data))
                .reverse(),
            },
            validateDiff
          );
          AllStores.validationStore.setValidationResult(validationResult);
        }
      }
    });

    // 兼容Drag Select Movable，边框不刷新问题
    if (AllStores.editorStore.selectedTargets.length > 0) {
      AllStores.editorStore.selectedTargets = _.cloneDeep(AllStores.editorStore.selectedTargets);
    }

    return applyResult;
  };

  public static reverseDiffItem = (data: DiffItem | ArrayDiffItem): DiffItem | ArrayDiffItem => {
    let negationDiff: DiffItem | ArrayDiffItem | undefined;
    if (data.__typename === 'DiffItem') {
      const diffItem = data as DiffItem;
      switch (diffItem.operation) {
        case 'add': {
          negationDiff = {
            __typename: 'DiffItem',
            oldValue: data.newValue,
            newValue: undefined,
            operation: 'delete',
            pathComponents: data.pathComponents,
          };
          break;
        }
        case 'delete': {
          negationDiff = {
            __typename: 'DiffItem',
            oldValue: undefined,
            newValue: data.oldValue,
            operation: 'add',
            pathComponents: data.pathComponents,
          };
          break;
        }
        case 'update': {
          negationDiff = {
            __typename: 'DiffItem',
            oldValue: data.newValue,
            newValue: data.oldValue,
            operation: 'update',
            pathComponents: data.pathComponents,
          };
          break;
        }
      }
    }
    if (data.__typename === 'ArrayDiffItem') {
      const arrayDiffItem = data as ArrayDiffItem;
      switch (arrayDiffItem.operation) {
        case 'insert': {
          negationDiff = {
            __typename: 'ArrayDiffItem',
            oldValue: data.newValue,
            newValue: undefined,
            previousValue: data.previousValue,
            nextValue: data.nextValue,
            operation: 'delete',
            pathComponents: data.pathComponents,
          };
          break;
        }
        case 'delete': {
          negationDiff = {
            __typename: 'ArrayDiffItem',
            oldValue: undefined,
            newValue: data.oldValue,
            previousValue: data.previousValue,
            nextValue: data.nextValue,
            operation: 'insert',
            pathComponents: data.pathComponents,
          };
          break;
        }
        case 'update': {
          negationDiff = {
            __typename: 'ArrayDiffItem',
            oldValue: data.newValue,
            newValue: data.oldValue,
            operation: 'update',
            pathComponents: data.pathComponents,
          };
          break;
        }
      }
    }
    if (!negationDiff) throw new Error(`negationDiffItem error, ${data}`);
    return negationDiff;
  };

  private static applyDiffItem(diffItem: DiffItem): DiffApplyResult {
    let node = AllStores.coreStore as any;
    let componentObject: any | undefined;
    let oldValue: any;
    let targetKey: string | undefined;

    diffItem.pathComponents.forEach((pathComponent, index) => {
      const pathComponentIndex = pathComponent.index ?? -1;
      const pathComponentKey = pathComponent.key ?? '';
      if (node instanceof Object && pathComponentKey.length > 0) {
        if (index !== diffItem.pathComponents.length - 1) {
          node = node[pathComponentKey];
          if (index > 1 && diffItem.pathComponents[index - 1].key === MREF_MAP) {
            componentObject = node;
          }
        } else {
          targetKey = pathComponentKey;
          oldValue = node[pathComponentKey];
        }
      }
      if (node instanceof Array && pathComponentIndex >= 0) {
        node = node[pathComponentIndex];
      }
    });

    if (targetKey && DiffHelper.isZedEqual(oldValue, diffItem.newValue)) {
      return { successful: true };
    }

    if (!targetKey || !DiffHelper.isZedEqual(oldValue, diffItem.oldValue)) {
      const errorContent: Record<string, any> = {
        message: 'merge diffItem error',
        diffItem,
        oldValue,
      };
      if (!oldValue) {
        errorContent.targetKey = targetKey;
        errorContent.componentObject = componentObject;
      }
      return DiffHelper.logErrorAndReturnDiffApplyResult(errorContent);
    }

    switch (diffItem.operation) {
      case 'add': {
        node[targetKey] = diffItem.newValue;
        break;
      }
      case 'update': {
        if (oldValue instanceof Array) {
          node[targetKey] = diffItem.newValue ? [...diffItem.newValue] : undefined;
        } else {
          node[targetKey] = diffItem.newValue;
        }
        break;
      }
      case 'delete': {
        if (!isUndefined(oldValue)) {
          delete node[targetKey];
        } else {
          return DiffHelper.logErrorAndReturnDiffApplyResult({
            message: 'merge diffItem delete error',
            diffItem,
            currentNode: node,
          });
        }
        break;
      }
      default: {
        return DiffHelper.logErrorAndReturnDiffApplyResult({
          message: 'merge diffItem operation error',
          diffItem,
        });
      }
    }
    // 更新 diff相关的 dependency
    AllStores.validationStore.updateDataDependency(
      diffItem.pathComponents,
      oldValue,
      node[targetKey]
    );
    return { successful: true };
  }

  private static mergeArrayDiffItem(arrayDiffItem: ArrayDiffItem): DiffApplyResult {
    let node = AllStores.coreStore as any;
    let oldValue: any;
    let previousValue;
    let nextValue;
    let targetIndex: number | undefined;

    arrayDiffItem.pathComponents.forEach((pathComponent, index) => {
      const pathComponentIndex = pathComponent.index ?? -1;
      const pathComponentKey = pathComponent.key ?? '';
      if (node instanceof Object && pathComponentKey.length > 0) {
        node = node[pathComponentKey];
      }
      if (node instanceof Array && pathComponentIndex >= 0) {
        if (index !== arrayDiffItem.pathComponents.length - 1) {
          node = node[pathComponentIndex];
        } else {
          const arrayNode = node.slice();
          if (arrayDiffItem.operation === 'insert') {
            oldValue = undefined;
            previousValue =
              pathComponentIndex === 0 ? undefined : arrayNode[pathComponentIndex - 1];
            nextValue = arrayNode[pathComponentIndex];
          } else if (arrayDiffItem.operation === 'delete') {
            oldValue = arrayNode[pathComponentIndex];
            previousValue =
              pathComponentIndex === 0 ? undefined : arrayNode[pathComponentIndex - 1];
            nextValue =
              pathComponentIndex < arrayNode.length - 1
                ? arrayNode[pathComponentIndex + 1]
                : undefined;
          } else {
            oldValue = arrayNode[pathComponentIndex];
          }
          targetIndex = pathComponentIndex;
        }
      }
    });

    if (!targetIndex && targetIndex !== 0) {
      return DiffHelper.logErrorAndReturnDiffApplyResult({
        message: 'merge arrayDiffItem targetIndex error',
        arrayDiffItem,
      });
    }

    const oldValueEqual: boolean = DiffHelper.isZedEqual(oldValue, arrayDiffItem.oldValue);
    const previousValueEqual: boolean = DiffHelper.isZedEqual(
      previousValue,
      arrayDiffItem.previousValue
    );
    const nextValueEqual: boolean = DiffHelper.isZedEqual(nextValue, arrayDiffItem.nextValue);

    switch (arrayDiffItem.operation) {
      case 'insert': {
        if (node instanceof Array && oldValueEqual && previousValueEqual && nextValueEqual) {
          if (arrayDiffItem.newValue instanceof Array) {
            node.splice(targetIndex, 0, ...arrayDiffItem.newValue);
          } else {
            node.splice(targetIndex, 0, arrayDiffItem.newValue);
          }
        } else {
          return DiffHelper.logErrorAndReturnDiffApplyResult({
            message: 'merge arrayDiffItem insert error',
            arrayDiffItem,
            currentNode: node,
          });
        }
        break;
      }
      case 'update': {
        if (node instanceof Array && oldValue && oldValueEqual) {
          node[targetIndex] = arrayDiffItem.newValue;
        } else {
          return DiffHelper.logErrorAndReturnDiffApplyResult({
            message: 'merge arrayDiffItem update error',
            arrayDiffItem,
            currentNode: node,
          });
        }
        break;
      }
      case 'delete': {
        if (
          node instanceof Array &&
          oldValue &&
          oldValueEqual &&
          previousValueEqual &&
          nextValueEqual
        ) {
          node.splice(targetIndex, 1);
        } else {
          return DiffHelper.logErrorAndReturnDiffApplyResult({
            message: 'merge arrayDiffItem delete error',
            arrayDiffItem,
            currentNode: node,
          });
        }
        break;
      }
      default: {
        return DiffHelper.logErrorAndReturnDiffApplyResult({
          message: 'merge arrayDiffItem operation error',
          currentNode: node,
        });
      }
    }
    return { successful: true };
  }

  private static logErrorAndReturnDiffApplyResult(
    errorContent: Record<string, any>
  ): DiffApplyResult {
    console.error(JSON.stringify(errorContent));
    return { successful: false, errorContent };
  }

  private static isZedEqual(left: any, right: any) {
    return isEqualWith(
      DiffHelper.translateJsonNode(left),
      DiffHelper.translateJsonNode(right),
      this.equalCustomizer
    );
  }

  private static translateJsonNode(data: any): any {
    let newData;
    if (data instanceof Array) {
      newData = data.map((item) => this.translateJsonNode(item));
    } else if (data instanceof Object) {
      if (
        (data.mRef && Object.values(ComponentModelType).includes(data.type)) ||
        DataBinding.isDataBinding(data)
      ) {
        newData = JSON.parse(JSON.stringify(data));
      } else {
        const temp: Record<string, any> = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value && value !== false) {
            temp[key] = this.translateJsonNode(value);
          }
        });
        newData = temp;
      }
    } else {
      newData = data;
    }
    return newData;
  }

  private static equalCustomizer(value: any, other: any, indexOrKey: any): boolean | undefined {
    // 过滤掉 自动生成的 verticalLayout
    if (indexOrKey === 'verticalLayout') {
      return value.location === other.location && value.layoutMode === other.layoutMode;
    }
    // 过滤掉 数据绑定路径中 REMOTE_DATA节点
    if (
      indexOrKey === 'pathComponents' &&
      value instanceof Array &&
      other instanceof Array &&
      value.length > 0 &&
      other.length > 0 &&
      value[0].name === REMOTE_DATA &&
      other[0].name === REMOTE_DATA
    ) {
      return isEqual(value.slice(1, value.length), other.slice(1, value.length));
    }
    return undefined;
  }
}
