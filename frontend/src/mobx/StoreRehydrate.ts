/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */
import { AppSchemaFragment } from '../graphQL/__generated__/AppSchemaFragment';
import BaseComponentModel from '../models/base/BaseComponentModel';
import BaseContainerModel from '../models/base/BaseContainerModel';
import { toModel } from '../models/ComponentModelBuilder';
import CoreStoreDataType, { ComponentTemplate } from './stores/CoreStoreDataType';
import { DataBinding } from '../shared/type-definition/DataBinding';
import { ShortId } from '../shared/type-definition/ZTypes';
import { DefaultCoreStoreValues } from './stores/CoreStore';

export default class StoreRehydrate {
  public static toCoreStoreData(
    appSchema: AppSchemaFragment | null | undefined
  ): CoreStoreDataType | null {
    if (!appSchema) return null;
    if (appSchema.zedVersion !== DefaultCoreStoreValues.zedVersion) {
      throw new Error(
        `Zed version mismatch have ${appSchema.zedVersion}, expecting ${DefaultCoreStoreValues.zedVersion}`
      );
    }
    return this.bfsTraverseToRebuildModelTree(appSchema);
  }

  public static rehydrateCoreStoreDataFromFile(json: string): CoreStoreDataType | null {
    if (!json || json.length < 1) return null;
    const data = JSON.parse(json);
    if (!data) return null;

    return this.bfsTraverseToRebuildModelTree(data);
  }

  private static bfsTraverseToRebuildModelTree(data: Record<string, any>): CoreStoreDataType {
    const wechatConfiguration = this.rehydrateDataAttributes(data.wechatConfiguration);
    const webConfiguration = this.rehydrateDataAttributes(data.webConfiguration);
    const mobileWebConfiguration = this.rehydrateDataAttributes(data.mobileWebConfiguration);
    const mRefMap: Record<ShortId, BaseComponentModel> = {};
    const list = [
      ...(data.wechatRootMRefs || []),
      ...(data.mobileWebRootMRefs || []),
      ...(data.webRootMRefs || []),
      ...data.componentTemplates.map((template: ComponentTemplate) => template.rootMRef),
    ];

    while (list.length > 0) {
      const mRef = list.shift();
      if (!mRef) break;
      const obj = data.mRefMap[mRef] as BaseComponentModel;
      if (!obj) throw new Error(`failed to REHYDRATE: invalid mRef: ${mRef}`);

      const model = toModel(obj);
      mRefMap[model.mRef] = model;
      if (model.isContainer) (model as BaseContainerModel).childMRefs.forEach((e) => list.push(e));
      if (model.relatedMRefs.length > 0) model.relatedMRefs.forEach((e) => list.push(e));
    }
    return {
      ...data,
      mRefMap,
      wechatConfiguration,
      webConfiguration,
      mobileWebConfiguration,
    } as CoreStoreDataType;
  }

  public static rehydrateDataAttributes(dataAttributes: Record<string, any>): Record<string, any> {
    if (!(dataAttributes instanceof Object)) {
      return dataAttributes;
    }
    const record: Record<string, any> = {};
    Object.entries(dataAttributes).forEach(([key, value]) => {
      if (value instanceof Array) {
        record[key] = value.map((e) => this.rehydrateDataAttributes(e));
      } else if (value instanceof Object) {
        if (value?.valueBinding) {
          const dataBinding = DataBinding.buildFromObject(value);
          if (dataBinding) {
            record[key] = dataBinding;
          }
        } else {
          record[key] = this.rehydrateDataAttributes(value);
        }
      } else {
        record[key] = value;
      }
    });
    return record;
  }

  public static rehydrateNetworkData(data: any): any {
    if (data instanceof Array) {
      data = data.map((item) => this.rehydrateNetworkData(item));
    } else if (data instanceof Object) {
      if (BaseComponentModel.isComponentModel(data)) {
        data = toModel(data);
      } else if (DataBinding.isDataBinding(data)) {
        data = DataBinding.buildFromObject(data);
      } else {
        data = StoreRehydrate.rehydrateDataAttributes(data);
      }
    }
    return data;
  }
}
