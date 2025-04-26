/* eslint-disable import/no-default-export */
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import uniqid from 'uniqid';
import { observer } from 'mobx-react';
import { Field } from '../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../models/antd/CascaderSelectModel';
import { DataBinding, isBasicType, PathComponent } from '../../shared/type-definition/DataBinding';
import { BaseType } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import DataBindingConfigRow from '../side-drawer-tabs/right-drawer/config-row/DataBindingConfigRow';
import SharedStyles from '../side-drawer-tabs/right-drawer/config-row/SharedStyles';
import TextModel from '../../models/mobile-components/TextModel';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import ColumnOperatorSelectConfigRow from '../side-drawer-tabs/right-drawer/config-row/ColumnOperatorSelectConfigRow';
import DataBindingHelper from '../../utils/DataBindingHelper';
import { Cascader, Row } from '../../zui';
import { ColumnValueExp, GenericOperator } from '../../shared/type-definition/TableFilterExp';
import cssModule from './ZManagementConsoleTabFilter.module.scss';

interface Props {
  title: string;
  tableName: string;
  filters: ColumnValueExp[];
  onFilterChange: (filters: ColumnValueExp[]) => void;
}

export const ZManagementConsoleTabFilter = observer((props: Props): NullableReactElement => {
  const { tableName } = props;
  const { dataModelRegistry } = useDataModelMetadata();
  const filters = props.filters ?? [];

  const requestField: Field | undefined = dataModelRegistry
    .getQueries()
    .find((e: Field) => e.type === tableName);

  const cascaderOptions: CascaderSelectModel[] =
    requestField?.where
      ?.filter((field) => isBasicType(field.type))
      .map((field) => convertFieldToOption(field)) ?? [];

  function onFilterDelete(index: number) {
    const newFilters = filters.filter((_, idx) => idx !== index);
    if (newFilters) {
      props.onFilterChange(newFilters);
    }
  }

  function onFilterChange(exp: ColumnValueExp, index: number) {
    const newFilters = filters.map((element, idx) => (idx === index ? exp : element));
    if (newFilters) {
      props.onFilterChange(newFilters);
    }
  }

  function onCascaderChange(selectedOptions: CascaderSelectModel[]) {
    if (selectedOptions.length <= 0) return;
    const lastNodeObject = selectedOptions[selectedOptions.length - 1];
    const lastFilters = filters ?? [];
    const newFilters = [
      ...lastFilters,
      {
        op: GenericOperator.EQ,
        value: DataBinding.withSingleValue(lastNodeObject.type ?? BaseType.TEXT),
        pathComponents: selectedOptions.map((cs) => ({
          type: cs.type ?? '',
          name: cs.value,
        })),
      },
    ];
    if (newFilters) {
      props.onFilterChange(newFilters);
    }
  }

  function onCascaderLoadData(selectedOptions: CascaderSelectModel[]) {
    const targetOption: CascaderSelectModel = selectedOptions[selectedOptions.length - 1];
    if (!targetOption.type) return;
    const field: Field | undefined = dataModelRegistry
      .getQueries()
      .find((e: Field) => e.type === targetOption.type);
    if (field) {
      targetOption.children = field?.where?.map((f) => convertFieldToOption(f)) ?? [];
    }
  }

  function convertFieldToOption(field: Field) {
    const type = field.itemType ?? field.type;
    return {
      value: field.name,
      label: field.name,
      type,
      isLeaf: isBasicType(type),
    };
  }

  function customFilterCascader() {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Cascader
          bordered={false}
          popupPlacement="bottomRight"
          options={cascaderOptions}
          loadData={(selectedOptions) => {
            if (selectedOptions !== null) {
              onCascaderLoadData(selectedOptions as CascaderSelectModel[]);
            }
          }}
          onChange={(_unused, selectedOptions) => {
            if (selectedOptions !== null) {
              onCascaderChange(selectedOptions as CascaderSelectModel[]);
            }
          }}
        >
          <div>
            <PlusOutlined className={cssModule.icon} />
          </div>
        </Cascader>
      </div>
    );
  }

  function renderFiltersComponent() {
    return (
      <>
        <Row align="middle" justify="space-between" className={cssModule.container}>
          <div className={cssModule.title}>{props.title}</div>
          {customFilterCascader()}
        </Row>

        {filters.length > 0 ? (
          <div className={cssModule.filter}>
            {filters.map((element, index) => {
              const tempComponentModel = new TextModel('');
              const columnValueExp: ColumnValueExp = element as ColumnValueExp;
              const title =
                columnValueExp.pathComponents?.map((pc: PathComponent) => pc.name).join('/') ??
                undefined;
              return (
                <div key={uniqid.process()} className={cssModule.itemSpace}>
                  <div className={cssModule.configRowContainer}>
                    <DataBindingConfigRow
                      title={title}
                      componentModel={tempComponentModel}
                      dataBinding={columnValueExp.value}
                      cascaderOptions={[]}
                      displaySelectValueComponent={false}
                      displayValueComponent={!DataBindingHelper.isNullOrNotNull(columnValueExp.op)}
                      operatorSelectionComponent={
                        <ColumnOperatorSelectConfigRow
                          columnExp={columnValueExp}
                          onColumnExpChange={(value) => {
                            onFilterChange(value, index);
                          }}
                        />
                      }
                      onDelete={() => onFilterDelete(index)}
                      onChange={(dataBinding) => {
                        columnValueExp.value = dataBinding;
                        onFilterChange(columnValueExp, index);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={cssModule.content}>
            <span style={SharedStyles.configRowTitleText}>{`No ${props.title}`}</span>
          </div>
        )}
      </>
    );
  }

  return cascaderOptions.length > 0 ? <>{renderFiltersComponent()}</> : null;
});
