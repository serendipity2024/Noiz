/* eslint-disable import/no-default-export */
import { AllStores } from '../mobx/StoreContexts';
import StoreHelpers from '../mobx/StoreHelpers';
import { ComponentTemplate } from '../mobx/stores/CoreStoreDataType';
import BaseComponentModel from '../models/base/BaseComponentModel';
import BaseContainerModel from '../models/base/BaseContainerModel';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { DiffItem } from '../shared/type-definition/Diff';
import { ShortId } from '../shared/type-definition/ZTypes';

export default class ComponentDiff {
  public static buildUpdateDataAttributesDiff = (params: {
    model: BaseComponentModel;
    valueKey: string;
    newValue: any;
  }): DiffItem => {
    const { model, valueKey, newValue } = params;
    return {
      __typename: 'DiffItem',
      oldValue: model.dataAttributes[valueKey],
      newValue,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'dataAttributes',
        },
        {
          key: valueKey,
        },
      ],
    };
  };

  public static buildUpdateModelDiff = (params: {
    model: BaseComponentModel;
    valueKey: string;
    newValue: any;
  }): DiffItem => {
    const { model, valueKey, newValue } = params;
    return {
      __typename: 'DiffItem',
      oldValue: model[valueKey as keyof BaseComponentModel],
      newValue,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: valueKey,
        },
      ],
    };
  };

  public static buildAddComponentDiff = (model: BaseComponentModel): DiffItem => {
    return {
      __typename: 'DiffItem',
      oldValue: undefined,
      newValue: model,
      operation: 'add',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
      ],
    };
  };

  public static buildDeleteComponentDiffs = (
    model: BaseComponentModel,
    justDeleteSelf = false
  ): DiffItem[] => {
    let dataSource: DiffItem[] = [
      {
        __typename: 'DiffItem',
        oldValue: model,
        newValue: undefined,
        operation: 'delete',
        pathComponents: [
          {
            key: 'mRefMap',
          },
          {
            key: model.mRef,
          },
        ],
      },
    ];
    if (!justDeleteSelf) {
      model.relatedMRefs.forEach((mRef) => {
        const itemModel = StoreHelpers.getComponentModel(mRef);
        if (!itemModel) throw new Error(`missing relatedMRef, ${mRef}`);
        dataSource = [...ComponentDiff.buildDeleteComponentDiffs(itemModel), ...dataSource];
      });
      if (model.isContainer) {
        (model as BaseContainerModel).childMRefs.forEach((mRef) => {
          const itemModel = StoreHelpers.getComponentModel(mRef);
          if (!itemModel) throw new Error(`missing childMRef, ${mRef}`);
          dataSource = [...ComponentDiff.buildDeleteComponentDiffs(itemModel), ...dataSource];
        });
      }
    }
    if (model.isRootContainer) {
      dataSource = dataSource.concat(ComponentDiff.buildDeletePageMRefDiff(model.mRef));
    }
    return dataSource;
  };

  public static buildUpdateChildMRefsDiff = (
    parentMRef: ShortId,
    childMRefs: ShortId[]
  ): DiffItem => {
    const model = StoreHelpers.getComponentModel(parentMRef);
    if (!model || !model.isContainer)
      throw new Error(`buildDeleteChildMRefDiff error, ${JSON.stringify(model)}`);

    return {
      __typename: 'DiffItem',
      oldValue: (model as BaseContainerModel).childMRefs,
      newValue: childMRefs,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'childMRefs',
        },
      ],
    };
  };

  public static buildDeleteChildMRefsDiff = (
    parentMRef: ShortId,
    childMRefs: ShortId[]
  ): DiffItem => {
    const model = StoreHelpers.getComponentModel(parentMRef);
    if (!model || !model.isContainer)
      throw new Error(`buildDeleteChildMRefDiff error, ${JSON.stringify(model)}`);

    const childMRefRecord = Object.fromEntries(childMRefs.map((mRef) => [mRef, mRef]));
    const newChildren = (model as BaseContainerModel).childMRefs.filter(
      (mRef: ShortId) => !childMRefRecord[mRef]
    );
    return {
      __typename: 'DiffItem',
      oldValue: (model as BaseContainerModel).childMRefs,
      newValue: newChildren,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'childMRefs',
        },
      ],
    };
  };

  public static buildAddChildMRefsDiff = (parentMRef: ShortId, childMRefs: ShortId[]): DiffItem => {
    const model = StoreHelpers.getComponentModel(parentMRef);
    if (!model || !model.isContainer)
      throw new Error(`buildAddChildMRefsDiff error, ${JSON.stringify(model)}`);

    const newChildren = [...(model as BaseContainerModel).childMRefs, ...childMRefs];
    return {
      __typename: 'DiffItem',
      oldValue: (model as BaseContainerModel).childMRefs,
      newValue: newChildren,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'childMRefs',
        },
      ],
    };
  };

  public static buildDeleteRelatedMRefsDiff = (
    parentMRef: ShortId,
    relatedMRefs: ShortId[]
  ): DiffItem => {
    const model = StoreHelpers.getComponentModel(parentMRef);
    if (!model) throw new Error(`buildDeleteRelatedMRefsDiff error, ${JSON.stringify(model)}`);

    const relatedMRefRecord = Object.fromEntries(relatedMRefs.map((mRef) => [mRef, mRef]));
    const newChildren = model.relatedMRefs.filter((mRef: ShortId) => !relatedMRefRecord[mRef]);
    return {
      __typename: 'DiffItem',
      oldValue: model.relatedMRefs,
      newValue: newChildren,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'relatedMRefs',
        },
      ],
    };
  };

  public static buildAddRelatedMRefsDiff = (
    parentMRef: ShortId,
    relatedMRefs: ShortId[]
  ): DiffItem => {
    const model = StoreHelpers.getComponentModel(parentMRef);
    if (!model) throw new Error(`buildAddRelatedMRefsDiff error, ${JSON.stringify(model)}`);

    const newChildren = [...model.relatedMRefs, ...relatedMRefs];
    return {
      __typename: 'DiffItem',
      oldValue: model.relatedMRefs,
      newValue: newChildren,
      operation: 'update',
      pathComponents: [
        {
          key: 'mRefMap',
        },
        {
          key: model.mRef,
        },
        {
          key: 'relatedMRefs',
        },
      ],
    };
  };

  public static buildUpdatePageMRefsDiff = (list: ShortId[]): DiffItem => {
    const { wechatRootMRefs, mobileWebRootMRefs, webRootMRefs } = AllStores.coreStore;
    switch (AllStores.editorStore.editorPlatform) {
      case ZedSupportedPlatform.MOBILE_WEB: {
        return ComponentDiff.buildPageMRefsDiff('mobileWebRootMRefs', mobileWebRootMRefs, list);
      }
      case ZedSupportedPlatform.WECHAT: {
        return ComponentDiff.buildPageMRefsDiff('wechatRootMRefs', wechatRootMRefs, list);
      }
      case ZedSupportedPlatform.WEB: {
        return ComponentDiff.buildPageMRefsDiff('webRootMRefs', webRootMRefs, list);
      }
      default:
        throw new Error('buildUpdatePageMRefsDiff error, editorPlatform is notsupport');
    }
  };

  public static buildAddPageMRefDiff = (pageMRef: ShortId): DiffItem => {
    const { wechatRootMRefs, mobileWebRootMRefs, webRootMRefs } = AllStores.coreStore;
    switch (AllStores.editorStore.editorPlatform) {
      case ZedSupportedPlatform.MOBILE_WEB: {
        return ComponentDiff.buildPageMRefsDiff('mobileWebRootMRefs', mobileWebRootMRefs, [
          ...mobileWebRootMRefs,
          pageMRef,
        ]);
      }
      case ZedSupportedPlatform.WECHAT: {
        return ComponentDiff.buildPageMRefsDiff('wechatRootMRefs', wechatRootMRefs, [
          ...wechatRootMRefs,
          pageMRef,
        ]);
      }
      case ZedSupportedPlatform.WEB: {
        return ComponentDiff.buildPageMRefsDiff('webRootMRefs', webRootMRefs, [
          ...webRootMRefs,
          pageMRef,
        ]);
      }
      default:
        throw new Error('buildAddPageMRefDiff error, editorPlatform is notsupport');
    }
  };

  public static buildDeletePageMRefDiff = (pageMRef: ShortId): DiffItem => {
    const { wechatRootMRefs, mobileWebRootMRefs, webRootMRefs } = AllStores.coreStore;
    switch (AllStores.editorStore.editorPlatform) {
      case ZedSupportedPlatform.MOBILE_WEB: {
        const rootMRefs = mobileWebRootMRefs.filter((mRef: ShortId) => mRef !== pageMRef);
        return ComponentDiff.buildPageMRefsDiff(
          'mobileWebRootMRefs',
          mobileWebRootMRefs,
          rootMRefs
        );
      }
      case ZedSupportedPlatform.WECHAT: {
        const rootMRefs = wechatRootMRefs.filter((mRef: ShortId) => mRef !== pageMRef);
        return ComponentDiff.buildPageMRefsDiff('wechatRootMRefs', wechatRootMRefs, rootMRefs);
      }
      case ZedSupportedPlatform.WEB: {
        const rootMRefs = webRootMRefs.filter((mRef: ShortId) => mRef !== pageMRef);
        return ComponentDiff.buildPageMRefsDiff('webRootMRefs', webRootMRefs, rootMRefs);
      }
      default:
        throw new Error('buildDeletePageMRefDiff error, editorPlatform is notsupport');
    }
  };

  public static buildUpdateComponentTemplatesDiff = (
    componentTemplates: ComponentTemplate[]
  ): DiffItem => {
    return {
      __typename: 'DiffItem',
      oldValue: AllStores.coreStore.componentTemplates,
      newValue: componentTemplates,
      operation: 'update',
      pathComponents: [
        {
          key: 'componentTemplates',
        },
      ],
    };
  };

  private static buildPageMRefsDiff = (
    key: string,
    oldValue: ShortId[],
    newValue: ShortId[]
  ): DiffItem => {
    return {
      __typename: 'DiffItem',
      oldValue,
      newValue,
      operation: 'update',
      pathComponents: [
        {
          key,
        },
      ],
    };
  };
}
