/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';
import { action, observable } from 'mobx';
import uniqid from 'uniqid';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import BasicMobileModel from '../../models/basic-components/BasicMobileModel';
import { EventModelBuilder } from '../../models/EventModelBuilder';
import {
  ComponentBinding,
  COMPONENT_INPUT_DATA,
  COMPONENT_OUTPUT_DATA,
  DataBinding,
  DataBindingKind,
  GLOBAL_DATA,
  LINKED_DATA,
  LOCAL_DATA,
  PAGE_DATA,
  PathComponent,
  REMOTE_DATA,
  ValueBinding,
  VariableBinding,
} from '../../shared/type-definition/DataBinding';
import { DiffPathComponent } from '../../shared/type-definition/Diff';
import {
  CustomRequestBinding,
  EventBinding,
  EventType,
  GraphQLRequestBinding,
} from '../../shared/type-definition/EventBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { isDefined } from '../../utils/utils';
import { DiffValidationMessage } from '../../utils/ZTypeSystem';
import { AllStores } from '../StoreContexts';
import StoreHelpers from '../StoreHelpers';
import { getConfiguration } from './CoreStore';

export const VALIDATION_ENCODING_DELIMITER = '!--!';

export const MREF_MAP = 'mRefMap';
const DATA_PATH_COMPONENTS = 'dataPathComponents';
const DATA_ATTRIBUTES = 'dataAttributes';

export enum DataDependencyType {
  QUERIES = 'queries',
  THIRD_PARTY_QUERIES = 'thirdPartyQueries',
  DATA_MODEL_TABLE = 'dataModelTable',
  GLOBAL_VARIABLE_TABLE = 'globalVariableTable',
  PAGE_VARIABLE_TABLE = 'pageVariableTable',
  VARIABLE_TABLE = 'variableTable',
  ITEM_VARIABLE_TABLE = 'itemVariableTable',
  SHARED_COMPONENT_INPUT = 'inputDataSource',
  SHARED_COMPONENT_OUTPUT = 'outputDataSource',
  COMPONENT = 'component',
}

export interface RemoteDataDependency {
  id: ShortId;
  dependencyType: DataDependencyType.QUERIES | DataDependencyType.THIRD_PARTY_QUERIES;
  rootMRef: string;
  requestId: string;
  diffPathComponents: DiffPathComponent[];
  relation: VariableBinding;
  isCustomData: boolean;
}

export interface TableDataDependency {
  id: ShortId;
  dependencyType: DataDependencyType.DATA_MODEL_TABLE;
  rootTable: string;
  targetMRef: string;
  diffPathComponents: DiffPathComponent[];
}

export interface ListVariableDataDependency {
  id: ShortId;
  dependencyType: DataDependencyType.ITEM_VARIABLE_TABLE;
  listMRef: string;
  requestId: string;
  diffPathComponents: DiffPathComponent[];
  relation: VariableBinding;
}

export interface ComponentDependency {
  id: ShortId;
  dependencyType: DataDependencyType.COMPONENT;
  targetMRef: string;
  diffPathComponents: DiffPathComponent[];
  relation: ComponentBinding | EventBinding | VariableBinding;
}

export interface BaseVariableDataDependency {
  id: ShortId;
  dependencyType: DataDependencyType;
  dataName: string;
  diffPathComponents: DiffPathComponent[];
  relation: VariableBinding;
}

export interface GlobalDataDependency extends BaseVariableDataDependency {
  dependencyType: DataDependencyType.GLOBAL_VARIABLE_TABLE;
}

export interface ScreenVariableDataDependency extends BaseVariableDataDependency {
  dependencyType: DataDependencyType.VARIABLE_TABLE | DataDependencyType.PAGE_VARIABLE_TABLE;
  rootMRef: string;
}

export interface ComponentVariableDataDependency extends BaseVariableDataDependency {
  dependencyType:
    | DataDependencyType.SHARED_COMPONENT_INPUT
    | DataDependencyType.SHARED_COMPONENT_OUTPUT;
  rootMRef: string;
}

export type DataDependency =
  | RemoteDataDependency
  | GlobalDataDependency
  | ScreenVariableDataDependency
  | ComponentVariableDataDependency
  | ListVariableDataDependency
  | ComponentDependency
  | TableDataDependency;

export interface ValidationResult {
  successful: boolean;
  dataDependencies: DataDependency[];
  typeSystemValidationMessages: DiffValidationMessage[];
}

export const defaultValidationResult = (): ValidationResult => {
  return {
    successful: true,
    dataDependencies: [],
    typeSystemValidationMessages: [],
  };
};

export default class ValidationStore {
  public dataDependencyRecord: Record<string, Record<string, DataDependency[]>> = {};

  @observable
  public validationResult: ValidationResult = defaultValidationResult();

  @action.bound
  public setValidationResult(retraceResult: ValidationResult): void {
    this.validationResult = retraceResult;
  }

  @action.bound
  public clearValidationResult(): void {
    this.setValidationResult(defaultValidationResult());
  }

  public rehydrate(): void {
    Object.values(AllStores.coreStore.mRefMap).forEach((componentModel) => {
      const diffPathComponents: DiffPathComponent[] = [
        { key: MREF_MAP },
        { key: componentModel.mRef },
      ];
      this.addDataDependency(diffPathComponents, componentModel);
    });
  }

  public updateDataDependency(
    diffPathComponents: DiffPathComponent[],
    oldValue: any,
    newValue: any
  ): void {
    this.deleteDataDependency(diffPathComponents, oldValue);
    this.addDataDependency(diffPathComponents, newValue);
  }

  private addDataDependency(diffPathComponents: DiffPathComponent[], data: any) {
    const dataDependencies = this.getAllDataDependencyList(diffPathComponents, data);
    if (dataDependencies.length <= 0) return;

    dataDependencies.forEach((dataDependency) => {
      const dependentPc = this.getDataDependencyPc(dataDependency);
      const diffPc = dataDependency.diffPathComponents
        .map((pc) => pc.key ?? pc.index)
        .join(VALIDATION_ENCODING_DELIMITER);
      if (this.dataDependencyRecord[dependentPc]) {
        const dependentRecord = this.dataDependencyRecord[dependentPc];
        dependentRecord[diffPc] = [...(dependentRecord[diffPc] ?? []), dataDependency];
      } else {
        this.dataDependencyRecord[dependentPc] = {};
        this.dataDependencyRecord[dependentPc][diffPc] = [dataDependency];
      }
    });
  }

  private deleteDataDependency(diffPathComponents: DiffPathComponent[], data: any) {
    const remoteDataList = this.getAllDataDependencyList(diffPathComponents, data);
    if (remoteDataList.length <= 0) return;

    remoteDataList.forEach((remoteDataDependency) => {
      const dependentPc = this.getDataDependencyPc(remoteDataDependency);
      const diffPc = remoteDataDependency.diffPathComponents
        .map((pc) => pc.key ?? pc.index)
        .join(VALIDATION_ENCODING_DELIMITER);
      if (
        this.dataDependencyRecord[dependentPc] &&
        this.dataDependencyRecord[dependentPc][diffPc]
      ) {
        delete this.dataDependencyRecord[dependentPc][diffPc];
        if (Object.keys(this.dataDependencyRecord[dependentPc]).length <= 0) {
          delete this.dataDependencyRecord[dependentPc];
        }
      }
    });
  }

  public getAllDataDependencyList(
    diffPathComponents: DiffPathComponent[],
    data: any
  ): DataDependency[] {
    if (!data) return [];
    const componentModel = this.fetchComponentModel(diffPathComponents, data);
    if (!componentModel) return [];
    return this.getDataDependencyList(diffPathComponents, data, componentModel);
  }

  private getDataDependencyList(
    diffPathComponents: DiffPathComponent[],
    data: any,
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependencies: DataDependency[] = [];
    if (data instanceof Array) {
      if (this.isSameComponentPropertyPathComponents(diffPathComponents, DATA_PATH_COMPONENTS)) {
        this.getVariableBindingDependency(
          diffPathComponents,
          {
            kind: DataBindingKind.VARIABLE,
            pathComponents: data,
          },
          componentModel
        ).forEach((dv) => dataDependencies.push(dv));
      } else {
        data.forEach((item) => {
          if (item) {
            this.getDataDependencyList(diffPathComponents, item, componentModel).forEach((dd) =>
              dataDependencies.push(dd)
            );
          }
        });
      }
    } else if (data instanceof Object) {
      const isEventBinding = Object.values(EventType).includes(data.type);
      if (isEventBinding) {
        this.getEventBindingDependency(data, diffPathComponents, componentModel).forEach((dd) =>
          dataDependencies.push(dd)
        );
      }
      const isDataBinding = !!DataBinding.isDataBinding(data);
      if (isDataBinding) {
        if (data.valueBinding instanceof Array) {
          data.valueBinding.forEach((item: ValueBinding) => {
            this.getValueBindingDependency(item, diffPathComponents, componentModel).forEach((dd) =>
              dataDependencies.push(dd)
            );
          });
        } else if (data.valueBinding instanceof Object) {
          this.getValueBindingDependency(
            data.valueBinding,
            diffPathComponents,
            componentModel
          ).forEach((dd) => dataDependencies.push(dd));
        }
      }
      Object.entries(data).forEach(([key, item]) => {
        if (item) {
          const currentPathComponents = _.cloneDeep(diffPathComponents);
          if (data?.mRef === componentModel.mRef) {
            currentPathComponents.push({
              key,
            });
          }
          if (this.isSameComponentPropertyPathComponents(diffPathComponents, DATA_ATTRIBUTES)) {
            currentPathComponents.push({
              key,
            });
          }
          this.getDataDependencyList(currentPathComponents, item, componentModel).forEach((dd) =>
            dataDependencies.push(dd)
          );
        }
      });
    }
    return dataDependencies;
  }

  private isSameComponentPropertyPathComponents(
    diffPathComponents: DiffPathComponent[],
    targetKey: string
  ): boolean {
    return (
      diffPathComponents.length === 3 &&
      diffPathComponents[0].key === MREF_MAP &&
      diffPathComponents[2].key === targetKey
    );
  }

  private getEventBindingDependency(
    eventBinding: EventBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    if (eventBinding.type === EventType.QUERY || eventBinding.type === EventType.SUBSCRIPTION) {
      return [];
    }

    const eventModel = EventModelBuilder.getByType(eventBinding.type);
    return eventModel.getDependentList(eventBinding, diffPathComponents, componentModel);
  }

  private getValueBindingDependency(
    valueBinding: ValueBinding,
    diffPathComponents: DiffPathComponent[],
    componentModel: BaseComponentModel
  ): DataDependency[] {
    const dataDependencies: DataDependency[] = [];
    switch (valueBinding.kind) {
      case DataBindingKind.VARIABLE: {
        this.getVariableBindingDependency(
          diffPathComponents,
          valueBinding as VariableBinding,
          componentModel
        ).forEach((dv) => dataDependencies.push(dv));
        break;
      }
      case DataBindingKind.INPUT:
      case DataBindingKind.SELECTION: {
        const dataDependency = this.getComponentBindingDependency(
          diffPathComponents,
          valueBinding as ComponentBinding
        );
        if (dataDependency) {
          dataDependencies.push(dataDependency);
        }
        break;
      }
      case DataBindingKind.CONDITIONAL:
      case DataBindingKind.FORMULA:
      case DataBindingKind.JSON:
      case DataBindingKind.LIST: {
        this.getDataDependencyList(diffPathComponents, valueBinding, componentModel).forEach((dd) =>
          dataDependencies.push(dd)
        );
        break;
      }
      default:
        break;
    }
    return dataDependencies;
  }

  private getComponentBindingDependency(
    diffPathComponents: DiffPathComponent[],
    componentBinding: ComponentBinding
  ): DataDependency | undefined {
    if (componentBinding.pathComponents?.length <= 1) return undefined;
    return {
      id: uniqid.process(),
      dependencyType: DataDependencyType.COMPONENT,
      targetMRef: componentBinding.value,
      diffPathComponents,
      relation: componentBinding,
    };
  }

  private getVariableBindingDependency(
    diffPathComponents: DiffPathComponent[],
    variableBinding: VariableBinding,
    componentModel: BaseComponentModel
  ): DataDependency[] {
    if (variableBinding.pathComponents?.length <= 1) return [];

    const rootModel = StoreHelpers.fetchRootModel(componentModel);
    if (!rootModel) return [];

    const kindPathComponent = variableBinding.pathComponents[0];
    const targetPathComponent = variableBinding.pathComponents[1];
    const listPathComponent = _.cloneDeep(variableBinding.pathComponents)
      .reverse()
      .find((pc) => pc.type && pc.type.endsWith('[]'));

    if (listPathComponent) {
      const requestId = listPathComponent.name;
      const listComponentFilter = (model: BaseComponentModel): boolean => {
        return (
          model.isContainer &&
          model.isList &&
          !!(model as BaseContainerModel).itemVariableTable[requestId]
        );
      };
      const containerModels: BaseComponentModel[] = [];
      if (listComponentFilter(rootModel)) {
        containerModels.push(rootModel);
      }
      this.findAllModelsWithLogicInContainer({
        container: rootModel,
        filter: listComponentFilter,
      }).forEach((m) => containerModels.push(m));
      if (containerModels.length !== 1) return [];
      const listModel = containerModels[0];
      return [
        {
          id: uniqid.process(),
          dependencyType: DataDependencyType.ITEM_VARIABLE_TABLE,
          listMRef: listModel.mRef,
          requestId,
          relation: variableBinding,
          diffPathComponents,
        },
      ];
    }

    switch (kindPathComponent.name) {
      case REMOTE_DATA: {
        if (!rootModel.isRootContainer) return [];
        const screenModel = rootModel as BasicMobileModel;
        const request: GraphQLRequestBinding | undefined = screenModel.queries.find(
          (qy) => qy.requestId === targetPathComponent.name
        );
        const customRequest: CustomRequestBinding | undefined = screenModel.thirdPartyQueries.find(
          (tqy) => tqy.requestId === targetPathComponent.name
        );
        if (!request && !customRequest) return [];
        return [
          {
            id: uniqid.process(),
            dependencyType: customRequest
              ? DataDependencyType.THIRD_PARTY_QUERIES
              : DataDependencyType.QUERIES,
            rootMRef: screenModel.mRef,
            requestId: customRequest?.requestId ?? request?.requestId ?? '',
            relation: variableBinding,
            diffPathComponents,
            isCustomData: !!customRequest,
          },
        ];
      }
      case PAGE_DATA: {
        if (!rootModel.isRootContainer) return [];
        const screenModel = rootModel as BasicMobileModel;
        const variableTable = screenModel.pageVariableTable[targetPathComponent.name];
        if (!variableTable) return [];
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.PAGE_VARIABLE_TABLE,
            rootMRef: screenModel.mRef,
            dataName: targetPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
        ];
      }
      case COMPONENT_INPUT_DATA: {
        const inputDataPathComponent = variableBinding.pathComponents[2];
        if (!inputDataPathComponent) return [];
        const currentComponentModel = this.fetchModelWithLogicInParent({
          component: componentModel,
          filter: (model: BaseComponentModel): boolean => {
            return !!(model.inputDataSource ?? []).find(
              (ods) => ods.name === inputDataPathComponent.name
            );
          },
        });
        if (!currentComponentModel) {
          throw new Error(
            `${COMPONENT_INPUT_DATA} error, not find component, ${JSON.stringify(variableBinding)}`
          );
        }
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.SHARED_COMPONENT_INPUT,
            rootMRef: targetPathComponent.name,
            dataName: inputDataPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
        ];
      }
      case COMPONENT_OUTPUT_DATA: {
        const outputDataPathComponent = variableBinding.pathComponents[2];
        if (!outputDataPathComponent) return [];
        const currentComponentModel = this.findAllModelsWithLogicInContainer({
          container: rootModel,
          filter: (model: BaseComponentModel): boolean => {
            return !!(model.outputDataSource ?? []).find(
              (ods) => ods.name === outputDataPathComponent.name
            );
          },
        });
        if (!currentComponentModel) {
          throw new Error(
            `${COMPONENT_OUTPUT_DATA} error, not find component, ${JSON.stringify(variableBinding)}`
          );
        }
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.SHARED_COMPONENT_OUTPUT,
            rootMRef: targetPathComponent.name,
            dataName: outputDataPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.COMPONENT,
            targetMRef: targetPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
        ];
      }
      case LINKED_DATA: {
        if (!rootModel.isRootContainer) return [];
        const screenModel = rootModel as BasicMobileModel;
        const variableTable = screenModel.variableTable[targetPathComponent.name];
        if (!variableTable) return [];
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.VARIABLE_TABLE,
            rootMRef: screenModel.mRef,
            dataName: targetPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
        ];
      }
      case GLOBAL_DATA: {
        const { globalVariableTable } = getConfiguration();
        const variableTable = globalVariableTable[targetPathComponent.name];
        if (!variableTable) return [];
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.GLOBAL_VARIABLE_TABLE,
            dataName: targetPathComponent.name,
            relation: variableBinding,
            diffPathComponents,
          },
        ];
      }
      case LOCAL_DATA: {
        return [
          {
            id: uniqid.process(),
            dependencyType: DataDependencyType.COMPONENT,
            targetMRef: targetPathComponent.name,
            diffPathComponents,
            relation: variableBinding,
          },
        ];
      }
      default:
        return [];
    }
  }

  private getDataDependencyPc(dataDependency: DataDependency): string {
    let name: string | undefined;
    let targetMRef: string | undefined;
    switch (dataDependency.dependencyType) {
      case DataDependencyType.QUERIES:
      case DataDependencyType.THIRD_PARTY_QUERIES: {
        name = (dataDependency as RemoteDataDependency).requestId;
        break;
      }
      case DataDependencyType.DATA_MODEL_TABLE: {
        name = (dataDependency as TableDataDependency).rootTable;
        break;
      }
      case DataDependencyType.GLOBAL_VARIABLE_TABLE:
      case DataDependencyType.PAGE_VARIABLE_TABLE:
      case DataDependencyType.VARIABLE_TABLE:
      case DataDependencyType.SHARED_COMPONENT_INPUT:
      case DataDependencyType.SHARED_COMPONENT_OUTPUT: {
        name = (dataDependency as BaseVariableDataDependency).dataName;
        break;
      }
      case DataDependencyType.ITEM_VARIABLE_TABLE: {
        name = (dataDependency as ListVariableDataDependency).requestId;
        break;
      }
      case DataDependencyType.COMPONENT: {
        name = (dataDependency as ComponentDependency).targetMRef;
        break;
      }
      default:
        throw new Error(`unsupported dataDependencyType, ${JSON.stringify(dataDependency)}`);
    }
    switch (dataDependency.dependencyType) {
      case DataDependencyType.QUERIES:
      case DataDependencyType.THIRD_PARTY_QUERIES:
      case DataDependencyType.PAGE_VARIABLE_TABLE:
      case DataDependencyType.VARIABLE_TABLE:
      case DataDependencyType.SHARED_COMPONENT_INPUT:
      case DataDependencyType.SHARED_COMPONENT_OUTPUT: {
        targetMRef = (dataDependency as RemoteDataDependency).rootMRef;
        break;
      }
      case DataDependencyType.ITEM_VARIABLE_TABLE: {
        targetMRef = (dataDependency as ListVariableDataDependency).listMRef;
        break;
      }
      case DataDependencyType.COMPONENT: {
        targetMRef = (dataDependency as ComponentDependency).targetMRef;
        break;
      }
      case DataDependencyType.DATA_MODEL_TABLE:
      case DataDependencyType.GLOBAL_VARIABLE_TABLE: {
        targetMRef = undefined;
        break;
      }
      default:
        throw new Error(`unsupported dataDependencyType, ${JSON.stringify(dataDependency)}`);
    }
    return [targetMRef, dataDependency.dependencyType, name]
      .filter(isDefined)
      .join(VALIDATION_ENCODING_DELIMITER);
  }

  private fetchComponentModel(
    diffPathComponents: DiffPathComponent[],
    data: any
  ): BaseComponentModel | undefined {
    if (diffPathComponents.length >= 2 && diffPathComponents[0].key === MREF_MAP) {
      const mRef = diffPathComponents[1].key;
      if (!mRef) return undefined;
      const componentModel = data?.mRef === mRef ? data : AllStores.coreStore.getModel(mRef);
      return componentModel;
    }
    return undefined;
  }

  private fetchModelWithLogicInParent(param: {
    component?: BaseComponentModel;
    filter: (model: BaseComponentModel) => boolean;
  }): BaseComponentModel | undefined {
    if (!param.component) {
      return undefined;
    }
    if (param.filter(param.component)) {
      return param.component;
    }
    if (!param.component?.parentMRef) {
      return undefined;
    }
    const parentModel = AllStores.coreStore.getModel(param.component?.parentMRef);
    return this.fetchModelWithLogicInParent({ component: parentModel, filter: param.filter });
  }

  private findAllModelsWithLogicInContainer(param: {
    container: BaseComponentModel;
    filter: (model: BaseComponentModel) => boolean;
  }): BaseComponentModel[] {
    if (param.container.isTemplate) {
      return [];
    }
    const childMRefs = param.container.isContainer
      ? (param.container as BaseContainerModel).childMRefs
      : [];
    const relatedMRefs = param.container.relatedMRefs ?? [];
    if (childMRefs.length < 1 && relatedMRefs.length < 1) return [];
    let rsp: BaseComponentModel[] = [];

    for (const mRef of childMRefs.concat(relatedMRefs)) {
      const model = AllStores.coreStore.getModel(mRef);
      if (model) {
        if (param.filter(model)) rsp.push(model);
        rsp = rsp.concat(
          this.findAllModelsWithLogicInContainer({ container: model, filter: param.filter })
        );
      }
    }
    return rsp;
  }
}

export function getEventBindingPageDataDependency(
  pathComponents: PathComponent[] | undefined,
  diffPathComponents: DiffPathComponent[],
  componentModel: BaseComponentModel
): DataDependency | undefined {
  if (!pathComponents || pathComponents.length <= 1) return undefined;

  const screenModel = StoreHelpers.fetchRootModel(componentModel);
  if (!screenModel || !screenModel.isRootContainer) return undefined;

  const targetPathComponent = pathComponents[1];
  return {
    id: uniqid.process(),
    dependencyType: DataDependencyType.PAGE_VARIABLE_TABLE,
    rootMRef: screenModel.mRef,
    dataName: targetPathComponent.name,
    relation: {
      kind: DataBindingKind.VARIABLE,
      pathComponents,
    },
    diffPathComponents,
  };
}
