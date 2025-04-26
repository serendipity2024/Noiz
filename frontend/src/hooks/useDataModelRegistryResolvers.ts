/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { Field } from '../shared/type-definition/DataModelRegistry';
import BaseContainerModel from '../models/base/BaseContainerModel';
import {
  PAGE_DATA_PATH,
  REMOTE_DATA_PATH,
  Variable,
  VariableTable,
} from '../shared/type-definition/DataBinding';
import { ARRAY_TYPE } from '../shared/type-definition/DataModel';
import { ShortId } from '../shared/type-definition/ZTypes';
import useDataModelMetadata from './useDataModelMetadata';
import useStores from './useStores';
import BasicMobileModel from '../models/basic-components/BasicMobileModel';
import StoreHelpers from '../mobx/StoreHelpers';
import BaseComponentModel from '../models/base/BaseComponentModel';

export default function useDataModelRegistryResolvers(): {
  resolveAllVariables: (mRef: ShortId) => {
    variables: Record<string, Variable>;
    queryVariables: Record<string, Variable>;
    localVariables: Record<string, Variable>;
    itemVariables: Record<string, Variable>;
    pageVariables: Record<string, Variable>;
    componentInputVariables: Record<string, Variable>;
    componentOutputVariables: Record<string, Variable>;
  };
} {
  const { dataModelRegistry } = useDataModelMetadata();
  const { coreStore } = useStores();
  const getModel = (mRef: ShortId) => coreStore.getModel(mRef);

  const resolveAllVariables = (
    mRef: ShortId
  ): {
    variables: Record<string, Variable>;
    queryVariables: Record<string, Variable>;
    localVariables: Record<string, Variable>;
    itemVariables: Record<string, Variable>;
    pageVariables: Record<string, Variable>;
    componentInputVariables: Record<string, Variable>;
    componentOutputVariables: Record<string, Variable>;
  } => {
    if (!getModel(mRef)) {
      return {
        variables: {},
        queryVariables: {},
        localVariables: {},
        itemVariables: {},
        pageVariables: {},
        componentInputVariables: {},
        componentOutputVariables: {},
      };
    }

    const variables: Record<string, Variable> = {};
    const itemVariables: Record<string, Variable> = {};
    const localVariables: Record<string, Variable> = {};
    const queryVariables: Record<string, Variable> = {};
    const pageVariables: Record<string, Variable> = {};
    const componentInputVariables: Record<string, Variable> = {};
    const componentOutputVariables: Record<string, Variable> = {};

    for (let m = getModel(mRef); m; m = getModel(m.parentMRef)) {
      const containerModel = m as BaseContainerModel;

      // variable
      Object.assign(variables, m.variableTable);

      // local variable
      if (Object.values(m.localVariableTable).length > 0) {
        localVariables[m.mRef] = {
          type: '',
          args: m.localVariableTable,
        };
      }

      // page variable
      if (m.isRootContainer) {
        Object.assign(pageVariables, (m as BasicMobileModel)?.pageVariableTable ?? {});
      }

      // component input variable
      if ((m.inputDataSource ?? []).length > 0) {
        componentInputVariables[m.mRef] = {
          type: '',
          args: Object.fromEntries(
            (m.inputDataSource ?? []).map((ods) => [ods.name, ods.variable])
          ),
        };
      }

      // item variable
      if (m.isContainer && m.mRef !== mRef) {
        const dataPathComponents = containerModel.dataPathComponents ?? [];
        Object.values(containerModel.itemVariableTable ?? {})
          .filter((variable) => (variable.pathComponents ?? []).length <= 0)
          .forEach((variable) => {
            variable.pathComponents =
              dataPathComponents.length > 0 ? [PAGE_DATA_PATH] : [REMOTE_DATA_PATH];
          });
        Object.assign(itemVariables, containerModel.itemVariableTable);
      }

      // query variable
      const queries = containerModel?.queries ?? [];
      if (queries.length > 0) {
        const rootQuery: Record<string, Field> = {};
        dataModelRegistry.getQueries().forEach((element: Field) => {
          const type = element.type === ARRAY_TYPE ? `${element.itemType}[]` : element.type;
          rootQuery[type] = element;
        });
        const queryVariableTable = {} as VariableTable;
        queries.forEach((element) => {
          queryVariableTable[element.requestId] = rootQuery[element.rootFieldType] as Variable;
        });
        Object.assign(queryVariables, queryVariableTable);
      }
    }

    // component output variable
    const model = StoreHelpers.findComponentModelOrThrow(mRef);
    const rootModel = StoreHelpers.fetchRootModel(model);
    if (rootModel) {
      const models = StoreHelpers.findAllModelsWithLogicInContainer({
        container: rootModel,
        filter: (componentModel: BaseComponentModel) =>
          (componentModel.outputDataSource ?? []).length > 0,
      }) as BaseComponentModel[];
      models.forEach((m) => {
        componentOutputVariables[m.mRef] = {
          type: '',
          args: Object.fromEntries(
            (m.outputDataSource ?? []).map((ods) => [ods.name, ods.variable])
          ),
        };
      });
    }

    return {
      variables,
      queryVariables,
      localVariables,
      itemVariables,
      pageVariables,
      componentInputVariables,
      componentOutputVariables,
    };
  };

  return {
    resolveAllVariables,
  };
}
