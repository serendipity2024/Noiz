/* eslint-disable import/no-default-export */
import React from 'react';
import ZHorizontalList, {
  ZHorizontalListDefaultCellFrame,
  ZHorizontalListDefaultDataAttributes,
  ZHorizontalListDefaultFrame,
} from '../../components/mobile-components/ZHorizontalList';
import ZHorizontalListFocusView from '../../components/focus-view/ZHorizontalListFocusView';
import { AllStores } from '../../mobx/StoreContexts';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import ZFrame from '../interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { ZColors } from '../../utils/ZConst';
import FrameDiff from '../../diffs/FrameDiff';
import { DiffItem } from '../../shared/type-definition/Diff';

export default class HorizontalListModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.HORIZONTAL_LIST;

  public readonly isList: boolean = true;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZHorizontalListDefaultDataAttributes;
  }

  public dataAttributes = this.defaultDataAttributes();

  public getDefaultComponentFrame(): ZFrame {
    return ZHorizontalListDefaultFrame;
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    const containerModel = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileContainerModel;
    containerModel.setComponentFrame(ZHorizontalListDefaultCellFrame);
    containerModel.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.WHITE_LIKE_GREY);
    this.unsavedChildren.push(containerModel);
  }

  public onUpdateFrame(newFrame: ZFrame): void {
    if (!newFrame.size?.height) {
      return;
    }
    const diffItems: DiffItem[] = FrameDiff.buildUpdateComponentFrameDiffs(this, newFrame);
    this.childMRefs.forEach((e) => {
      const cellModel = AllStores.coreStore.getModel(e);
      if (cellModel) {
        const newCellFrame = {
          ...cellModel.getComponentFrame(),
          ...{
            size: {
              width: cellModel.getComponentFrame().size?.width ?? 0,
              height: newFrame.size?.height ?? 0,
            },
          },
        };
        FrameDiff.buildUpdateComponentFrameDiffs(cellModel, newCellFrame).forEach((di) =>
          diffItems.push(di)
        );
      }
    });
    AllStores.diffStore.applyDiff(diffItems);
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    return this.defaultCreateCopy(parentMRef);
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZHorizontalList mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZHorizontalListFocusView mRef={this.previewMRef} />;
  }
}
