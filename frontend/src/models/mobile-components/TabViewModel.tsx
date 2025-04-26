/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import { action, computed, observable } from 'mobx';
import React from 'react';
import ZTabViewFocusView from '../../components/focus-view/ZTabViewFocusView';
import ZTabView, {
  TabViewAttributes,
  TabViewItem,
  ZTabViewDefaultDataAttributes,
  ZTabViewDefaultFrame,
} from '../../components/mobile-components/ZTabView';
import FrameDiff from '../../diffs/FrameDiff';
import { AllStores } from '../../mobx/StoreContexts';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType, IntegerType } from '../../shared/type-definition/DataModel';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileContainerModel from '../base/BaseMobileContainerModel';
import ComponentModelBuilder from '../ComponentModelBuilder';
import ZFrame from '../interfaces/Frame';
import BlankContainerModel from './BlankContainerModel';

export default class TabViewModel extends BaseMobileContainerModel {
  public readonly type: ComponentModelType = ComponentModelType.TAB_VIEW;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public defaultDataAttributes(): Record<string, any> {
    return ZTabViewDefaultDataAttributes;
  }

  @observable
  public dataAttributes: TabViewAttributes = this.defaultDataAttributes() as TabViewAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZTabViewDefaultFrame;
  }

  public get tabWidth(): number {
    return Math.floor(
      (this.getComponentFrame().size.width ?? 0) / this.dataAttributes.tabList.length
    );
  }

  constructor(public parentMRef: ShortId, shouldInitialize?: boolean) {
    super(parentMRef);

    if (!shouldInitialize) return;

    this.dataAttributes.tabList.forEach((e) => {
      const containerModel = ComponentModelBuilder.buildByType(
        this.mRef,
        ComponentModelType.BLANK_CONTAINER
      ) as BlankContainerModel;
      e.mRef = containerModel.mRef;
      containerModel.setComponentFrame(this.getComponentFrame());
      containerModel.dataAttributes.backgroundColor = DataBinding.withColor(ZColors.TRANSPARENT);
      this.unsavedChildren.push(containerModel);
    });
    this.localVariableTable = {
      item: {
        type: BaseType.TEXT,
      },
      index: {
        type: IntegerType.INTEGER,
      },
    };
  }

  @action
  public onUpdateFrame(newFrame: ZFrame): void {
    const dataSource = FrameDiff.buildUpdateComponentFrameDiffs(this, newFrame);
    this.dataAttributes.tabList.forEach((item) => {
      const itemModel = AllStores.coreStore.getModel(item.mRef);
      if (itemModel) {
        FrameDiff.buildUpdateComponentFrameDiffs(itemModel, newFrame).forEach((di) =>
          dataSource.push(di)
        );
      }
    });

    const normalTabModel = AllStores.coreStore.getModel(this.dataAttributes.normalTabMRef);
    const selectedTabModel = AllStores.coreStore.getModel(this.dataAttributes.selectedTabMRef);
    if (normalTabModel && selectedTabModel) {
      FrameDiff.buildUpdateComponentFrameDiffs(normalTabModel, {
        size: {
          ...normalTabModel.getComponentFrame().size,
          width: this.tabWidth,
        },
      }).forEach((di) => dataSource.push(di));
      FrameDiff.buildUpdateComponentFrameDiffs(selectedTabModel, {
        size: {
          ...selectedTabModel.getComponentFrame().size,
          width: this.tabWidth,
        },
      }).forEach((di) => dataSource.push(di));
    }
    AllStores.diffStore.applyDiff(dataSource);
  }

  @computed
  public get tabSelectedIndex(): number {
    let tabSelectedIndex = Number(this.dataAttributes.selectedIndex.effectiveValue ?? 0);
    if (isNaN(tabSelectedIndex) || tabSelectedIndex > this.dataAttributes.tabList.length - 1) {
      tabSelectedIndex = 0;
    }
    return tabSelectedIndex;
  }

  @action
  public setSelectedIndex(index: number): void {
    this.dataAttributes.selectedIndex = DataBinding.withLiteral(index, IntegerType.INTEGER);
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as TabViewModel;

    let newNormalTabMRef = '';
    if (this.dataAttributes.normalTabMRef) {
      const childMRefIndex = this.childMRefs.indexOf(this.dataAttributes.normalTabMRef);
      newNormalTabMRef = clonedModel.unsavedChildren[childMRefIndex]?.mRef;
    }
    let newSelectedTabMRef = '';
    if (this.dataAttributes.selectedTabMRef) {
      const childMRefIndex = this.childMRefs.indexOf(this.dataAttributes.selectedTabMRef);
      newSelectedTabMRef = clonedModel.unsavedChildren[childMRefIndex]?.mRef;
    }
    clonedModel.dataAttributes = {
      ...clonedModel.dataAttributes,
      selectedIndex: ZTabViewDefaultDataAttributes.selectedIndex,
      tabList: clonedModel.dataAttributes.tabList.map((tab: TabViewItem) => {
        const childMRefIndex = this.childMRefs.indexOf(tab.mRef);
        const newMRef = clonedModel.unsavedChildren[childMRefIndex]?.mRef;
        if (newMRef) {
          tab.mRef = newMRef;
        }
        return tab;
      }),
      normalTabMRef: newNormalTabMRef,
      selectedTabMRef: newSelectedTabMRef,
    };
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZTabView mRef={this.previewMRef} />;
  }

  public hasFocusMode(): boolean {
    return true;
  }

  public renderForFocusView(): React.ReactNode {
    return <ZTabViewFocusView mRef={this.previewMRef} />;
  }
}
