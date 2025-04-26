/* eslint-disable import/no-default-export */
import { PlusOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import { observer } from 'mobx-react';
import { Field } from '../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../models/antd/CascaderSelectModel';
import {
  TableFilterExp,
  ColumnValueExp,
  GenericOperator,
} from '../../shared/type-definition/TableFilterExp';
import { DataBinding, isBasicType, PathComponent } from '../../shared/type-definition/DataBinding';
import { BaseType, IntegerType } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../utils/ZConst';
import DataBindingConfigRow from '../side-drawer-tabs/right-drawer/config-row/DataBindingConfigRow';
import SharedStyles from '../side-drawer-tabs/right-drawer/config-row/SharedStyles';
import TextModel from '../../models/mobile-components/TextModel';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import ColumnOperatorSelectConfigRow from '../side-drawer-tabs/right-drawer/config-row/ColumnOperatorSelectConfigRow';
import DataBindingHelper from '../../utils/DataBindingHelper';
import { Cascader, Row } from '../../zui';
import cssModule from './TablePermissionFilterEdit.module.scss';

const XUSERID = 'X-User-Id';

interface Props {
  header?: ReactElement;
  title: string;
  tableName: string;
  filters: TableFilterExp[] | undefined;
  onFilterChange: (filters: TableFilterExp[]) => void;
}

export default observer(function TablePermissionFilterEdit(props: Props): NullableReactElement {
  const { tableName, filters } = props;
  const { dataModelRegistry } = useDataModelMetadata();

  const requestField: Field | undefined = dataModelRegistry
    .getQueries()
    .find((e: Field) => e.type === tableName);

  const cascaderOptions: CascaderSelectModel[] =
    requestField?.where?.map((field) => convertFieldToOption(field)) ?? [];

  function onFilterDelete(index: number) {
    const newFilters = filters?.filter((_, idx) => idx !== index);
    if (newFilters) {
      props.onFilterChange(newFilters);
    }
  }

  function onFilterChange(exp: TableFilterExp, index: number) {
    const newFilters = filters?.map((element, idx) => (idx === index ? exp : element));
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
      <div className={cssModule.filterContainer} onClick={(e) => e.stopPropagation()}>
        <div>{props.title}</div>
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
          <div style={styles.buttonContainer}>
            <PlusOutlined />
          </div>
        </Cascader>
      </div>
    );
  }

  function renderFiltersComponent() {
    if (!filters) return null;
    return (
      <>
        <Row
          align="middle"
          justify={props.header ? 'space-between' : 'end'}
          style={styles.container}
        >
          {props.header}
          {customFilterCascader()}
        </Row>
        {filters.length > 0 ? (
          filters.map((element, index) => {
            const tempComponentModel = new TextModel('');
            const columnValueExp: ColumnValueExp = element as ColumnValueExp;
            const title =
              columnValueExp.pathComponents?.map((pc: PathComponent) => pc.name).join('/') ??
              undefined;
            return (
              <div key={uniqid.process()} style={styles.itemSpace}>
                <DataBindingConfigRow
                  title={title}
                  componentModel={tempComponentModel}
                  dataBinding={columnValueExp.value}
                  cascaderOptions={[
                    {
                      value: XUSERID,
                      label: XUSERID,
                      type: IntegerType.BIGSERIAL,
                      isLeaf: true,
                    },
                  ]}
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
            );
          })
        ) : (
          <div style={styles.content}>
            <span style={SharedStyles.configRowTitleText}>{`No ${props.title}s`}</span>
          </div>
        )}
      </>
    );
  }

  return cascaderOptions.length > 0 ? <>{renderFiltersComponent()}</> : null;
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  itemSpace: {
    marginBottom: '15px',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    backgroundColor: 'transparent',
    font: '13px',
  },
  content: {
    borderWidth: '1px',
    borderColor: ZThemedColors.PRIMARY_TEXT,
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
