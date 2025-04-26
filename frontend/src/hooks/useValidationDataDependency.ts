import { AllStores } from '../mobx/StoreContexts';
import {
  ComponentDependency,
  DataDependency,
  DataDependencyType,
  GlobalDataDependency,
  ListVariableDataDependency,
  RemoteDataDependency,
  ValidationResult,
  VALIDATION_ENCODING_DELIMITER,
  ScreenVariableDataDependency,
  ComponentVariableDataDependency,
  defaultValidationResult,
} from '../mobx/stores/ValidationStore';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { ComponentInputOutputData } from '../models/interfaces/ComponentModel';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import { Variable } from '../shared/type-definition/DataBinding';
import { Diff, DiffPathComponent } from '../shared/type-definition/Diff';
import {
  CustomRequestBinding,
  GraphQLRequestBinding,
} from '../shared/type-definition/EventBinding';
import useRetraceDataDependency from './useRetraceDataDependency';
import { FeatureType } from '../graphQL/__generated__/globalTypes';

enum ValidatePath {
  DELETE_MREF_MAP = 'delete/mRefMap/true',
  DELETE_MREF_MAP_ITEM_VARIABLE_TABLE = 'delete/mRefMap/true/itemVariableTable/true',
  DELETE_DATA_MODEL_TABLE = 'delete/dataModel/tableMetadata/true',
  UPDATE_MREF_MAP_QUERIES = 'update/mRefMap/true/queries',
  UPDATE_MREF_MAP_THIRD_PARTY_QUERIES = 'update/mRefMap/true/thirdPartyQueries',
  UPDATE_MREF_MAP_VARIABLE_TABLE = 'update/mRefMap/true/variableTable',
  UPDATE_MREF_MAP_PAGE_VARIABLE_TABLE = 'update/mRefMap/true/pageVariableTable',
  UPDATE_MREF_MAP_INPUT_DATA_SOURCE = 'update/mRefMap/true/inputDataSource',
  UPDATE_MREF_MAP_OUTPUT_DATA_SOURCE = 'update/mRefMap/true/outputDataSource',
  UPDATE_MREF_MAP_DATA_ATTRIBUTES_MODE = 'update/mRefMap/true/dataAttributes/mode',
  UPDATE_MREF_MAP_DATA_ATTRIBUTES_MULTIPLE = 'update/mRefMap/true/dataAttributes/multiple',
  UPDATE_MREF_MAP_DATA_ATTRIBUTES_SOURCE_TYPE = 'update/mRefMap/true/dataAttributes/sourceType',
  UPDATE_MREF_MAP_DATA_ATTRIBUTES_VALUE_TYPE = 'update/mRefMap/true/dataAttributes/valueType',
  UPDATE_GLOBAL_VARIABLE_TABLE = 'delete/wechatConfiguration/globalVariableTable/true',
}

export const useValidationDataDependency = (): {
  validateDiff: (diff: Diff) => ValidationResult;
} => {
  const { coreStore, validationStore, typeSystemStore, featureStore } = AllStores;
  const {
    retraceRemoteDataDependencies,
    retraceGlobalDataDependencies,
    retracePageDataDependencies,
    retraceLinkDataDependencies,
    retraceListDataDependencies,
    retraceComponentDataDependencies,
    retraceComponentInputDataDependencies,
    retraceComponentOutputDataDependencies,
  } = useRetraceDataDependency();

  const validatePathMatches = (pathComponents: DiffPathComponent[]): string | undefined => {
    function pathMatches(path: DiffPathComponent[], validatePath: string): boolean {
      const pattern: string[] = validatePath.split('/');
      if (path.length !== pattern.length) return false;
      for (let i = 0; i < pattern.length; ++i) {
        if (pattern[i] !== 'true' && path[i].key !== pattern[i]) return false;
      }
      return true;
    }
    if (pathComponents.length < 1) return undefined;
    const validatePathList: string[] = Object.values(ValidatePath);
    for (let i = 0; i < validatePathList.length; ++i) {
      const validatePath = validatePathList[i];
      if (pathMatches(pathComponents, validatePath)) {
        return validatePath;
      }
    }
    return undefined;
  };

  const validateDiff = (diff: Diff): ValidationResult => {
    const result = validateDataDependencies(diff);
    if (featureStore.isFeatureAccessible(FeatureType.DATA_MODEL_DELETE)) {
      const typeSystemValidationMessages = typeSystemStore.genIncrementalErrors(diff);
      if (typeSystemValidationMessages.length > 0) {
        result.typeSystemValidationMessages = typeSystemValidationMessages;
        result.successful = false;
      }
    }
    return result;
  };

  const validateDataDependencies = (diff: Diff): ValidationResult => {
    for (let index = 0; index < diff.dataSource.length; index++) {
      const diffItem = diff.dataSource[index];
      const validatePath: string | undefined = validatePathMatches([
        { key: diffItem.operation },
        ...diffItem.pathComponents,
      ]);
      if (!validatePath) {
        continue;
      }
      switch (validatePath) {
        case ValidatePath.DELETE_MREF_MAP: {
          const model = diffItem.oldValue;
          if (!model) throw new Error('diff中引用的组件丢失');
          const validationResult = validateComponentDataDependencies(model);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.DELETE_MREF_MAP_ITEM_VARIABLE_TABLE: {
          const model = getComponentModel(diffItem.pathComponents);
          const oldRequestId = diffItem.pathComponents[diffItem.pathComponents.length - 1]?.key;
          const validationResult = validateListDataDependencies(model, oldRequestId);
          if (!validationResult.successful) return validationResult;

          if (
            model.type === ComponentModelType.DATA_PICKER ||
            model.type === ComponentModelType.SELECT_VIEW
          ) {
            const componentDataDependenciesValidationResult =
              validateComponentDataDependencies(model);
            if (!componentDataDependenciesValidationResult.successful)
              return componentDataDependenciesValidationResult;
          }
          break;
        }
        case ValidatePath.DELETE_DATA_MODEL_TABLE: {
          const tableName = diffItem.oldValue.name;
          const validationResult = validateDataModelTable(tableName);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_GLOBAL_VARIABLE_TABLE: {
          const variableName = diffItem.pathComponents[diffItem.pathComponents.length - 1]?.key;
          const validationResult = validateGlobalDataDependencies(variableName);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_QUERIES: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateRemoteDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_THIRD_PARTY_QUERIES: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateCustomRequestDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_VARIABLE_TABLE: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateLinkDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_PAGE_VARIABLE_TABLE: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validatePageDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_INPUT_DATA_SOURCE: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateInputVariableDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_OUTPUT_DATA_SOURCE: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateOutputVariableDataDependencies(model, diffItem.oldValue);
          if (!validationResult.successful) return validationResult;
          break;
        }
        case ValidatePath.UPDATE_MREF_MAP_DATA_ATTRIBUTES_MODE:
        case ValidatePath.UPDATE_MREF_MAP_DATA_ATTRIBUTES_MULTIPLE:
        case ValidatePath.UPDATE_MREF_MAP_DATA_ATTRIBUTES_SOURCE_TYPE:
        case ValidatePath.UPDATE_MREF_MAP_DATA_ATTRIBUTES_VALUE_TYPE: {
          const model = getComponentModel(diffItem.pathComponents);
          const validationResult = validateComponentDataDependencies(model);
          if (!validationResult.successful) return validationResult;
          break;
        }
        default:
          break;
      }
    }
    return defaultValidationResult();
  };

  const validateListDataDependencies = (
    model: BaseComponentModel,
    requestId: string | undefined
  ): ValidationResult => {
    if (!requestId) return defaultValidationResult();
    const dependentPc = [model.mRef, DataDependencyType.ITEM_VARIABLE_TABLE, requestId].join(
      VALIDATION_ENCODING_DELIMITER
    );
    const dataDependencies: DataDependency[] = getDataDependencies(dependentPc);
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceListDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.ITEM_VARIABLE_TABLE
      ) as ListVariableDataDependency[]
    );
    return retraceResult;
  };

  const validateCustomRequestDataDependencies = (
    model: BaseComponentModel,
    customRequestList: CustomRequestBinding[]
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    customRequestList.forEach((query) => {
      const dependentPc = [
        model.mRef,
        DataDependencyType.THIRD_PARTY_QUERIES,
        query.requestId,
      ].join(VALIDATION_ENCODING_DELIMITER);
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceRemoteDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.THIRD_PARTY_QUERIES
      ) as RemoteDataDependency[]
    );
    return retraceResult;
  };

  const validateRemoteDataDependencies = (
    model: BaseComponentModel,
    remoteList: GraphQLRequestBinding[]
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    remoteList.forEach((query) => {
      const dependentPc = [model.mRef, DataDependencyType.QUERIES, query.requestId].join(
        VALIDATION_ENCODING_DELIMITER
      );
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceRemoteDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.QUERIES
      ) as RemoteDataDependency[]
    );
    return retraceResult;
  };

  const validatePageDataDependencies = (
    model: BaseComponentModel,
    variableTable: Record<string, Variable>
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    Object.keys(variableTable).forEach((name) => {
      const dependentPc = [model.mRef, DataDependencyType.PAGE_VARIABLE_TABLE, name].join(
        VALIDATION_ENCODING_DELIMITER
      );
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retracePageDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.PAGE_VARIABLE_TABLE
      ) as ScreenVariableDataDependency[]
    );
    return retraceResult;
  };

  const validateLinkDataDependencies = (
    model: BaseComponentModel,
    variableTable: Record<string, Variable>
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    Object.keys(variableTable).forEach((name) => {
      const dependentPc = [model.mRef, DataDependencyType.VARIABLE_TABLE, name].join(
        VALIDATION_ENCODING_DELIMITER
      );
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceLinkDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.VARIABLE_TABLE
      ) as ScreenVariableDataDependency[]
    );
    return retraceResult;
  };

  const validateInputVariableDataDependencies = (
    model: BaseComponentModel,
    inputDataSource?: ComponentInputOutputData[]
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    (inputDataSource ?? []).forEach((ods) => {
      const dependentPc = [model.mRef, DataDependencyType.SHARED_COMPONENT_INPUT, ods.name].join(
        VALIDATION_ENCODING_DELIMITER
      );
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceComponentInputDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.SHARED_COMPONENT_INPUT
      ) as ComponentVariableDataDependency[]
    );
    return retraceResult;
  };

  const validateOutputVariableDataDependencies = (
    model: BaseComponentModel,
    outputDataSource?: ComponentInputOutputData[]
  ): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    (outputDataSource ?? []).forEach((ods) => {
      const dependentPc = [model.mRef, DataDependencyType.SHARED_COMPONENT_OUTPUT, ods.name].join(
        VALIDATION_ENCODING_DELIMITER
      );
      getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    });
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceComponentOutputDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.SHARED_COMPONENT_OUTPUT
      ) as ComponentVariableDataDependency[]
    );
    return retraceResult;
  };

  const validateDataModelTable = (tableName: string): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    const dependentPc = [DataDependencyType.DATA_MODEL_TABLE, tableName].join(
      VALIDATION_ENCODING_DELIMITER
    );
    getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    if (dataDependencies.length <= 0) return defaultValidationResult();
    return { successful: false, dataDependencies, typeSystemValidationMessages: [] };
  };

  const validateComponentDataDependencies = (model: BaseComponentModel): ValidationResult => {
    const dataDependencies: DataDependency[] = [];
    const dependentPc = [model.mRef, DataDependencyType.COMPONENT, model.mRef].join(
      VALIDATION_ENCODING_DELIMITER
    );
    getDataDependencies(dependentPc).forEach((dd) => dataDependencies.push(dd));
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceComponentDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.COMPONENT
      ) as ComponentDependency[]
    );
    return retraceResult;
  };

  const validateGlobalDataDependencies = (variableName: string | undefined): ValidationResult => {
    const dependentPc = [DataDependencyType.GLOBAL_VARIABLE_TABLE, variableName].join(
      VALIDATION_ENCODING_DELIMITER
    );
    const dataDependencies: DataDependency[] = getDataDependencies(dependentPc);
    if (dataDependencies.length <= 0) return defaultValidationResult();

    const retraceResult = retraceGlobalDataDependencies(
      dataDependencies.filter(
        (dd) => dd.dependencyType === DataDependencyType.GLOBAL_VARIABLE_TABLE
      ) as GlobalDataDependency[]
    );
    return retraceResult;
  };

  const getDataDependencies = (dependentPc: string) => {
    const dataDependencies: DataDependency[] = [];
    const dependent = validationStore.dataDependencyRecord[dependentPc] ?? {};
    Object.values(dependent).forEach((value) => {
      value.forEach((dd) => dataDependencies.push(dd));
    });
    return dataDependencies;
  };

  const getComponentModel = (pathComponents: DiffPathComponent[]): BaseComponentModel => {
    const mRef = pathComponents[1].key;
    if (!mRef) throw new Error('diff中引用的组件丢失');
    const model = coreStore.getModel(mRef);
    if (!model) throw new Error('diff中引用的组件丢失');
    return model;
  };

  return {
    validateDiff,
  };
};
