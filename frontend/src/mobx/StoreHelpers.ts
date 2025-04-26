/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { transaction } from 'mobx';
import { getConfiguration } from '../hooks/useConfiguration';
import BaseComponentModel from '../models/base/BaseComponentModel';
import BaseContainerModel from '../models/base/BaseContainerModel';
import { toModel } from '../models/ComponentModelBuilder';
import { ComponentModelLayout } from '../models/interfaces/ComponentModel';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import { VerticalDirection } from '../shared/type-definition/Layout';
import { ShortId } from '../shared/type-definition/ZTypes';
import { AllStores } from './StoreContexts';
import CoreStoreDataType from './stores/CoreStoreDataType';
import { internalTabBarItemScreenMRef } from '../components/mobile-components/ZTabBar';
import { DiffItem } from '../shared/type-definition/Diff';

class Helpers {
  public resetAllData(): void {
    AllStores.coreStore.reset();
    AllStores.diffStore.reset();
    AllStores.projectStore.reset();
  }

  public getCoreData(): CoreStoreDataType {
    return AllStores.coreStore;
  }

  // find component
  public getComponentModel<T extends BaseComponentModel>(
    mRef: ShortId
  ): BaseComponentModel | undefined {
    return AllStores.coreStore.getModel(mRef);
  }

  public findComponentModelOrThrow<T extends BaseComponentModel>(mRef: ShortId): T {
    const model = this.getComponentModel(mRef);
    if (!model) throw new Error(`unexpected undefined model for mRef=${mRef}`);
    return model as T;
  }

  public findParentOrThrow(model: BaseComponentModel): BaseComponentModel | undefined {
    const mRef = model.parentMRef;
    if (!mRef) return undefined;
    return this.findComponentModelOrThrow(mRef);
  }

  public registerComponent<T extends BaseComponentModel | BaseContainerModel>(model: T) {
    AllStores.coreStore.mRefMap[model.mRef] = model;
    return model;
  }

  public addChildComponent(parentMRef: string, childMRef: string) {
    AllStores.coreStore.addChildComponent(parentMRef, childMRef);
  }

  public removeChildMRef(parentMRef: string, childMRef: string) {
    AllStores.coreStore.removeChildMRef(parentMRef, childMRef);
  }

  public removeComponent(mRef: string) {
    AllStores.coreStore.removeComponent(mRef);
  }

  public fetchRootModel(model?: BaseComponentModel): BaseComponentModel | null {
    if (model?.isRootContainer || model?.isTemplate) return model;
    const parentModel = AllStores.coreStore.getModel(model?.parentMRef ?? '');
    if (!parentModel) return null;
    return this.fetchRootModel(parentModel);
  }

  public fetchParentModalViewList(model: BaseComponentModel): BaseComponentModel[] {
    const { mRefMap } = AllStores.coreStore;
    const dataSource: BaseComponentModel[] = [];
    for (
      let parentModel: BaseComponentModel | undefined = mRefMap[model.parentMRef];
      parentModel;
      parentModel = mRefMap[parentModel.parentMRef]
    ) {
      (parentModel.relatedMRefs ?? []).forEach((mRef) => {
        const elementModel = mRefMap[mRef] as BaseComponentModel;
        if (elementModel.type === ComponentModelType.MODAL_VIEW) {
          dataSource.push(elementModel);
        }
      });
    }
    return dataSource;
  }

  public findAllModelsWithLogicInContainer(param: {
    container: BaseComponentModel;
    filter: (model: BaseComponentModel) => boolean;
  }): BaseComponentModel[] {
    const rsp: BaseComponentModel[] = [];
    this.findAllComponentModel(param.container, true).forEach((data) => {
      if (param.filter(data)) {
        rsp.push(toModel(data));
      }
    });
    return rsp;
  }

  public screenContainsTabBar(screenMRef: ShortId): boolean {
    const { coreStore, editorStore } = AllStores;
    const { tabBarSetting } = getConfiguration(coreStore, editorStore.editorPlatform);
    return !!tabBarSetting?.items.find((item) => item.screenMRef.effectiveValue === screenMRef);
  }

  // TODO: waiting refactor to mutation diff
  public genUpdateTabBarDiffItem(deleteScreenMRef: ShortId): DiffItem | undefined {
    const { coreStore, editorStore } = AllStores;
    const configuration = getConfiguration(coreStore, editorStore.editorPlatform);
    if (!configuration.tabBarSetting) return undefined;
    const items = configuration.tabBarSetting.items.map((item) => {
      const screenMRef = item.screenMRef.effectiveValue;
      if (screenMRef === deleteScreenMRef) {
        item = internalTabBarItemScreenMRef(item, '');
      }
      return item;
    });
    const tabBarSetting = items.find((item) => !item.isHidden.effectiveValue)
      ? {
          ...configuration.tabBarSetting,
          items,
        }
      : undefined;
    return {
      __typename: 'DiffItem',
      oldValue: configuration.tabBarSetting,
      newValue: tabBarSetting,
      operation: 'update',
      pathComponents: [
        {
          key: `${editorStore.editorPlatform}Configuration`,
        },
        {
          key: 'tabBarSetting',
        },
      ],
    };
  }

  public containerIsList(model?: BaseContainerModel): boolean {
    if (!model) return false;
    let { isList } = model;
    if (!isList && model.parentMRef) {
      const parentModel = StoreHelpers.getComponentModel(model.parentMRef) as BaseContainerModel;
      isList = parentModel.isList ?? false;
    }
    return isList;
  }

  public generateAllComponentLayoutData() {
    const dirtyModels: BaseComponentModel[] = [];
    [...AllStores.coreStore.wechatRootMRefs, ...AllStores.coreStore.mobileWebRootMRefs]
      .map((mRef) => AllStores.coreStore.getModel(mRef) as BaseContainerModel)
      .filter((e) => e && e.isRootContainer)
      .forEach((model) => {
        const list = StoreHelpers.generateContainerLayoutData(model);
        list.forEach((item) => dirtyModels.push(item));
      });
    AllStores.coreStore.componentTemplates
      .map(
        (componentTemplate) =>
          AllStores.coreStore.getModel(componentTemplate.rootMRef) as BaseContainerModel
      )
      .forEach((model) => {
        const list = StoreHelpers.generateContainerLayoutData(model);
        list.forEach((item) => dirtyModels.push(item));
      });
    transaction(() => {
      dirtyModels.map((model) => AllStores.coreStore.updateComponentModel(model));
    });
  }

  public getWechatOfficialAccountCount(childMRefs: ShortId[]) {
    return childMRefs.filter((e) => {
      return (
        AllStores.coreStore.getModel<BaseComponentModel>(e)?.type ===
        ComponentModelType.WECHAT_OFFICIAL_ACCOUNT
      );
    }).length;
  }

  private generateContainerLayoutData(model: BaseContainerModel) {
    const coplanarModels: BaseComponentModel[] = (model.childMRefs ?? [])
      .map((e) => StoreHelpers.getComponentModel(e))
      .filter((e) => e && e.getFrameConfiguration().positionEnabled) as BaseComponentModel[];
    const flowModels = coplanarModels?.filter((e) => !e.isFloating) ?? [];
    const floatingModels = coplanarModels?.filter((e) => e.isFloating) ?? [];

    const dirtyModels: BaseComponentModel[] = [];

    floatingModels.forEach((item) => {
      const itemFrame = item.getComponentFrame();
      const referenceFrame = model.getComponentFrame();
      switch (item.verticalLayout?.location) {
        case VerticalDirection.TOP_DOWN: {
          item.verticalLayout = {
            ...item.verticalLayout,
            referenceMRef: model.mRef,
            margin: itemFrame.position?.y ?? 0,
          };
          break;
        }
        case VerticalDirection.BOTTOM_UP: {
          item.verticalLayout = {
            ...item.verticalLayout,
            referenceMRef: model.mRef,
            margin:
              (referenceFrame.size.height ?? 0) -
              ((itemFrame.position?.y ?? 0) + (itemFrame.size.height ?? 0)),
          };
          break;
        }
        default:
          throw new Error(`unsupported verticalLayout, ${JSON.stringify(item)}`);
      }
      dirtyModels.push(item);
    });

    const topList = flowModels
      .filter(
        (e) =>
          !e.verticalLayout?.location || e.verticalLayout.location === VerticalDirection.TOP_DOWN
      )
      .sort(
        (a, b) =>
          (a.getComponentFrame().position?.y ?? 0) - (b.getComponentFrame().position?.y ?? 0)
      );
    topList.forEach((item, index) => {
      const referenceModel = index === 0 ? model : topList[index - 1];
      const referenceFrame = referenceModel.getComponentFrame();
      const itemFrame = item.getComponentFrame();
      const referenceMaxY =
        index === 0 ? 0 : (referenceFrame.position?.y ?? 0) + (referenceFrame.size.height ?? 0);

      item.verticalLayout = {
        ...item.verticalLayout,
        referenceMRef: referenceModel.mRef,
        margin: (itemFrame.position?.y ?? 0) - referenceMaxY,
      } as ComponentModelLayout;
      dirtyModels.push(item);
    });

    const bottomList = flowModels
      .filter((e) => e.verticalLayout?.location === VerticalDirection.BOTTOM_UP)
      .sort(
        (a, b) =>
          (b.getComponentFrame().position?.y ?? 0) +
          (b.getComponentFrame().size?.height ?? 0) -
          (a.getComponentFrame().position?.y ?? 0) -
          (a.getComponentFrame().size?.height ?? 0)
      );
    bottomList.forEach((item, index) => {
      const referenceModel = index === 0 ? model : bottomList[index - 1];
      const referenceFrame = referenceModel.getComponentFrame();
      const itemFrame = item.getComponentFrame();
      item.verticalLayout = {
        ...item.verticalLayout,
        referenceMRef: referenceModel.mRef,
        margin:
          (index === 0 ? referenceFrame.size.height ?? 0 : referenceFrame.position?.y ?? 0) -
          ((itemFrame.position?.y ?? 0) + (itemFrame.size.height ?? 0)),
      } as ComponentModelLayout;
      dirtyModels.push(item);
    });
    [...(model.childMRefs ?? []), ...(model.relatedMRefs ?? [])]
      .map((e) => StoreHelpers.getComponentModel(e) as BaseContainerModel)
      .filter((e) => e)
      .forEach((e) => {
        const list = StoreHelpers.generateContainerLayoutData(e);
        list.forEach((item) => dirtyModels.push(item));
      });
    return dirtyModels;
  }

  private findAllComponentModel(
    container: BaseComponentModel,
    isCurrentRootTemplate: boolean
  ): BaseComponentModel[] {
    if (container.isTemplate && !isCurrentRootTemplate) {
      return [];
    }
    const childMRefs = container.isContainer ? (container as BaseContainerModel).childMRefs : [];
    const relatedMRefs = container.relatedMRefs ?? [];
    if (childMRefs.length < 1 && relatedMRefs.length < 1) return [];
    const rsp: BaseComponentModel[] = [];
    for (const mRef of childMRefs) {
      const model = this.findComponentModelOrThrow(mRef);
      rsp.push(model);
      this.findAllComponentModel(model, false).forEach((data) => rsp.push(data));
    }
    for (const mRef of relatedMRefs) {
      const model = this.findComponentModelOrThrow(mRef);
      rsp.push(model);
      this.findAllComponentModel(model, false).forEach((data) => rsp.push(data));
    }
    return rsp;
  }
}

const StoreHelpers = new Helpers();

export default StoreHelpers;
