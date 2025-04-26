/* eslint-disable import/no-default-export */
/* eslint-disable no-loop-func */
import { partition } from 'lodash';
import {
  DataModelRegistry,
  Field,
  GraphQLModel,
} from '../shared/type-definition/DataModelRegistry';
import StoreHelpers from '../mobx/StoreHelpers';
import { CascaderSelectModel } from '../models/antd/CascaderSelectModel';
import BaseComponentModel from '../models/base/BaseComponentModel';
import BaseContainerModel from '../models/base/BaseContainerModel';
import DataPickerModel from '../models/mobile-components/DataPickerModel';
import InputModel from '../models/mobile-components/InputModel';
import SelectViewModel from '../models/mobile-components/SelectViewModel';
import { GenericOperator, Operator } from '../shared/type-definition/TableFilterExp';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import {
  DataBinding,
  DataBindingKind,
  isBasicType,
  isMediaType,
  isNumericType,
  isTimeType,
  PathComponent,
  Variable,
  ValueBinding,
  isMediaListType,
  isJsonType,
} from '../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  DecimalType,
  MediaType,
  TimeType,
  IntegerType,
  LOCATION_INFO,
} from '../shared/type-definition/DataModel';
import {
  GraphQLRequestBinding,
  CustomRequestBinding,
} from '../shared/type-definition/EventBinding';
import { ShortId } from '../shared/type-definition/ZTypes';
import { isDefined } from './utils';
import { PredefinedColumnName } from './ZConst';
import { AllStores } from '../mobx/StoreContexts';

export default class DataBindingHelper {
  public static isSameDataType(currentDataType: string, targetDataType: string): boolean {
    if (isMediaType(currentDataType)) {
      return (
        currentDataType === targetDataType ||
        (!isMediaListType(currentDataType) && isBasicType(targetDataType))
      );
    }
    if (!isBasicType(currentDataType)) {
      return true;
    }
    if (!isBasicType(targetDataType)) {
      return false;
    }
    if (isTimeType(targetDataType)) {
      return isTimeType(currentDataType);
    }
    if (isJsonType(targetDataType)) {
      return isJsonType(currentDataType);
    }
    if (isNumericType(targetDataType)) {
      // 时间戳 可以作为基本类型使用
      return (
        isNumericType(currentDataType) ||
        currentDataType === TimeType.TIMESTAMPTZ ||
        currentDataType === TimeType.DATE
      );
    }
    return true;
  }

  public static isAssignableDataType = (
    currentDataType: string,
    targetDataType: string
  ): boolean => {
    if (isBasicType(currentDataType)) {
      return true;
    }
    if (isMediaListType(currentDataType)) {
      return true;
    }
    return targetDataType === currentDataType;
  };

  public static isInOrNotIn(operator: Operator): boolean {
    return operator === GenericOperator.IN || operator === GenericOperator.NOTIN;
  }

  public static isNullOrNotNull(operator: Operator | undefined): boolean {
    return (
      !!operator && (operator === GenericOperator.ISNULL || operator === GenericOperator.ISNOTNULL)
    );
  }

  public static isDecimalComparisonOperator(operator: Operator): boolean {
    return (
      operator === GenericOperator.GT ||
      operator === GenericOperator.LT ||
      operator === GenericOperator.GTE ||
      operator === GenericOperator.LTE
    );
  }

  public static isValueBindingOfType(
    dataBinding: DataBinding,
    wantedType: DataBindingKind
  ): boolean {
    return (
      dataBinding.valueBinding instanceof Object &&
      (dataBinding.valueBinding as ValueBinding)?.kind === wantedType
    );
  }

  public static fetchCollectionFields = (dataModelRegistry: DataModelRegistry): Field[] => {
    return dataModelRegistry.getQueries().filter((element: Field) => {
      return element.type === ARRAY_TYPE;
    });
  };

  public static fetchReferenceFields = (dataModelRegistry: DataModelRegistry): Field[] => {
    return dataModelRegistry.getQueries().filter((element: Field) => {
      return element.type !== ARRAY_TYPE;
    });
  };

  public static fetchQueryFields(
    model: BaseContainerModel,
    dataModelRegistry: DataModelRegistry
  ): Field[] {
    let fieldList: Field[] = [];
    if (model.queries && model.queries?.length > 0) {
      const listQuery: GraphQLRequestBinding = model.queries[0];
      const options: Field[] = DataBindingHelper.fetchCollectionFields(dataModelRegistry);
      const listField = options.find((e) => e.name === listQuery.value);
      if (listField && listField.itemType) {
        const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(
          listField.itemType
        );
        fieldList = gqlModel?.fields.filter((e) => isBasicType(e.itemType ?? e.type)) ?? [];
      }
    }
    if (model.thirdPartyQueries && model.thirdPartyQueries?.length > 0) {
      const customRequestBinding: CustomRequestBinding = model.thirdPartyQueries[0];
      fieldList = (customRequestBinding.output?.object?.map((e) => ({
        name: e.name,
        type: e.type,
        nullable: true,
      })) ?? []) as Field[];
    }
    return fieldList;
  }

  public static convertGraphQLObjectArgs(objects: Field[]): Record<string, DataBinding> {
    const objectArgs: Record<string, DataBinding> = {};
    if (objects.length > 0) {
      objects.forEach((element) => {
        objectArgs[element.name] = DataBinding.withSingleValue(element.type, element.itemType);
      });
    }
    return objectArgs;
  }

  public static fetchLocationInfoSubField(type: string): Field[] {
    if (type !== LOCATION_INFO) {
      return [];
    }
    return [
      {
        name: PredefinedColumnName.CITY,
        type: BaseType.TEXT,
        nullable: true,
      },
      {
        name: PredefinedColumnName.COUNTRY,
        type: BaseType.TEXT,
        nullable: true,
      },
      {
        name: PredefinedColumnName.DISTRICT,
        type: BaseType.TEXT,
        nullable: true,
      },
      {
        name: PredefinedColumnName.PROVINCE,
        type: BaseType.TEXT,
        nullable: true,
      },
      {
        name: PredefinedColumnName.TOWNSHIP,
        type: BaseType.TEXT,
        nullable: true,
      },
    ];
  }

  public static fetchMediaTypeSubField(type: MediaType): Field[] {
    switch (type) {
      case MediaType.IMAGE:
      case MediaType.VIDEO: {
        return [
          {
            name: PredefinedColumnName.ID,
            type: IntegerType.BIGINT,
            nullable: true,
          },
          {
            name: PredefinedColumnName.URL,
            type: BaseType.TEXT,
            nullable: true,
          },
        ];
      }
      case MediaType.FILE: {
        return [
          {
            name: PredefinedColumnName.ID,
            type: IntegerType.BIGINT,
            nullable: true,
          },
          {
            name: PredefinedColumnName.URL,
            type: BaseType.TEXT,
            nullable: true,
          },
          {
            name: PredefinedColumnName.SIZE_BYTES,
            type: IntegerType.INTEGER,
            nullable: true,
          },
          {
            name: PredefinedColumnName.NAME,
            type: BaseType.TEXT,
            nullable: true,
          },
          {
            name: PredefinedColumnName.SUFFIX,
            type: BaseType.TEXT,
            nullable: true,
          },
        ];
      }
      default:
        return [];
    }
  }

  public static fetchInputSelectorOptionsFromChildModels(params: {
    model: BaseComponentModel;
    dataBinding: DataBinding;
  }): { input?: CascaderSelectModel[]; selector?: CascaderSelectModel[] } {
    const { model, dataBinding } = params;
    const screenModel = StoreHelpers.fetchRootModel(model);
    if (!screenModel) return {};

    const models = StoreHelpers.findAllModelsWithLogicInContainer({
      container: screenModel,
      filter: (componentModel: BaseComponentModel) =>
        componentModel.isInput || componentModel.isSelection,
    }) as BaseComponentModel[];

    const [inputs, selections] = partition(models, (componentModel) => componentModel.isInput).map(
      (componentModels) =>
        componentModels
          .map((componentModel) =>
            DataBindingHelper.getModelFromChildComponent(componentModel, dataBinding)
          )
          .filter(isDefined)
    );

    return {
      input: inputs,
      selector: selections,
    };
  }

  private static getModelFromChildComponent(
    elementModel: BaseComponentModel,
    dataBinding: DataBinding
  ): CascaderSelectModel | undefined {
    switch (elementModel.type) {
      case ComponentModelType.INPUT: {
        const { valueType } = elementModel as InputModel;
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: valueType,
          isLeaf: true,
          disabled: !DataBindingHelper.isSameDataType(valueType, dataBinding.type),
        };
      }
      case ComponentModelType.NUMBER_INPUT: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: DecimalType.FLOAT8,
          isLeaf: true,
          disabled: !DataBindingHelper.isSameDataType(DecimalType.FLOAT8, dataBinding.type),
        };
      }
      case ComponentModelType.SWITCH: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: BaseType.BOOLEAN,
          isLeaf: true,
          disabled: !DataBindingHelper.isSameDataType(BaseType.BOOLEAN, dataBinding.type),
        };
      }
      case ComponentModelType.VIDEO_PICKER: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: MediaType.VIDEO,
          isLeaf: DataBindingHelper.isAssignableDataType(MediaType.VIDEO, dataBinding.type),
          disabled: !DataBindingHelper.isSameDataType(MediaType.VIDEO, dataBinding.type),
        };
      }
      case ComponentModelType.IMAGE_PICKER: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: MediaType.IMAGE,
          isLeaf: DataBindingHelper.isAssignableDataType(MediaType.IMAGE, dataBinding.type),
          disabled: !DataBindingHelper.isSameDataType(MediaType.IMAGE, dataBinding.type),
        };
      }
      case ComponentModelType.MULTI_IMAGE_PICKER: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: MediaType.IMAGE_LIST,
          isLeaf: true,
          disabled: !DataBindingHelper.isSameDataType(MediaType.IMAGE_LIST, dataBinding.type),
        };
      }
      case ComponentModelType.CUSTOM_MULTI_IMAGE_PICKER: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: ARRAY_TYPE,
          itemType: MediaType.IMAGE,
          isLeaf: true,
          disabled: !(dataBinding.type === ARRAY_TYPE || dataBinding.itemType === MediaType.IMAGE),
        };
      }
      case ComponentModelType.DATA_PICKER: {
        const dataPickerModel = elementModel as DataPickerModel;
        const currentType: string | undefined = dataPickerModel.sourceType;
        if (!currentType) {
          return undefined;
        }
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: currentType,
          isLeaf: DataBindingHelper.isAssignableDataType(currentType, dataBinding.type),
          disabled: !DataBindingHelper.isSameDataType(currentType, dataBinding.type),
        };
      }
      case ComponentModelType.CALENDER: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: TimeType.DATE,
          isLeaf: DataBindingHelper.isAssignableDataType(TimeType.DATE, dataBinding.type),
          disabled: !DataBindingHelper.isSameDataType(TimeType.DATE, dataBinding.type),
        };
      }
      case ComponentModelType.SELECT_VIEW: {
        const selectViewModel = elementModel as SelectViewModel;
        const currentType: string | undefined = selectViewModel.sourceType;
        if (!currentType) {
          return undefined;
        }
        if (selectViewModel.dataAttributes.multiple) {
          return {
            value: selectViewModel.mRef,
            label: selectViewModel.componentName,
            type: ARRAY_TYPE,
            itemType: currentType,
            isLeaf: true,
            disabled: !(dataBinding.type === ARRAY_TYPE || dataBinding.itemType === currentType),
          };
        }
        return {
          value: selectViewModel.mRef,
          label: selectViewModel.componentName,
          type: currentType,
          isLeaf: DataBindingHelper.isAssignableDataType(currentType, dataBinding.type),
          disabled: !DataBindingHelper.isSameDataType(currentType, dataBinding.type),
        };
      }
      case ComponentModelType.COUNT_DOWN: {
        return {
          value: elementModel.mRef,
          label: elementModel.componentName,
          type: IntegerType.BIGINT,
          isLeaf: true,
          disabled: !DataBindingHelper.isSameDataType(IntegerType.BIGINT, dataBinding.type),
        };
      }
      default:
        return undefined;
    }
  }

  public static getListQueryDataType(containerModel: BaseContainerModel): string | undefined {
    const queries: GraphQLRequestBinding[] = containerModel.queries ?? [];
    if (queries.length > 0) {
      const postHandleBinding: GraphQLRequestBinding | undefined = queries[0] ?? undefined;
      const variable: Variable | undefined =
        containerModel.itemVariableTable?.[postHandleBinding?.requestId ?? ''];
      if (variable) {
        return variable.itemType;
      }
    }
    const customQueries: CustomRequestBinding[] = containerModel.thirdPartyQueries ?? [];
    if (customQueries.length > 0) {
      const customRequestBinding: CustomRequestBinding | undefined = customQueries[0] ?? undefined;
      const variable: Variable | undefined =
        containerModel.itemVariableTable?.[customRequestBinding?.requestId ?? ''];
      if (variable) {
        return variable.itemType;
      }
    }
    const dataPathComponents = containerModel.dataPathComponents ?? [];
    if (dataPathComponents.length > 0) {
      const targetPathComponent = dataPathComponents[dataPathComponents.length - 1];
      return targetPathComponent.itemType;
    }
    return undefined;
  }

  public static getComponentMRefFromPathComponent = (
    model: BaseComponentModel,
    pathComponent: PathComponent
  ): ShortId | undefined => {
    const isArray: boolean = pathComponent.type.endsWith('[]');
    if (!isArray) return undefined;
    const screenModel = StoreHelpers.fetchRootModel(model);
    if (!screenModel) return undefined;
    const componentModels = StoreHelpers.findAllModelsWithLogicInContainer({
      container: screenModel,
      filter: (componentModel: BaseComponentModel) => {
        return (
          componentModel.isContainer &&
          !!(componentModel as BaseContainerModel).itemVariableTable[pathComponent.name]
        );
      },
    });
    if (componentModels.length !== 1) return undefined;
    return componentModels[0].mRef;
  };

  public static genAllDatabindingFromMRefMap(): Record<string, DataBinding[]> {
    const record: Record<string, DataBinding[]> = {};
    Object.values(AllStores.coreStore.mRefMap).forEach((componentModel) => {
      record[componentModel.mRef] = this.getComponentDatabindingList(componentModel);
    });
    return record;
  }

  private static getComponentDatabindingList(dataAttributes: Record<string, any>): DataBinding[] {
    if (!(dataAttributes instanceof Object)) {
      return [];
    }
    const dataBindingList: DataBinding[] = [];
    Object.entries(dataAttributes).forEach(([key, value]) => {
      if (value instanceof Array) {
        value.forEach((e) => {
          this.getComponentDatabindingList(e).forEach((ds) => dataBindingList.push(ds));
        });
      } else if (value instanceof Object) {
        if (value?.valueBinding) {
          const dataBinding = DataBinding.buildFromObject(value);
          if (dataBinding) {
            dataBindingList.push(dataBinding);
          }
        } else {
          this.getComponentDatabindingList(value).forEach((ds) => dataBindingList.push(ds));
        }
      }
    });
    return dataBindingList;
  }
}
