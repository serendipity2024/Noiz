/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import uniqid from 'uniqid';
import _ from 'lodash';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import {
  isMediaType,
  Variable,
  isMediaListType,
  DataBinding,
} from '../../../../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  BITMAP,
  ColumnTypes,
  LOCATION_INFO,
} from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import SharedStyles from './SharedStyles';
import i18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import StringUtils from '../../../../utils/StringUtils';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { ComponentInputOutputData } from '../../../../models/interfaces/ComponentModel';
import DataBindingConfigRow from './DataBindingConfigRow';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import { Button, Collapse, Input, message, Row, Select, Switch } from '../../../../zui';

interface Props {
  noDataTitle: string;
  addDataTitle: string;
  referenceable: boolean;
  selectReferencedDataTransientModel: BaseComponentModel;
  dataSource: ComponentInputOutputData[];
  saveComponentOutput: (list: ComponentInputOutputData[]) => void;
}

export default observer(function ComponentInputOutputConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();
  const referenceFields = useMemo(
    () => DataBindingHelper.fetchReferenceFields(dataModelRegistry),
    [dataModelRegistry]
  );

  const { dataSource } = props;

  const addComponentData = (): void => {
    const name = `name_${uniqid.process()}`;
    const data = {
      type: BaseType.TEXT,
      nullable: false,
    };
    props.saveComponentOutput([...dataSource, { name, variable: data }]);
  };

  const removeComponentData = (name: string): void => {
    const list: ComponentInputOutputData[] = dataSource.filter(
      (element: ComponentInputOutputData) => element.name !== name
    );
    props.saveComponentOutput(list);
  };

  const updateComponentDataType = (updateName: string, data: Variable): void => {
    const list: ComponentInputOutputData[] = dataSource.map((element: ComponentInputOutputData) => {
      if (element.name === updateName) {
        return {
          name: updateName,
          variable: { ...element.variable, ...data },
          referencedData: DataBinding.withSingleValue(data.type, data.itemType),
        };
      }
      return element;
    });
    props.saveComponentOutput(list);
  };

  const updateComponentData = (
    componentOutput: ComponentInputOutputData,
    updateIndex: number
  ): void => {
    const list: ComponentInputOutputData[] = dataSource.map(
      (element: ComponentInputOutputData, index) =>
        index === updateIndex ? componentOutput : element
    );
    props.saveComponentOutput(list);
  };

  const renderReferenceDataComponent = (
    componentOutput: ComponentInputOutputData,
    index: number
  ) => {
    const { selectReferencedDataTransientModel, referenceable } = props;
    return (
      referenceable && (
        <DataBindingConfigRow
          title={content.data.referenceData}
          componentModel={selectReferencedDataTransientModel}
          dataBinding={
            componentOutput.referencedData ??
            DataBinding.withSingleValue(
              componentOutput.variable.type,
              componentOutput.variable.itemType
            )
          }
          onChange={(dataBinding) =>
            updateComponentData(
              {
                ...componentOutput,
                referencedData: dataBinding,
              },
              index
            )
          }
        />
      )
    );
  };

  const renderComponentDataItemComponent = (
    componentOutput: ComponentInputOutputData,
    index: number
  ) => {
    const options: Field[] = [...ColumnTypes, BITMAP, LOCATION_INFO].map((element) => ({
      name: element as string,
      type: element as string,
      nullable: false,
    }));
    _.cloneDeep(referenceFields).forEach((element) => options.push(element));
    return (
      <>
        <Row justify="space-between" align="middle" style={styles.componentDataContainer}>
          <div style={styles.title}>{content.data.name}</div>
          <Input
            key={uniqid.process()}
            defaultValue={componentOutput.name}
            style={styles.componentDataInput}
            onBlur={(e) => {
              const name = e.target.value;
              if (!StringUtils.isValid(name)) {
                message.error(`invalid component output data name, ${name}`);
                return;
              }
              if (dataSource.find((ds) => ds.name === name)) {
                message.error(`component output data name is existing, ${name}`);
                return;
              }
              updateComponentData(
                {
                  ...componentOutput,
                  name,
                },
                index
              );
            }}
          />
        </Row>
        <Row
          key={componentOutput.name + index}
          justify="space-between"
          align="middle"
          style={styles.componentDataContainer}
        >
          <div style={styles.title}>{content.data.type}</div>
          <Select
            value={componentOutput.variable.itemType ?? componentOutput.variable.type}
            style={styles.componentDataCascader}
            dropdownMatchSelectWidth={false}
            onSelect={(value) => {
              const field = options.find((element) => element.type === value);
              updateComponentDataType(componentOutput.name, field as Variable);
            }}
            placeholder={content.data.placeholder}
          >
            {options.map((element) => (
              <Select.Option key={element.type} value={element.type} style={styles.option}>
                {(content.type as Record<string, any>)[element.type] ?? element.type}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <Row justify="space-between" align="middle" style={styles.sharePanelRow}>
          <label style={styles.title}>{content.data.isList}</label>
          <Switch
            key={componentOutput.variable.type}
            disabled={isMediaType(componentOutput.variable.type)}
            checked={
              componentOutput.variable.type === ARRAY_TYPE ||
              isMediaListType(componentOutput.variable.type)
            }
            onChange={(checked) => {
              if (checked) {
                updateComponentDataType(componentOutput.name, {
                  ...componentOutput.variable,
                  itemType: componentOutput.variable.type,
                  type: ARRAY_TYPE,
                });
              } else if (componentOutput.variable.itemType) {
                updateComponentDataType(componentOutput.name, {
                  ...componentOutput.variable,
                  type: componentOutput.variable.itemType,
                  itemType: undefined,
                });
              }
            }}
          />
        </Row>
        {renderReferenceDataComponent(componentOutput, index)}
      </>
    );
  };

  return (
    <div>
      {dataSource.length > 0 ? (
        <Collapse
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={dataSource.map((element, index) => ({
            title: element.name,
            icon: (
              <DeleteFilled
                onClick={(e) => {
                  e.stopPropagation();
                  removeComponentData(element.name);
                }}
              />
            ),
            content: renderComponentDataItemComponent(element, index),
          }))}
        />
      ) : (
        <div style={styles.emptyContent}>{props.noDataTitle}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button
          icon={<PlusOutlined />}
          type="link"
          style={styles.addButton}
          onClick={addComponentData}
        >
          {props.addDataTitle}
        </Button>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  emptyContent: {
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    color: ZThemedColors.ACCENT,
  },
  saveButton: {
    ...SharedStyles.configRowButton,
  },
  componentDataContainer: {
    marginBottom: '10px',
  },
  title: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  componentDataInput: {
    background: ZThemedColors.PRIMARY,
    height: '32px',
    width: '70%',
    border: '0px',
    color: ZColors.WHITE,
    borderRadius: '6px',
  },
  componentDataCascader: {
    width: '70%',
    fontSize: '12px',
    border: '0px',
  },
  option: {
    fontSize: '12px',
  },
  sharePanelRow: {
    marginBottom: '15px',
  },
};
