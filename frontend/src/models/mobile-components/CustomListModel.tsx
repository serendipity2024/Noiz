/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZCustomListFocusView from '../../components/focus-view/ZCustomListFocusView';
import ZCustomList, {
  CustomListAttributes,
  ZCustomListDefaultDataAttributes,
  ZCustomListDefaultReferenceAttributes,
} from '../../components/mobile-components/ZCustomList';
import FrameDiff from '../../diffs/FrameDiff';
import { AllStores } from '../../mobx/StoreContexts';
import StoreHelpers from '../../mobx/StoreHelpers';
import { getConfiguration } from '../../mobx/stores/CoreStore';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { IntegerType, DecimalType } from '../../shared/type-definition/DataModel';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import BaseComponentModel from '../base/BaseComponentModel';
import { DummyComponentFrame } from '../base/BaseMobileComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import ZFrame from '../interfaces/Frame';
import BlankContainerModel from './BlankContainerModel';

export default class CustomListModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.CUSTOM_LIST;

  public readonly isList: boolean = true;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZCustomListDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as CustomListAttributes;

  public getDefaultComponentFrame(): ZFrame {
    const { viewport } = getConfiguration();
    return {
      position: { x: 0, y: 0 },
      size: { width: viewport.width, height: 255 },
    };
  }

  public get cellWidth(): number {
    const { columnNum, horizontalPadding } = this.dataAttributes;
    return Math.floor(
      (this.getComponentFrame().size.width - horizontalPadding * (columnNum - 1)) / columnNum
    );
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    const cellModel = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BlankContainerModel;
    cellModel.setComponentFrame({
      ...DummyComponentFrame,
      size: { width: this.cellWidth, height: 80 },
    });
    cellModel.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.WHITE_LIKE_GREY);
    this.unsavedChildren.push(cellModel);

    this.localVariableTable = {
      topSectionIndexInVisibileArea: {
        type: IntegerType.INTEGER,
      },
      offsetX: {
        type: DecimalType.FLOAT8,
      },
      offsetY: {
        type: DecimalType.FLOAT8,
      },
    };
  }

  public onUpdateFrame(newFrame: ZFrame): void {
    const dataSource = FrameDiff.buildUpdateComponentFrameDiffs(this, newFrame);
    const childMRefs = this.childMRefs.slice() ?? [];
    const cellModel = StoreHelpers.getComponentModel(childMRefs[0] ?? undefined);
    const headerViewModel = StoreHelpers.getComponentModel(childMRefs[1] ?? undefined);
    if (cellModel) {
      const { columnNum, horizontalPadding } = this.dataAttributes;
      const width = Math.floor(
        (newFrame.size.width - horizontalPadding * (columnNum - 1)) / columnNum
      );
      FrameDiff.buildUpdateComponentFrameDiffs(cellModel, {
        size: { ...cellModel.getComponentFrame().size, width },
      }).forEach((di) => dataSource.push(di));
    }
    if (headerViewModel) {
      FrameDiff.buildUpdateComponentFrameDiffs(headerViewModel, {
        size: { ...headerViewModel.getComponentFrame().size, width: newFrame.size.width },
      }).forEach((di) => dataSource.push(di));
    }
    AllStores.diffStore.applyDiff(dataSource);
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as CustomListModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZCustomListDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCustomList mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZCustomListFocusView mRef={this.previewMRef} />;
  }
}
