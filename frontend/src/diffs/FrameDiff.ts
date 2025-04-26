/* eslint-disable import/no-default-export */
import { isEqual } from 'lodash';
import { AllStores } from '../mobx/StoreContexts';
import BaseComponentModel from '../models/base/BaseComponentModel';
import ZFrame from '../models/interfaces/Frame';
import ZGridLayout from '../models/interfaces/GridLayout';
import { DiffItem } from '../shared/type-definition/Diff';
import { ShortId } from '../shared/type-definition/ZTypes';

export default class FrameDiff {
  public static buildUpdateComponentFrameDiffs = (
    model: BaseComponentModel,
    newFrame: Partial<ZFrame>
  ): DiffItem[] => {
    const diffItems: DiffItem[] = [];

    const oldValue = model.getComponentFrame();
    const newValue = { ...model.getComponentFrame(), ...newFrame };
    const sizeEqual = isEqual(oldValue.size, newValue.size);

    if (!sizeEqual) {
      Object.values(AllStores.coreStore.mRefMap).forEach((data) => {
        if (data.referencedTemplateMRef === model.previewMRef || data.mRef === model.previewMRef) {
          diffItems.push(
            FrameDiff.buildUpdateComponentFrameDiff({
              oldValue: data.getComponentFrame(),
              newValue: {
                ...data.getComponentFrame(),
                ...(model.mRef === data.mRef ? newFrame : { size: newFrame.size }),
              },
              mRef: data.mRef,
            })
          );
        }
      });
    } else {
      diffItems.push(
        FrameDiff.buildUpdateComponentFrameDiff({
          oldValue: model.getComponentFrame(),
          newValue: { ...model.getComponentFrame(), ...newFrame },
          mRef: model.mRef,
        })
      );
    }
    return diffItems;
  };

  public static buildUpdateComponentGridLayoutDiff = (
    model: BaseComponentModel,
    newGridLayout: ZGridLayout
  ): DiffItem => {
    return {
      __typename: 'DiffItem',
      oldValue: model.gridLayout,
      newValue: { ...model.gridLayout, ...newGridLayout },
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'gridLayout',
        },
      ],
    };
  };

  private static buildUpdateComponentFrameDiff = (params: {
    oldValue: any;
    newValue: any;
    mRef: ShortId;
  }): DiffItem => {
    const { oldValue, newValue, mRef } = params;
    return {
      __typename: 'DiffItem',
      oldValue,
      newValue,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: mRef,
        },
        {
          key: 'componentFrame',
        },
      ],
    };
  };
}
