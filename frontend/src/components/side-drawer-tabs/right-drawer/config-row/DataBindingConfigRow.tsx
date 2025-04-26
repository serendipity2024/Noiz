/* eslint-disable import/no-default-export */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EditTwoTone } from '@ant-design/icons';
import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useDataModelRegistryResolvers from '../../../../hooks/useDataModelRegistryResolvers';
import useCustomRequestRegistry from '../../../../hooks/useCustomRequestRegistry';
import { Field, GraphQLModel } from '../../../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../../../models/antd/CascaderSelectModel';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  AGGREGATE,
  AggregateType,
  convertAggregateTargetType,
  DataBinding,
  DataBindingKind,
  INPUTS,
  isNumericType,
  LINKED_DATA,
  LOCAL_DATA,
  LOGGED_IN_USER,
  LOGICAL_DATA,
  PredefinedFunctionName,
  REMOTE_DATA,
  RESULT_DATA,
  PAGE_DATA,
  SELECTIONS,
  ValueBinding,
  Variable,
  ITEM_DATA,
  FORMULA_DATA,
  PathComponent,
  isMediaType,
  CONSTANT_DATA,
  REQUEST_STATUS_DATA,
  REQUEST_STATUS,
  RequestStatus,
  ACTION_DATA,
  GLOBAL_DATA,
  CONDITIONAL_DATA,
  ListBinding,
  TimeFormatType,
  COMPONENT_INPUT_DATA,
  COMPONENT_OUTPUT_DATA,
  ACTION_FLOW_DATA,
  ArrayElementMappingBinding,
  VariableTable,
} from '../../../../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  IntegerType,
  TimeType,
  AdministrationAreaInformation,
  AdministrationAreaInformationPrefix,
  MediaType,
  JsonType,
  LOCATION_INFO,
} from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { PredefinedTableName } from '../../../../utils/ZConst';
import SelectDataInput from '../shared/SelectDataInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingFuncConfigRow, { DataBindingFunction } from './DataBindingFuncConfigRow';
import { COUNT_OPTION } from './CustomCascaderConfigRow';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import i18n from './DataBindingConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import CustomCascader from '../shared/CustomCascader';
import { VariableContext } from '../../../../context/VariableContext';
import ListMutationArrayMappingConfigRow from './ListMutationArrayMappingConfigRow';
import JsonBindingConfigRow from './JsonBindingConfigRow';
import ListBindingConfigRow from './ListBindingConfigRow';
import { getConfiguration } from '../../../../mobx/stores/CoreStore';
import { Button, Dropdown, Select } from '../../../../zui';

interface Props {
  title?: string;
  componentModel: BaseComponentModel;
  dataBinding: DataBinding;
  filterRemoteId?: string;
  // If present, filters the values in the cascade component by type, returninig
  // a boolean for whether they should be included. Returns null if eligibility
  // cannot be determined, and we should fallback to default rules.
  filterValuesByType?: (typeStr: string) => boolean | null;

  // select
  cascaderOptions?: CascaderSelectModel[];
  // TODO: Data binding for input only（Waiting for refactor）
  displaySelectValueComponent?: boolean;
  displayTitleComponent?: boolean;

  // value
  arrayMappingSource?: DataBinding;
  // TODO: control value binding switch input mode (hack)
  valueSwitchable?: boolean;
  displayValueComponent?: boolean;

  // extra data
  contextMenuFunctions?: DataBindingFunction[];
  operatorSelectionComponent?: React.ReactElement;
  editComponent?: React.ReactElement;

  // func
  onDelete?: () => void;
  onChange: (dataBinding: DataBinding) => void;
}

export default function DataBindingConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();
  const { resolveAllVariables } = useDataModelRegistryResolvers();
  const configuration = getConfiguration();

  const { resolveCustomQueries, getCustomRequestField } = useCustomRequestRegistry();
  const { resultVariableRecord, requestStatusVariableRecord, actionDataVariableRecord } =
    useContext(VariableContext);

  const dataBinding = DataBinding.buildFromObject(props.dataBinding);
  if (!dataBinding) return null;

  const {
    filterValuesByType,
    title = 'Text',
    valueSwitchable = true,
    displaySelectValueComponent = true,
    displayValueComponent = true,
    displayTitleComponent = true,
    editComponent,
    componentModel,
    filterRemoteId,
  } = props;

  const isJsonBinding = DataBindingHelper.isValueBindingOfType(dataBinding, DataBindingKind.JSON);
  const isListBinding = DataBindingHelper.isValueBindingOfType(dataBinding, DataBindingKind.LIST);
  const isArrayElementMappingBinding = DataBindingHelper.isValueBindingOfType(
    dataBinding,
    DataBindingKind.ARRAY_ELEMENT_MAPPING
  );

  let values: ValueBinding[] = [];
  if (dataBinding.valueBinding instanceof Array) {
    values = (dataBinding.valueBinding as ValueBinding[]) ?? [];
  } else if (dataBinding.valueBinding && dataBinding.valueBinding.kind !== DataBindingKind.EMPTY) {
    values = [dataBinding.valueBinding as ValueBinding];
  } else {
    values = [];
  }

  const isAssignableToOption = (dataTypeOfOption: string): boolean =>
    DataBindingHelper.isAssignableDataType(dataTypeOfOption, dataBinding.type);

  const shouldDisableOption = (dataTypeOfOption: string): boolean => {
    const filterResult = filterValuesByType ? filterValuesByType(dataTypeOfOption) : null;
    return filterResult !== null
      ? !filterResult
      : !DataBindingHelper.isSameDataType(dataTypeOfOption, dataBinding.type);
  };

  const onValuesChange = (): void => {
    const newDataBinding = DataBinding.buildFromObject(dataBinding);
    if (!newDataBinding) return;

    if (dataBinding.valueBinding instanceof Array) {
      if (values.length > 0 && values[0].kind === DataBindingKind.ARRAY_ELEMENT_MAPPING) {
        const valueBinding = values[0];
        newDataBinding.valueBinding = valueBinding;
      } else {
        newDataBinding.valueBinding = values;
      }
    } else if (values.length === 1) {
      const valueBinding = values[0];
      newDataBinding.valueBinding = valueBinding;
    } else if (values.length === 0) {
      newDataBinding.valueBinding = { kind: DataBindingKind.EMPTY };
    } else {
      throw new Error(`DataBindingConfigRow singleValue length error`);
    }
    props.onChange(newDataBinding);
  };
  const onCascaderLoadData = (targetOption: CascaderSelectModel): CascaderSelectModel[] => {
    const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(
      targetOption.type ?? ''
    );
    if (gqlModel) {
      return gqlModel.fields.map((element) => toCascaderOption(element.name, element));
    }
    const customRequestField = getCustomRequestField(targetOption.type ?? '');
    if (customRequestField) {
      return (customRequestField.object ?? []).map((element) => {
        return {
          value: element.name,
          label: element.name,
          type: element.type,
          itemType: element.itemType,
          isLeaf: isAssignableToOption(element.type),
          disabled: shouldDisableOption(element.type),
        };
      });
    }
    if (targetOption.type?.startsWith(AdministrationAreaInformationPrefix)) {
      return Object.values(AdministrationAreaInformation).map((value) => ({
        value,
        label: value,
        type: BaseType.TEXT,
        isLeaf: true,
        disabled: false,
      }));
    }
    return getSubCascaderOptions(targetOption.type);
  };

  const onCascaderChange = (selectedOptions: CascaderSelectModel[]): void => {
    if (selectedOptions.length <= 0) return;

    const kindObject = selectedOptions[0];
    const targetObject = selectedOptions[1];
    const lastNodeObject = selectedOptions[selectedOptions.length - 1];
    const pathComponents = selectedOptions.map((e) => {
      const pathComponent: PathComponent = {
        name: e.value,
        type: e.type ?? e.value,
        itemType: e.itemType,
      };
      pathComponent.componentMRef = DataBindingHelper.getComponentMRefFromPathComponent(
        componentModel,
        pathComponent
      );
      return pathComponent;
    });
    let selectedValue: ValueBinding | undefined;
    if (
      Object.values(PredefinedFunctionName).includes(lastNodeObject.value as PredefinedFunctionName)
    ) {
      const { value, label } = lastNodeObject;
      selectedValue = { kind: DataBindingKind.FUNCTION, value, label };
      if (value === PredefinedFunctionName.GET_TIMESTAMP) {
        selectedValue = { ...selectedValue, dataFormat: TimeFormatType.NONE };
      }
    } else if (lastNodeObject.value === FORMULA_DATA) {
      selectedValue = {
        kind: DataBindingKind.FORMULA,
        resultType: dataBinding.type,
        valueRecord: {},
      };
    } else if (lastNodeObject.value === CONDITIONAL_DATA) {
      selectedValue = {
        kind: DataBindingKind.CONDITIONAL,
        resultType: dataBinding.type,
        conditionalData: [],
      };
    } else if (props.cascaderOptions) {
      selectedValue = { kind: DataBindingKind.VARIABLE, pathComponents };
    } else {
      switch (kindObject.value) {
        case INPUTS: {
          selectedValue = {
            kind: DataBindingKind.INPUT,
            value: targetObject.value,
            label: targetObject.label,
            pathComponents,
            shouldDependentsUpdateOnValueChange: true,
          };
          break;
        }
        case SELECTIONS: {
          selectedValue = {
            kind: DataBindingKind.SELECTION,
            value: targetObject.value,
            label: targetObject.label,
            pathComponents,
            shouldDependentsUpdateOnValueChange: true,
          };
          break;
        }
        case LOCAL_DATA: {
          const displayName = pathComponents
            .map((pc) => {
              if (pc.name === targetObject.value && targetObject.label) {
                return targetObject.label;
              }
              return pc.name;
            })
            .join('/');
          selectedValue = {
            kind: DataBindingKind.VARIABLE,
            pathComponents,
            displayName,
          };
          break;
        }
        case LOGGED_IN_USER:
        case LINKED_DATA:
        case RESULT_DATA:
        case REQUEST_STATUS_DATA:
        case REMOTE_DATA:
        case GLOBAL_DATA:
        case PAGE_DATA:
        case COMPONENT_INPUT_DATA:
        case COMPONENT_OUTPUT_DATA:
        case ITEM_DATA:
        case CONSTANT_DATA:
        case ACTION_FLOW_DATA:
        case ACTION_DATA: {
          if (kindObject.value === ITEM_DATA) {
            const variable = resolveAllVariables(componentModel.mRef).itemVariables[
              targetObject.value
            ];
            const displayName = pathComponents.map((pc) => pc.name).join('/');
            const newPathComponents = [
              ...(variable?.pathComponents ?? []),
              ...pathComponents.filter((pc, index) => index > 0),
            ];
            selectedValue = {
              kind: DataBindingKind.VARIABLE,
              pathComponents: newPathComponents,
              displayName,
            };
          } else {
            selectedValue = {
              kind: DataBindingKind.VARIABLE,
              pathComponents,
            };
          }
          const hasFilter = lastNodeObject.type === AGGREGATE;
          if (hasFilter) {
            selectedValue = { ...selectedValue, where: { _and: [] } };
          }
          if (kindObject.value === PAGE_DATA) {
            selectedValue = { ...selectedValue, shouldDependentsUpdateOnValueChange: true };
          }
          break;
        }
        default:
          throw new Error(`unsupported value binding kind, ${JSON.stringify(selectedOptions)}`);
      }
    }
    if (selectedValue) {
      values = dataBinding.type !== BaseType.TEXT ? [selectedValue] : [...values, selectedValue];
    }
    onValuesChange();
  };

  const toCascaderOption = (name: string, field: Field): CascaderSelectModel => {
    if (!field.itemType) {
      const children: CascaderSelectModel[] = getSubCascaderOptions(field.type);
      return {
        value: name,
        label: name,
        type: field.type,
        isLeaf: isAssignableToOption(field.type),
        disabled: shouldDisableOption(field.type),
        children: children.length > 0 ? children : undefined,
      };
    }
    if (dataBinding.type === ARRAY_TYPE || dataBinding.itemType === field.itemType) {
      return {
        value: name,
        label: name,
        type: field.type,
        itemType: field.itemType,
        isLeaf: true,
      };
    }
    const childrenOption: CascaderSelectModel[] = [
      {
        ...COUNT_OPTION,
        disabled: shouldDisableOption(IntegerType.INTEGER),
      },
    ];
    const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(field.itemType);
    if (gqlModel) {
      const modelFields =
        gqlModel.fields
          .filter((element) => isNumericType(element.type) && element.name !== 'id')
          .map((element) => ({
            value: element.name,
            label: element.name,
            type: element.type,
            isLeaf: false,
            children: Object.values(AggregateType).map((e) => {
              const type = convertAggregateTargetType(element.type, e);
              return {
                value: e,
                label: e,
                type: AGGREGATE,
                isLeaf: true,
                disabled: shouldDisableOption(type),
              };
            }),
          })) ?? [];
      modelFields.forEach((mf) => childrenOption.push(mf));
    }
    return {
      value: name,
      label: name,
      type: field.type,
      itemType: field.itemType,
      isLeaf: false,
      children: childrenOption,
    };
  };

  const variableToCascaderOption = (variableRecord: Record<string, Variable>) =>
    Object.entries(variableRecord).map((element): CascaderSelectModel => {
      const name = element[0];
      const variable = element[1] as Variable;
      const argRecordList = Object.entries(variable?.args ?? {});
      if (argRecordList.length > 0) {
        return {
          value: name,
          label: name,
          type: variable.type !== '' ? `${variable.itemType ?? variable.type}[]` : '',
          isLeaf: false,
          children: argRecordList.map((item) => {
            const itemName = item[0];
            const itemVariable = item[1] as Field;
            return toCascaderOption(itemName, itemVariable);
          }),
        };
      }
      return toCascaderOption(name, variable as Field);
    }) ?? [];

  const getSubCascaderOptions = (type: string | undefined): CascaderSelectModel[] => {
    if (!type) return [];
    if (isMediaType(type)) {
      return DataBindingHelper.fetchMediaTypeSubField(type as MediaType).map((fd) => ({
        value: fd.name,
        label: fd.name,
        type: fd.type,
        isLeaf: isAssignableToOption(fd.type),
        disabled: shouldDisableOption(fd.type),
      }));
    }
    if (type === LOCATION_INFO) {
      return DataBindingHelper.fetchLocationInfoSubField(type).map((fd) => ({
        value: fd.name,
        label: fd.name,
        type: fd.type,
        isLeaf: isAssignableToOption(fd.type),
        disabled: shouldDisableOption(fd.type),
      }));
    }
    return [];
  };

  const renderCascadeComponent = () => {
    let cascaderOptions: CascaderSelectModel[] = [];
    if (props.cascaderOptions) {
      cascaderOptions = props.cascaderOptions;
    } else {
      // logged-in user
      cascaderOptions.push({
        value: LOGGED_IN_USER,
        label: content.label.loggedInUser,
        type: PredefinedTableName.ACCOUNT,
        isLeaf: isAssignableToOption(PredefinedTableName.ACCOUNT),
      });

      // constant data
      cascaderOptions.push({
        value: CONSTANT_DATA,
        label: content.label.constantData,
        isLeaf: false,
        children: [
          {
            value: REQUEST_STATUS,
            label: REQUEST_STATUS,
            isLeaf: false,
            children: Object.values(RequestStatus).map((value) => ({
              value,
              label: value,
              type: BaseType.TEXT,
              isLeaf: true,
              disabled: shouldDisableOption(BaseType.TEXT),
            })),
          },
        ],
      });

      // logical data
      cascaderOptions.push({
        value: LOGICAL_DATA,
        label: content.label.logicalData,
        isLeaf: false,
        children: [
          {
            label: content.logicalData.null,
            value: PredefinedFunctionName.GET_NULL,
            isLeaf: true,
            disabled: dataBinding.type === ARRAY_TYPE,
          },
          {
            label: content.logicalData.now,
            value: PredefinedFunctionName.GET_CURRENT_TIME,
            isLeaf: true,
            disabled: shouldDisableOption(TimeType.TIMETZ),
          },
          {
            label: content.logicalData.today,
            value: PredefinedFunctionName.GET_CURRENT_DATE,
            isLeaf: true,
            disabled: shouldDisableOption(TimeType.DATE),
          },
          {
            label: content.logicalData.timestamp,
            value: PredefinedFunctionName.GET_TIMESTAMP,
            isLeaf: true,
            disabled: shouldDisableOption(TimeType.TIMESTAMPTZ),
          },
          {
            label: content.logicalData.clipboardData,
            value: PredefinedFunctionName.GET_CLIPBOARD_DATA,
            isLeaf: true,
            disabled: shouldDisableOption(BaseType.TEXT),
          },
          {
            label: content.logicalData.formulaData,
            value: FORMULA_DATA,
            isLeaf: true,
          },
          {
            label: content.logicalData.conditionalData,
            value: CONDITIONAL_DATA,
            isLeaf: true,
          },
          {
            label: content.logicalData.isIOS,
            value: PredefinedFunctionName.GET_ISIOS,
            isLeaf: true,
            disabled: shouldDisableOption(BaseType.BOOLEAN),
          },
          {
            label: content.logicalData.isAndroid,
            value: PredefinedFunctionName.GET_ISANDROID,
            isLeaf: true,
            disabled: shouldDisableOption(BaseType.BOOLEAN),
          },
        ],
      });

      // global data
      const { globalVariableTable } = configuration;
      const globalVariableOptions = variableToCascaderOption(globalVariableTable);
      if (globalVariableOptions.length > 0) {
        cascaderOptions.push({
          value: GLOBAL_DATA,
          label: content.label.globalData,
          isLeaf: false,
          children: globalVariableOptions,
        });
      }

      const {
        itemVariables,
        variables,
        pageVariables,
        localVariables,
        queryVariables,
        componentInputVariables,
        componentOutputVariables,
      } = resolveAllVariables(componentModel.mRef);

      // item data
      const itemVariableOptions = variableToCascaderOption(itemVariables);
      if (itemVariableOptions.length > 0)
        cascaderOptions.push({
          value: ITEM_DATA,
          label: content.label.itemData,
          isLeaf: false,
          children: itemVariableOptions,
        });

      // linked data
      const variableOptions = variableToCascaderOption(variables);
      if (variableOptions.length > 0) {
        cascaderOptions.push({
          value: LINKED_DATA,
          label: content.label.linkedData,
          isLeaf: false,
          children: variableOptions,
        });
      }

      // page data
      const pageOptions = variableToCascaderOption(pageVariables);
      if (pageOptions.length > 0) {
        cascaderOptions.push({
          value: PAGE_DATA,
          label: content.label.pageData,
          isLeaf: false,
          children: pageOptions,
        });
      }

      // component input data
      const componentInputOptions = variableToCascaderOption(componentInputVariables).map(
        (option) => ({
          ...option,
          label: StoreHelpers.getComponentModel(option.value)?.componentName ?? option.value,
        })
      );
      if (componentInputOptions.length > 0) {
        cascaderOptions.push({
          value: COMPONENT_INPUT_DATA,
          label: content.label.componentInputData,
          isLeaf: false,
          children: componentInputOptions,
        });
      }

      // component output data
      const componentOutputOptions = variableToCascaderOption(componentOutputVariables).map(
        (option) => ({
          ...option,
          label: StoreHelpers.getComponentModel(option.value)?.componentName ?? option.value,
        })
      );
      if (componentOutputOptions.length > 0) {
        cascaderOptions.push({
          value: COMPONENT_OUTPUT_DATA,
          label: content.label.componentOutputData,
          isLeaf: false,
          children: componentOutputOptions,
        });
      }

      // local data
      const localOptions = variableToCascaderOption(localVariables).map((option) => ({
        ...option,
        label: StoreHelpers.getComponentModel(option.value)?.componentName ?? option.value,
      }));
      if (localOptions.length > 0) {
        cascaderOptions.push({
          value: LOCAL_DATA,
          label: content.label.localData,
          isLeaf: false,
          children: localOptions,
        });
      }

      // remote data
      const queryOptions = variableToCascaderOption(queryVariables);

      const customQueries =
        resolveCustomQueries(componentModel.mRef).filter((e) => !e.output?.itemType) ?? [];
      const customQueryOptions = customQueries.map((e) => ({
        value: e.requestId,
        label: e.requestId,
        type: e.output?.type,
        itemType: e.output?.itemType,
        isLeaf: isAssignableToOption(e.output?.type ?? BaseType.TEXT),
        disabled: shouldDisableOption(e.output?.type ?? BaseType.TEXT),
      }));

      const queryChildren = [...queryOptions, ...customQueryOptions].filter((remoteChildren) => {
        return remoteChildren.value !== filterRemoteId;
      });
      if (queryChildren.length > 0) {
        cascaderOptions.push({
          value: REMOTE_DATA,
          label: content.label.remoteData,
          isLeaf: false,
          children: queryChildren,
        });
      }

      const { input: inputFields, selector: selectorFields } =
        DataBindingHelper.fetchInputSelectorOptionsFromChildModels({
          model: componentModel,
          dataBinding,
        });

      // input data
      if (inputFields && inputFields.length > 0) {
        cascaderOptions.push({
          value: INPUTS,
          label: content.label.inputs,
          isLeaf: false,
          children: inputFields,
        });
      }

      // selector data
      if (selectorFields && selectorFields.length > 0) {
        cascaderOptions.push({
          value: SELECTIONS,
          label: content.label.selections,
          isLeaf: false,
          children: selectorFields,
        });
      }
    }

    // result data
    if (resultVariableRecord) {
      cascaderOptions.push({
        value: RESULT_DATA,
        label: content.label.resultData,
        isLeaf: false,
        children: Object.entries(resultVariableRecord).map(([key, variable]) => ({
          value: key,
          label: key,
          type: variable.type,
          itemType: variable.itemType,
          children: !isEmpty(variable.args)
            ? variableToCascaderOption(variable.args as VariableTable)
            : undefined,
          isLeaf: variable.type === ARRAY_TYPE ? true : isAssignableToOption(variable.type),
          disabled:
            variable.type === ARRAY_TYPE ? dataBinding.itemType !== variable.itemType : false,
        })),
      });
    }

    // request status data
    if (requestStatusVariableRecord) {
      cascaderOptions.push({
        value: REQUEST_STATUS_DATA,
        label: content.label.requestStatusData,
        isLeaf: false,
        children: Object.entries(requestStatusVariableRecord).map(([key, variable]) => ({
          value: key,
          label: key,
          type: variable.type,
          isLeaf: true,
          disabled: shouldDisableOption(BaseType.TEXT),
        })),
      });
    }

    // action data
    if (actionDataVariableRecord) {
      const actionDataVariableOptions = variableToCascaderOption(actionDataVariableRecord);
      cascaderOptions.push({
        value: ACTION_DATA,
        label: content.label.actionData,
        isLeaf: false,
        children: actionDataVariableOptions,
      });
    }

    return (
      <CustomCascader
        options={cascaderOptions}
        loadData={(selectedOption) => onCascaderLoadData(selectedOption as CascaderSelectModel)}
        onChange={(_unused, selectedOptions) =>
          onCascaderChange(selectedOptions as CascaderSelectModel[])
        }
        customDropdown={(menu) => (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={editComponent ?? <EditTwoTone twoToneColor="#3581F3" />} block />
          </Dropdown>
        )}
      />
    );
  };

  const onSwitchInputMode = (): void => {
    switch (dataBinding.type) {
      case JsonType.JSONB: {
        if (isJsonBinding) {
          values = [];
        } else {
          values = [
            {
              kind: DataBindingKind.JSON,
              data: {},
            },
          ];
        }
        break;
      }
      case ARRAY_TYPE: {
        if (isListBinding) {
          values = [];
        } else {
          values = [
            {
              kind: DataBindingKind.LIST,
              itemType: dataBinding.itemType ?? dataBinding.type,
              object: {},
            },
          ];
        }
        break;
      }
      default:
        break;
    }
    onValuesChange();
  };

  const onSwicthArrayElementMapping = (): void => {
    const sourceDataValueBinding = props.arrayMappingSource?.valueBinding;
    const pathComponents =
      (sourceDataValueBinding as ArrayElementMappingBinding)?.pathComponents ?? [];
    const lastPathComponent: PathComponent = pathComponents[pathComponents.length - 1];
    if (!isArrayElementMappingBinding && lastPathComponent?.itemType) {
      values = [
        {
          kind: DataBindingKind.ARRAY_ELEMENT_MAPPING,
          pathComponents,
          arrayElementFieldMapping: {
            name: '',
            type: lastPathComponent.itemType,
          },
        },
      ];
    } else {
      values = [];
    }
    onValuesChange();
  };

  const renderValueComponent = () => {
    let valueInputComponent = (
      <SelectDataInput
        componentModel={componentModel}
        dataBinding={dataBinding}
        values={values}
        editComponent={displaySelectValueComponent ? renderCascadeComponent() : undefined}
        onValuesChange={(valueBindings) => {
          values = valueBindings;
          onValuesChange();
        }}
      />
    );
    if (isJsonBinding) {
      valueInputComponent = (
        <JsonBindingConfigRow
          componentModel={componentModel}
          dataBinding={dataBinding}
          onJsonBindingChange={(jsonBinding) => {
            values = [jsonBinding];
            onValuesChange();
          }}
        />
      );
    }
    if (isListBinding) {
      valueInputComponent = (
        <ListBindingConfigRow
          componentModel={componentModel}
          listBinding={dataBinding.valueBinding as ListBinding}
          onListBindingChange={(listBinding) => {
            values = [listBinding];
            onValuesChange();
          }}
        />
      );
    }

    return (
      <div>
        {isArrayElementMappingBinding ? (
          <ListMutationArrayMappingConfigRow
            componentModel={componentModel}
            dataBinding={dataBinding}
            listSourceData={props.arrayMappingSource}
            onValuesChange={(valueBindings) => {
              values = valueBindings;
              onValuesChange();
            }}
          />
        ) : (
          <>
            {valueSwitchable &&
            (dataBinding.type === JsonType.JSONB || dataBinding.type === ARRAY_TYPE) ? (
              <Select
                style={styles.select}
                value={
                  isJsonBinding || isListBinding
                    ? content.select.customData
                    : content.select.variable
                }
                onChange={() => onSwitchInputMode()}
              >
                <Select.Option key={content.select.variable} value={content.select.variable}>
                  {content.select.variable}
                </Select.Option>
                <Select.Option key={content.select.customData} value={content.select.customData}>
                  {content.select.customData}
                </Select.Option>
              </Select>
            ) : undefined}
            {valueInputComponent}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      {displayTitleComponent && (
        <div style={styles.container}>
          <div style={styles.titleContainer}>
            <div style={styles.title}>
              <ZConfigRowTitle text={title} />
            </div>
          </div>
          <DataBindingFuncConfigRow
            title={title}
            dataBinding={dataBinding}
            contextMenuFunctions={props.contextMenuFunctions}
            onDelete={props.onDelete}
            onSave={(value) => props.onChange(value)}
            arrayElementMappingEnabled={
              !(isJsonBinding || isListBinding) && !!props.arrayMappingSource
            }
            onSwicthArrayElementMapping={onSwicthArrayElementMapping}
          />
        </div>
      )}
      {props.operatorSelectionComponent}
      {displayValueComponent && renderValueComponent()}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  title: {
    flex: '2',
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  operatorSelect: {
    width: '100%',
    marginBottom: '10px',
  },
  editContainer: {
    marginRight: '-5px',
    paddingRight: '5px',
    paddingLeft: '5px',
  },
  select: {
    width: '100%',
    marginBottom: '10px',
  },
};
