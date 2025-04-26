/* eslint-disable import/no-default-export */
/* eslint-disable no-prototype-builtins */
import Optional from 'optional-js';
import { SubsystemFragment } from '../graphQL/__generated__/SubsystemFragment';
import CoreStore from '../mobx/stores/CoreStore';
import BaseContainerModel from '../models/base/BaseContainerModel';
import { ARRAY_TYPE, BaseType, ColumnTypes } from '../shared/type-definition/DataModel';
import {
  EventType,
  CustomRequestBinding,
  CustomRequestField,
} from '../shared/type-definition/EventBinding';
import { FunctorApi } from '../shared/type-definition/FunctorSchema';
import { ThirdPartyApi } from '../shared/type-definition/ThirdPartySchema';
import { ShortId } from '../shared/type-definition/ZTypes';
import { ZDebug } from '../utils/ZDebug';
import useStores from './useStores';

export const CUSTOM_MUTATION = 'custom-mutation';
export const INPUT = 'input';
export const OUTPUT = 'output';

export default function useCustomRequestRegistry(): {
  customQueries: CustomRequestBinding[];
  customThirdPartyMutations: CustomRequestBinding[];
  customFunctorMutations: CustomRequestBinding[];
  getCustomRequestField: (type: string) => CustomRequestField | undefined;
  resolveCustomQueries: (mRef: ShortId) => CustomRequestBinding[];
} {
  const { coreStore } = useStores();
  return getCustomRequestRegistry(coreStore);
}

export function getCustomRequestRegistry(coreStore: CoreStore): {
  customQueries: CustomRequestBinding[];
  customThirdPartyMutations: CustomRequestBinding[];
  customFunctorMutations: CustomRequestBinding[];
  getCustomRequestField: (type: string) => CustomRequestField | undefined;
  resolveCustomQueries: (mRef: ShortId) => CustomRequestBinding[];
} {
  const getModel = (mRef: ShortId) => coreStore.getModel(mRef);
  const { remoteApiSchema } = coreStore;
  const functors = coreStore.functors ?? [];
  const subsystemRecords = coreStore.subsystemRecords ?? [];

  const remoteApiList: CustomRequestBinding[] = [];
  const allCustomRequestFields: CustomRequestField[] = [];

  const getCustomApiField = (name: string, data: any): CustomRequestField | undefined => {
    const dataIsObject = data instanceof Object && data.hasOwnProperty('type');
    if (!dataIsObject) {
      return undefined;
    }
    if (data.type === ARRAY_TYPE) {
      const itemField = getCustomApiField(name, data.items);
      return {
        name,
        type: ARRAY_TYPE,
        itemType: itemField?.type,
        object: itemField?.object,
        list: [],
      };
    }
    let { type } = data;
    if (type === 'object') {
      type = data.typeName;
    } else if (data.columnType) {
      type = data.columnType;
      if (!ColumnTypes.includes(data.columnType)) {
        ZDebug.error(`unsupported column type for custom query, columnType: ${data.columnType}`);
      }
    } else {
      type = BaseType.TEXT;
    }
    const properties = data?.properties ?? {};
    const fields: CustomRequestField[] =
      (Object.entries(properties)
        .map(([key, value]) => getCustomApiField(key, value))
        .filter((v) => v) as CustomRequestField[]) ?? [];
    const object: CustomRequestField = {
      name,
      type,
      object: fields.length > 0 ? fields : undefined,
    };
    if (fields.length > 0) {
      allCustomRequestFields.push(object);
    }
    return object;
  };

  const resolveCustomQueries = (mRef: ShortId) =>
    Optional.ofNullable(getModel(mRef))
      .map((model) => {
        const queries: CustomRequestBinding[] = [];
        for (let m = getModel(model.parentMRef); m; m = getModel(m.parentMRef)) {
          const containerModel: BaseContainerModel = m as BaseContainerModel;
          if (Object.values(containerModel.itemVariableTable ?? {}).length <= 0) {
            const thirdPartyQueries = containerModel?.thirdPartyQueries ?? [];
            if (thirdPartyQueries.length > 0) {
              Object.assign(queries, thirdPartyQueries);
            }
          }
        }
        return queries;
      })
      .orElse([]);

  if (remoteApiSchema instanceof Array) {
    remoteApiSchema.forEach((value) => {
      value.apis.forEach((api: ThirdPartyApi) => {
        remoteApiList.push({
          type: EventType.THIRD_PARTY_API,
          value: api.apiName,
          requestId: api.apiName,
          operation: api.apiType as 'query' | 'mutation',
          input:
            api.inputSchema && Object.values(api.inputSchema).length > 0
              ? getCustomApiField(INPUT, api.inputSchema)
              : undefined,
          output:
            api.outputSchema && Object.values(api.outputSchema).length > 0
              ? getCustomApiField(OUTPUT, api.outputSchema)
              : undefined,
        });
      });
    });
  }

  functors.forEach((api: FunctorApi) => {
    remoteApiList.push({
      type: EventType.FUNCTOR_API,
      value: api.displayName,
      invokeApiName: api.invokeApiName,
      requestId: api.displayName,
      functorId: api.uniqueId,
      operation: api.type.toLocaleLowerCase() as 'query' | 'mutation',
      input:
        api.inputSchema && Object.values(api.inputSchema).length > 0
          ? getCustomApiField(INPUT, api.inputSchema)
          : undefined,
      output:
        api.outputSchema && Object.values(api.outputSchema).length > 0
          ? getCustomApiField(OUTPUT, api.outputSchema)
          : undefined,
    });
  });

  subsystemRecords.forEach((subSystem: SubsystemFragment) => {
    subSystem.functors.forEach((api) => {
      remoteApiList.push({
        type: EventType.FUNCTOR_API,
        value: api.displayName,
        invokeApiName: api.invokeApiName,
        requestId: api.displayName,
        functorId: `${subSystem.exId ?? ''}`,
        operation: api.type.toLocaleLowerCase() as 'query' | 'mutation',
        input:
          api.inputSchema && Object.values(api.inputSchema).length > 0
            ? getCustomApiField(INPUT, api.inputSchema)
            : undefined,
        output:
          api.outputSchema && Object.values(api.outputSchema).length > 0
            ? getCustomApiField(OUTPUT, api.outputSchema)
            : undefined,
      });
    });
  });

  function getCustomRequestField(type: string): CustomRequestField | undefined {
    return allCustomRequestFields.find((e) => e.type === type);
  }

  return {
    customQueries: remoteApiList.filter((e) => e.operation === 'query'),
    customThirdPartyMutations: remoteApiList.filter(
      (e) => e.operation === 'mutation' && e.type === EventType.THIRD_PARTY_API
    ),
    customFunctorMutations: remoteApiList.filter(
      (e) => e.operation === 'mutation' && e.type === EventType.FUNCTOR_API
    ),
    getCustomRequestField,
    resolveCustomQueries,
  };
}
