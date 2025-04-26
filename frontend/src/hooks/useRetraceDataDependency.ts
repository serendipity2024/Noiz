/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-default-export */
/* eslint-disable no-loop-func */
import { GraphQLModel } from '../shared/type-definition/DataModelRegistry';
import { AllStores } from '../mobx/StoreContexts';
import {
  ScreenVariableDataDependency,
  RemoteDataDependency,
  ListVariableDataDependency,
  ComponentDependency,
  ValidationResult,
  GlobalDataDependency,
  DataDependencyType,
  ComponentVariableDataDependency,
  defaultValidationResult,
} from '../mobx/stores/ValidationStore';
import BaseContainerModel from '../models/base/BaseContainerModel';
import BasicMobileModel from '../models/basic-components/BasicMobileModel';
import DataPickerModel from '../models/mobile-components/DataPickerModel';
import InputModel from '../models/mobile-components/InputModel';
import SelectViewModel from '../models/mobile-components/SelectViewModel';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import {
  AGGREGATE,
  ComponentBinding,
  COMPONENT_INPUT_DATA,
  COMPONENT_OUTPUT_DATA,
  DataBindingKind,
  PathComponent,
  ValueBinding,
  Variable,
} from '../shared/type-definition/DataBinding';
import { ARRAY_TYPE, ColumnType, ColumnTypes } from '../shared/type-definition/DataModel';
import {
  CustomRequestBinding,
  fetchFieldItemType,
  GraphQLRequestBinding,
} from '../shared/type-definition/EventBinding';
import { useConfiguration } from './useConfiguration';
import useCustomRequestRegistry from './useCustomRequestRegistry';
import useDataModelMetadata from './useDataModelMetadata';

export default function useRetraceDataDependency(): {
  retraceRemoteDataDependencies: (dataSource: RemoteDataDependency[]) => ValidationResult;
  retraceGlobalDataDependencies: (dataSource: GlobalDataDependency[]) => ValidationResult;
  retracePageDataDependencies: (dataSource: ScreenVariableDataDependency[]) => ValidationResult;
  retraceLinkDataDependencies: (dataSource: ScreenVariableDataDependency[]) => ValidationResult;
  retraceListDataDependencies: (dataSource: ListVariableDataDependency[]) => ValidationResult;
  retraceComponentDataDependencies: (dataSource: ComponentDependency[]) => ValidationResult;
  retraceComponentInputDataDependencies: (
    dataSource: ComponentVariableDataDependency[]
  ) => ValidationResult;
  retraceComponentOutputDataDependencies: (
    dataSource: ComponentVariableDataDependency[]
  ) => ValidationResult;
} {
  const { dataModelRegistry } = useDataModelMetadata();
  const { getCustomRequestField } = useCustomRequestRegistry();

  const { coreStore } = AllStores;
  const configuration = useConfiguration();

  const retraceRemoteDataDependencies = (dataSource: RemoteDataDependency[]): ValidationResult => {
    const retraceResult: ValidationResult = defaultValidationResult();
    for (let i = 0; i < dataSource.length; i++) {
      const remoteDataDependency = dataSource[i];

      const variableBinding = remoteDataDependency.relation;
      if (variableBinding.pathComponents.length <= 1) {
        retraceResult.dataDependencies.push(remoteDataDependency);
        continue;
      }

      const screenModel = coreStore.getModel(remoteDataDependency.rootMRef) as BasicMobileModel;
      if (!screenModel) {
        retraceResult.dataDependencies.push(remoteDataDependency);
        continue;
      }

      let requestRetraceSuccessful = false;
      if (remoteDataDependency.isCustomData) {
        const customRequest: CustomRequestBinding | undefined = screenModel.thirdPartyQueries.find(
          (tqy) => tqy.requestId === remoteDataDependency.requestId
        );
        if (!customRequest) {
          retraceResult.dataDependencies.push(remoteDataDependency);
          continue;
        }

        const targetPathComponent = variableBinding.pathComponents[1];
        requestRetraceSuccessful =
          targetPathComponent.name === customRequest.requestId &&
          customRequest.output?.type === targetPathComponent.type &&
          customRequest.output?.itemType === targetPathComponent.itemType;
      } else {
        const request: GraphQLRequestBinding | undefined = screenModel.queries.find(
          (qy) => qy.requestId === remoteDataDependency.requestId
        );
        if (!request) {
          retraceResult.dataDependencies.push(remoteDataDependency);
          continue;
        }

        const targetPathComponent = variableBinding.pathComponents[1];
        const rootFieldType = fetchFieldItemType(request);
        requestRetraceSuccessful =
          targetPathComponent.name === request.requestId &&
          (request.limit === 1
            ? rootFieldType === targetPathComponent.type
            : rootFieldType === targetPathComponent.itemType);
      }
      if (
        requestRetraceSuccessful &&
        !retraceVariableBinding(variableBinding.pathComponents, remoteDataDependency.isCustomData)
      ) {
        retraceResult.dataDependencies.push(remoteDataDependency);
        continue;
      }
      if (!requestRetraceSuccessful) {
        retraceResult.dataDependencies.push(remoteDataDependency);
        continue;
      }
    }
    if (retraceResult.dataDependencies.length > 0) {
      retraceResult.successful = false;
    }
    return retraceResult;
  };

  const retraceGlobalDataDependencies = (dataSource: GlobalDataDependency[]): ValidationResult => {
    return retraceVariableTableDependencies(dataSource, (dataDependency) => {
      return configuration.globalVariableTable;
    });
  };

  const retracePageDataDependencies = (
    dataSource: ScreenVariableDataDependency[]
  ): ValidationResult => {
    return retraceVariableTableDependencies(dataSource, (dataDependency) => {
      if (dataDependency.dependencyType === DataDependencyType.GLOBAL_VARIABLE_TABLE) {
        return undefined;
      }
      const screenModel = coreStore.getModel(dataDependency.rootMRef) as BasicMobileModel;
      return screenModel ? screenModel.pageVariableTable : undefined;
    });
  };

  const retraceLinkDataDependencies = (
    dataSource: ScreenVariableDataDependency[]
  ): ValidationResult => {
    return retraceVariableTableDependencies(dataSource, (dataDependency) => {
      if (dataDependency.dependencyType === DataDependencyType.GLOBAL_VARIABLE_TABLE) {
        return undefined;
      }
      const screenModel = coreStore.getModel(dataDependency.rootMRef) as BasicMobileModel;
      return screenModel ? screenModel.variableTable : undefined;
    });
  };

  const retraceListDataDependencies = (
    dataSource: ListVariableDataDependency[]
  ): ValidationResult => {
    const retraceResult: ValidationResult = defaultValidationResult();
    for (let i = 0; i < dataSource.length; i++) {
      const listDataDependency = dataSource[i];

      const variableBinding = listDataDependency.relation;
      if (variableBinding.pathComponents.length <= 1) {
        retraceResult.dataDependencies.push(listDataDependency);
        continue;
      }

      const listModel = coreStore.getModel(listDataDependency.listMRef) as BaseContainerModel;
      if (!listModel) {
        retraceResult.dataDependencies.push(listDataDependency);
        continue;
      }

      const itemVariable = listModel.itemVariableTable[listDataDependency.requestId];
      if (!itemVariable) {
        retraceResult.dataDependencies.push(listDataDependency);
        continue;
      }
    }
    if (retraceResult.dataDependencies.length > 0) {
      retraceResult.successful = false;
    }
    return retraceResult;
  };

  const retraceComponentInputDataDependencies = (
    dataSource: ComponentVariableDataDependency[]
  ): ValidationResult => {
    return retraceVariableTableDependencies(dataSource, (dataDependency) => {
      if (dataDependency.dependencyType === DataDependencyType.GLOBAL_VARIABLE_TABLE) {
        return undefined;
      }
      const componentModel = coreStore.getModel(dataDependency.rootMRef);
      return componentModel
        ? Object.fromEntries(
            (componentModel.inputDataSource ?? []).map((ids) => [ids.name, ids.variable])
          )
        : undefined;
    });
  };

  const retraceComponentOutputDataDependencies = (
    dataSource: ComponentVariableDataDependency[]
  ): ValidationResult => {
    return retraceVariableTableDependencies(dataSource, (dataDependency) => {
      if (dataDependency.dependencyType === DataDependencyType.GLOBAL_VARIABLE_TABLE) {
        return undefined;
      }
      const componentModel = coreStore.getModel(dataDependency.rootMRef);
      return componentModel
        ? Object.fromEntries(
            (componentModel.outputDataSource ?? []).map((ids) => [ids.name, ids.variable])
          )
        : undefined;
    });
  };

  const retraceComponentDataDependencies = (
    dataSource: ComponentDependency[]
  ): ValidationResult => {
    const retraceResult: ValidationResult = defaultValidationResult();
    for (let i = 0; i < dataSource.length; i++) {
      const componentDataDependency = dataSource[i];

      const componentModel = coreStore.getModel(componentDataDependency.targetMRef);
      if (!componentModel) {
        retraceResult.dataDependencies.push(componentDataDependency);
        continue;
      }

      const isValueBinding = Object.values(DataBindingKind).includes(
        (componentDataDependency.relation as ValueBinding).kind
      );
      if (isValueBinding) {
        const valueBinding = componentDataDependency.relation as ComponentBinding;
        if (valueBinding.pathComponents.length <= 1) {
          retraceResult.dataDependencies.push(componentDataDependency);
          continue;
        }
        switch (componentModel.type) {
          case ComponentModelType.INPUT: {
            const inputModel = componentModel as InputModel;
            const targetPathComponent: PathComponent = valueBinding.pathComponents[1];
            if (targetPathComponent.type !== inputModel.valueType) {
              retraceResult.dataDependencies.push(componentDataDependency);
              continue;
            }
            break;
          }
          case ComponentModelType.DATA_PICKER: {
            const dataPickerModel = componentModel as DataPickerModel;
            const targetPathComponent: PathComponent = valueBinding.pathComponents[1];
            if (targetPathComponent.type !== dataPickerModel.sourceType) {
              retraceResult.dataDependencies.push(componentDataDependency);
              continue;
            }
            break;
          }
          case ComponentModelType.SELECT_VIEW: {
            const selectViewModel = componentModel as SelectViewModel;
            const targetPathComponent: PathComponent = valueBinding.pathComponents[1];
            if (
              selectViewModel.dataAttributes.multiple &&
              targetPathComponent.type !== ARRAY_TYPE
            ) {
              retraceResult.dataDependencies.push(componentDataDependency);
              continue;
            }
            if (
              (targetPathComponent.itemType ?? targetPathComponent.type) !==
              selectViewModel.sourceType
            ) {
              retraceResult.dataDependencies.push(componentDataDependency);
              continue;
            }
            break;
          }
          default:
            break;
        }
      }
    }
    if (retraceResult.dataDependencies.length > 0) {
      retraceResult.successful = false;
    }
    return retraceResult;
  };

  const retraceVariableTableDependencies = (
    dataSource: (
      | ScreenVariableDataDependency
      | GlobalDataDependency
      | ComponentVariableDataDependency
    )[],
    getVariableTable: (
      dataDependency:
        | ScreenVariableDataDependency
        | GlobalDataDependency
        | ComponentVariableDataDependency
    ) => Record<string, Variable> | undefined
  ): ValidationResult => {
    const retraceResult: ValidationResult = defaultValidationResult();
    for (let i = 0; i < dataSource.length; i++) {
      const variableDataDependency = dataSource[i];

      const variableBinding = variableDataDependency.relation;
      if (variableBinding.pathComponents.length <= 1) {
        retraceResult.dataDependencies.push(variableDataDependency);
        continue;
      }

      let targetPathComponent: PathComponent = variableBinding.pathComponents[1];
      const kindPathComponent = variableBinding.pathComponents[0];
      if (
        kindPathComponent.name === COMPONENT_INPUT_DATA ||
        kindPathComponent.name === COMPONENT_OUTPUT_DATA
      ) {
        targetPathComponent = variableBinding.pathComponents[2];
      }
      if (!targetPathComponent) {
        retraceResult.dataDependencies.push(variableDataDependency);
        continue;
      }

      const variableTableRecord = getVariableTable(variableDataDependency);
      if (!variableTableRecord) {
        retraceResult.dataDependencies.push(variableDataDependency);
        continue;
      }
      const variableNameAndTable = Object.entries(variableTableRecord).find(
        ([name, _]) => name === variableDataDependency.dataName
      );
      if (!variableNameAndTable) {
        retraceResult.dataDependencies.push(variableDataDependency);
        continue;
      }
      const variableName = variableNameAndTable[0];
      const variableTable = variableNameAndTable[1];

      if (
        targetPathComponent.name === variableName &&
        variableTable.type === targetPathComponent.type &&
        variableTable.itemType === targetPathComponent.itemType
      ) {
        const isColumnType = ColumnTypes.includes(variableTable.type as ColumnType);
        if (!isColumnType && !retraceVariableBinding(variableBinding.pathComponents, false)) {
          retraceResult.dataDependencies.push(variableDataDependency);
          continue;
        }
      } else {
        retraceResult.dataDependencies.push(variableDataDependency);
        continue;
      }
    }
    if (retraceResult.dataDependencies.length > 0) {
      retraceResult.successful = false;
    }
    return retraceResult;
  };

  const retraceVariableBinding = (
    pathComponents: PathComponent[],
    isCustomData: boolean
  ): boolean => {
    let targetPathComponent = pathComponents[1];
    for (let k = 2; k < pathComponents.length; k++) {
      const currentPathComponent = pathComponents[k];
      if (currentPathComponent.type === AGGREGATE) {
        const objectPathComponent =
          currentPathComponent.name === 'count' ? pathComponents[k - 1] : pathComponents[k - 2];
        if (!objectPathComponent.itemType) {
          return false;
        }
      } else if (ColumnTypes.includes(currentPathComponent.type as ColumnType)) {
        return true;
      } else {
        let isExist = false;
        if (isCustomData) {
          const customRequestField = getCustomRequestField(targetPathComponent.type);
          isExist = !!customRequestField?.object?.find(
            (field) =>
              field.name === currentPathComponent.name &&
              field.type === currentPathComponent.type &&
              field.itemType === currentPathComponent.itemType
          );
        } else {
          const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(
            targetPathComponent.itemType ?? targetPathComponent.type
          );
          isExist = !!gqlModel?.fields.find(
            (field) =>
              field.name === currentPathComponent.name &&
              field.type === currentPathComponent.type &&
              field.itemType === currentPathComponent.itemType
          );
        }
        if (isExist) {
          targetPathComponent = currentPathComponent;
        } else {
          return false;
        }
      }
    }
    return true;
  };

  return {
    retraceRemoteDataDependencies,
    retraceGlobalDataDependencies,
    retracePageDataDependencies,
    retraceLinkDataDependencies,
    retraceListDataDependencies,
    retraceComponentDataDependencies,
    retraceComponentInputDataDependencies,
    retraceComponentOutputDataDependencies,
  };
}
