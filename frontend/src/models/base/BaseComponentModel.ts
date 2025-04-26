/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';
import { action, computed, observable } from 'mobx';
import React from 'react';
import uniqid from 'uniqid';
import FrameDiff from '../../diffs/FrameDiff';
import ComponentDiff from '../../diffs/ComponentDiff';
import { AllStores } from '../../mobx/StoreContexts';
import StoreHelpers from '../../mobx/StoreHelpers';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { VariableTable } from '../../shared/type-definition/DataBinding';
import { DiffItem } from '../../shared/type-definition/Diff';
import { VerticalDirection, VerticalLayoutMode } from '../../shared/type-definition/Layout';
import { ShortId } from '../../shared/type-definition/ZTypes';
import StringUtils from '../../utils/StringUtils';
import { toModel } from '../ComponentModelBuilder';
import ComponentModel, {
  ComponentFocusable,
  ComponentFrameConfiguration,
  ComponentModelCopyable,
  ComponentModelFrameable,
  ComponentModelLayout,
  ComponentCustomable,
  PreviewRenderable,
  ComponentModelGridLayout,
  ComponentLayoutConfiguration,
  ZedSupportedPlatform,
  ComponentInputOutputData,
} from '../interfaces/ComponentModel';
import ZFrame from '../interfaces/Frame';
import BaseContainerModel from './BaseContainerModel';
import { DummyComponentFrame } from './BaseMobileComponentModel';
import ZGridLayout from '../interfaces/GridLayout';
import { DataDependency, DataDependencyType } from '../../mobx/stores/ValidationStore';
import { isDefined } from '../../utils/utils';

export const DefaultComponentModelLayout = {
  location: VerticalDirection.TOP_DOWN,
  layoutMode: VerticalLayoutMode.FIXED,
};

export default abstract class BaseComponentModel
  implements
    ComponentModel,
    PreviewRenderable,
    ComponentModelFrameable,
    ComponentFocusable,
    ComponentModelCopyable,
    ComponentCustomable,
    ComponentModelGridLayout
{
  constructor(public parentMRef: ShortId) {
    // do nothing
  }

  public readonly applicablePlatforms: ZedSupportedPlatform[] = [];

  public readonly mRef: ShortId = uniqid.process();

  public readonly isRootContainer: boolean = !this.parentMRef;

  public readonly isContainer: boolean = false;

  public readonly isList: boolean = false;

  public readonly isInput: boolean = false;

  public readonly isSelection: boolean = false;

  public readonly eligibleAsPasteTargetContainer: boolean = false;

  public readonly isSlot: boolean = false;

  public readonly isDraggable: boolean = false;

  public shouldFullyFocus(): boolean {
    return !!this.parentMRef || this.isTemplate;
  }

  public get componentName(): string {
    return this.name.length > 0 ? this.name : this.type;
  }

  public set componentName(name: string) {
    this.name = name;
  }

  public get previewMRef(): string {
    return this.referencedTemplateMRef ?? this.mRef;
  }

  @observable
  public relatedMRefs: ShortId[] = [];

  @observable
  public variableTable: VariableTable = {};

  @observable
  public localVariableTable: VariableTable = {};

  @observable
  public isTemplate = false;

  @observable
  public referencedTemplateMRef?: ShortId;

  @observable
  public outputDataSource?: ComponentInputOutputData[];

  @observable
  public inputDataSource?: ComponentInputOutputData[];

  @observable
  public abstract readonly type: ComponentModelType;

  @observable
  public abstract dataAttributes: Record<string, any>;

  @observable
  public abstract isFloating: boolean | undefined;

  @observable
  public abstract verticalLayout: ComponentModelLayout | undefined;

  @observable
  public abstract gridLayout: ZGridLayout | undefined;

  public getDefaultComponentFrame(): ZFrame {
    return DummyComponentFrame;
  }

  public abstract getComponentFrame(): ZFrame;

  public abstract renderForPreview(): React.ReactNode;

  public abstract defaultDataAttributes(): Record<string, any>;

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: true,
      sizeEnabled: true,
    };
  }

  public getLayoutConfiguration(): ComponentLayoutConfiguration {
    return {
      floatEnabled: true,
      locationEnabled: true,
      layoutModeEnabled: false,
    };
  }

  public isFrameConfigurationDisabled(): boolean {
    return this.isRootContainer;
  }

  public hasDeleteConfiguration(): boolean {
    return !this.isTemplate;
  }

  public hasFocusMode(): boolean {
    return false;
  }

  public renderForFocusView(): React.ReactNode {
    return null;
  }

  @computed
  public get camelCasedUniqueName(): string {
    return StringUtils.generateCamelCasedMRef(this);
  }

  public set camelCasedUniqueName(value: string) {
    // do nothing
  }

  public toJSON(): any {
    return {
      ...Object.assign(this),
      camelCasedUniqueName: this.camelCasedUniqueName,
    };
  }

  @action
  public onCreateComponentDiffs(): DiffItem[] {
    const childDiffs: DiffItem[] = [];
    this.relatedMRefs = this.unsavedRelatedModels.map((m) => {
      const diffItems = toModel(m).onCreateComponentDiffs();
      diffItems.forEach((di) => childDiffs.push(di));
      return m.mRef;
    });
    this.unsavedRelatedModels = [];
    this.updatedAtValue = new Date().valueOf();

    return [ComponentDiff.buildAddComponentDiff(this), ...childDiffs];
  }

  @action
  public onUpdateFrame(newFrame: Partial<ZFrame>): void {
    const dataSource = FrameDiff.buildUpdateComponentFrameDiffs(this, newFrame);
    AllStores.diffStore.applyDiff(dataSource);
  }

  @action
  public onUpdateDataAttributes(valueKey: string, newValue: any): void {
    if (!this.dataAttributes.hasOwnProperty(valueKey)) {
      throw new Error(`dataAttributes non-existent ${valueKey}, ${JSON.stringify(this)}`);
    }
    const diffItems = [
      ComponentDiff.buildUpdateDataAttributesDiff({
        model: this,
        valueKey,
        newValue,
      }),
      ...this.unexecutedDiffItems,
    ];
    AllStores.diffStore.applyDiff(diffItems);
    this.unexecutedDiffItems = [];
  }

  @action
  public onUpdateModel(valueKey: string, newValue: any): void {
    if (!this.hasOwnProperty(valueKey)) {
      throw new Error(`model property non-existent ${valueKey}, ${JSON.stringify(this)}`);
    }
    const diffItems = [
      ComponentDiff.buildUpdateModelDiff({
        model: this,
        valueKey,
        newValue,
      }),
      ...this.unexecutedDiffItems,
    ];
    AllStores.diffStore.applyDiff(diffItems);
    this.unexecutedDiffItems = [];
  }

  public canCreateComponentTemplate(): boolean {
    return this.canCopy();
  }

  public canCopy(): boolean {
    return true;
  }

  public abstract createCopy(parentMRef?: ShortId): BaseComponentModel | null;

  public defaultCreateCopy(parentMRef?: ShortId): BaseComponentModel | null {
    if (!this.canCopy()) return null;

    const clone = toModel({
      ..._.cloneDeep(this),
      mRef: uniqid.process(),
      parentMRef: parentMRef ?? this.parentMRef,
      componentName: StringUtils.incrementStringPostfixSequence(this.componentName),
      relatedMRefs: [],
    });
    clone.verticalLayout = DefaultComponentModelLayout;

    if (this.isTemplate) {
      clone.referencedTemplateMRef = this.mRef;
      clone.isTemplate = false;
    } else {
      AllStores.editorStore.transientMRefMapCopy[this.mRef] = clone.mRef;
      this.relatedModels().forEach((m) => {
        const model = m.createCopy(clone.mRef);
        if (model) clone.unsavedRelatedModels.push(model);
      });
    }

    return clone;
  }

  // for in-memory creation
  @observable
  public unsavedRelatedModels: BaseComponentModel[] = [];

  @observable
  public unexecutedDiffItems: DiffItem[] = [];

  @action
  public save(): void {
    this.unsavedRelatedModels.forEach((m) => {
      toModel(m).save();
      this.relatedMRefs.push(m.mRef);
    });
    this.unsavedRelatedModels = [];

    this.updatedAtValue = new Date().valueOf();
    StoreHelpers.registerComponent(this);
  }

  public parent(): BaseContainerModel {
    return StoreHelpers.getComponentModel(this.parentMRef) as BaseContainerModel;
  }

  public relatedModels(): BaseComponentModel[] {
    const result: BaseComponentModel[] = [];
    this.relatedMRefs.forEach((mRef: ShortId) => {
      const model = StoreHelpers.getComponentModel(mRef);
      if (model) result.push(model);
    });
    return result;
  }

  public getCreatedAt(): number {
    return this.createdAtValue;
  }

  public getUpdatedAt(): number {
    return this.updatedAtValue;
  }

  @observable
  public name = '';

  @observable
  private createdAtValue: number = new Date().valueOf();

  @observable
  public updatedAtValue = -1;

  public static isComponentModel(input: any): boolean {
    return (
      input &&
      typeof input === 'object' &&
      input.mRef &&
      Object.values(ComponentModelType).includes(input.type)
    );
  }

  public imperfectCopy(oldParentMRef?: ShortId, newParentMRef?: ShortId): boolean {
    if (!oldParentMRef) {
      return false;
    }
    const { editorStore } = AllStores;
    if (editorStore.clipBoardMRefs.length <= 0) {
      return true;
    }
    if (!editorStore.clipBoardContainerMRef) {
      return false;
    }
    if (oldParentMRef === newParentMRef) {
      return false;
    }
    const selectedContainerMRefCopy = StoreHelpers.findComponentModelOrThrow(
      editorStore.clipBoardMRefs[0]
    ).parentMRef;

    const mRefList: string[] = [];
    let previousMRef = editorStore.clipBoardContainerMRef;
    while (previousMRef) {
      mRefList.push(previousMRef);
      const model = StoreHelpers.findComponentModelOrThrow(previousMRef);
      previousMRef = model.parentMRef;
    }
    if (mRefList.includes(selectedContainerMRefCopy)) {
      return false;
    }
    return true;
  }

  public resetDataAttributesToDefaultIfNecessary(
    clonedModel: BaseComponentModel,
    defaultDataAttributes: Record<string, any>
  ) {
    const keyInformation = this.fetchCopyKeyInformation();
    Object.keys(defaultDataAttributes).forEach((key) => {
      const dataDependencies = AllStores.validationStore.getAllDataDependencyList(
        [
          {
            key: 'mRefMap',
          },
          {
            key: this.mRef,
          },
          {
            key: 'dataAttributes',
          },
          {
            key,
          },
        ],
        this.dataAttributes[key]
      );
      if (!keyInformation || this.needsToResetDataAttributes(dataDependencies, keyInformation)) {
        const targetMRefs: string[] = dataDependencies
          .map((dd) => {
            if (dd.dependencyType === DataDependencyType.COMPONENT) {
              return AllStores.editorStore.transientMRefMapCopy[dd.targetMRef];
            }
            return undefined;
          })
          .filter(isDefined);
        clonedModel.unsavedRelatedModels = clonedModel.unsavedRelatedModels.filter(
          (model) => !targetMRefs.includes(model.mRef)
        );
        clonedModel.dataAttributes[key] = defaultDataAttributes[key];
      }
    });
  }

  private needsToResetDataAttributes(
    dataDependencies: DataDependency[],
    keyInformation: {
      oldScreenMRef?: string;
      newScreenMRef?: string;
    }
  ): boolean {
    const { oldScreenMRef, newScreenMRef } = keyInformation;
    const dependencyError = !!dataDependencies.find((dataDependency) => {
      switch (dataDependency.dependencyType) {
        case DataDependencyType.GLOBAL_VARIABLE_TABLE: {
          return false;
        }
        case DataDependencyType.QUERIES:
        case DataDependencyType.THIRD_PARTY_QUERIES:
        case DataDependencyType.VARIABLE_TABLE:
        case DataDependencyType.PAGE_VARIABLE_TABLE: {
          return oldScreenMRef !== newScreenMRef;
        }
        default:
          return true;
      }
    });
    return dependencyError;
  }

  private fetchCopyKeyInformation():
    | {
        oldScreenMRef?: string;
        newScreenMRef?: string;
      }
    | undefined {
    const { editorStore } = AllStores;

    if (editorStore.clipBoardMRefs.length <= 0) {
      return undefined;
    }
    if (!editorStore.clipBoardContainerMRef) {
      return undefined;
    }

    let selectedModelCopy: BaseComponentModel | undefined = StoreHelpers.findComponentModelOrThrow(
      editorStore.clipBoardMRefs[0]
    );
    let clipBoardModel: BaseComponentModel | undefined = StoreHelpers.findComponentModelOrThrow(
      editorStore.clipBoardContainerMRef
    );

    while (selectedModelCopy && !selectedModelCopy.isRootContainer) {
      if (selectedModelCopy.parentMRef.length > 0) {
        selectedModelCopy = StoreHelpers.findComponentModelOrThrow(selectedModelCopy.parentMRef);
      } else {
        selectedModelCopy = undefined;
      }
    }
    const oldScreenMRef = selectedModelCopy?.mRef;

    while (clipBoardModel && !clipBoardModel.isRootContainer) {
      if (clipBoardModel.parentMRef.length > 0) {
        clipBoardModel = StoreHelpers.findComponentModelOrThrow(clipBoardModel.parentMRef);
      } else {
        clipBoardModel = undefined;
      }
    }
    const newScreenMRef = clipBoardModel?.mRef;

    return { oldScreenMRef, newScreenMRef };
  }
}
