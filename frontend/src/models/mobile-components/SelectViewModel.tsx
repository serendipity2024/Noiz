/* eslint-disable import/no-default-export */
import { observable } from 'mobx';
import React from 'react';
import ZSelectViewFocusView from '../../components/focus-view/ZSelectViewFocusView';
import ZSelectView, {
  SelectViewAttributes,
  SelectViewMode,
  ZSelectViewDefaultDataAttributes,
  ZSelectViewDefaultFrame,
  ZSelectViewDefaultReferenceAttributes,
} from '../../components/mobile-components/ZSelectView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { BaseType, DecimalType, IntegerType } from '../../shared/type-definition/DataModel';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import ZFrame from '../interfaces/Frame';
import ButtonModel from './ButtonModel';
import DataBindingHelper from '../../utils/DataBindingHelper';

export default class SelectViewModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.SELECT_VIEW;

  public readonly isList: boolean = true;

  public readonly isSelection: boolean = true;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZSelectViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as SelectViewAttributes;

  public get sourceType(): string | undefined {
    switch (this.dataAttributes.sourceType) {
      case SelectViewMode.LOCAL:
        return BaseType.TEXT;
      case SelectViewMode.QUERY: {
        return DataBindingHelper.getListQueryDataType(this);
      }
      default:
        throw new Error(`SelectView sourceType error: ${JSON.stringify(this)}`);
    }
  }

  public getDefaultComponentFrame(): ZFrame {
    return ZSelectViewDefaultFrame;
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    const itemSize = { width: 65, height: this.getComponentFrame().size?.height ?? 0 };
    const normalContainer = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileContainerModel;
    const selectedContainer = ComponentModelBuilder.buildByType(
      this.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileContainerModel;
    const normalButton = ComponentModelBuilder.buildByType(
      normalContainer.mRef,
      ComponentModelType.BUTTON
    ) as ButtonModel;
    const selectedButton = ComponentModelBuilder.buildByType(
      selectedContainer.mRef,
      ComponentModelType.BUTTON
    ) as ButtonModel;

    normalButton.setComponentFrame({
      position: { x: 0, y: 0 },
      size: itemSize,
    });
    selectedButton.setComponentFrame({
      position: { x: 0, y: 0 },
      size: itemSize,
    });
    normalContainer.setComponentFrame({
      ...normalContainer.getComponentFrame(),
      size: itemSize,
    });
    selectedContainer.setComponentFrame({
      ...selectedContainer.getComponentFrame(),
      size: itemSize,
    });

    normalContainer.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.WHITE_LIKE_GREY);
    selectedContainer.dataAttributes.backgroundColor = DataBinding.withColor(
      ZColors.WHITE_LIKE_GREY
    );
    normalButton.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.WHITE);
    normalButton.dataAttributes.color = DataBinding.withColor(ZColors.BLACK);
    normalButton.dataAttributes.borderRadius = DataBinding.withLiteral(0, DecimalType.FLOAT8);
    normalButton.dataAttributes.title = DataBinding.withTextVariable([
      {
        kind: DataBindingKind.LITERAL,
        value: 'normal',
      },
    ]);
    selectedButton.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.BLACK);
    selectedButton.dataAttributes.color = DataBinding.withColor(ZColors.WHITE);
    selectedButton.dataAttributes.borderRadius = DataBinding.withLiteral(0, DecimalType.FLOAT8);
    selectedButton.dataAttributes.title = DataBinding.withTextVariable([
      {
        kind: DataBindingKind.LITERAL,
        value: 'selected',
      },
    ]);
    normalContainer.unsavedChildren = [normalButton];
    selectedContainer.unsavedChildren = [selectedButton];

    this.dataAttributes.normalMRef = normalContainer.mRef;
    this.dataAttributes.selectedMRef = selectedContainer.mRef;
    this.unsavedChildren = [normalContainer, selectedContainer];

    this.localVariableTable = {
      item: {
        type: BaseType.TEXT,
      },
      index: {
        type: IntegerType.INTEGER,
      },
      selectedIndex: {
        type: IntegerType.INTEGER,
      },
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clone = this.defaultCreateCopy(parentMRef) as SelectViewModel;
    if (!clone) return null;

    const [normalMRef, selectedMRef] = clone.unsavedChildren.map((e) => e.mRef);
    clone.dataAttributes.normalMRef = normalMRef;
    clone.dataAttributes.selectedMRef = selectedMRef;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(clone, ZSelectViewDefaultReferenceAttributes);
    }
    return clone;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZSelectView mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZSelectViewFocusView mRef={this.previewMRef} />;
  }
}
