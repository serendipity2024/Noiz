import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import uniqid from 'uniqid';
import { DataModelRegistry, Field } from '../../../../shared/type-definition/DataModelRegistry';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { isBasicType, isMediaType, Variable } from '../../../../shared/type-definition/DataBinding';
import { BaseType, ColumnTypes } from '../../../../shared/type-definition/DataModel';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import SharedStyles from './SharedStyles';
import i18n from './DataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import StringUtils from '../../../../utils/StringUtils';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Button, Collapse, Input, message, Row, Select } from '../../../../zui';

const { Option, OptGroup } = Select;

export interface LinkedData {
  name: string;
  data: Variable;
}

interface Props {
  data: BaseContainerModel;
  dataModelRegistry: DataModelRegistry;
  saveLinkedData: (list: LinkedData[]) => void;
}

interface States {
  variableList: LinkedData[];
}

export const LinkedDataConfigRow = observer((props: Props): ReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const variableList: LinkedData[] = Object.entries(props.data.variableTable).map((element) => ({
    key: uniqid.process(),
    name: element[0],
    data: element[1],
  }));

  const addLinkedData = (): void => {
    const name = `name_${uniqid.process()}`;
    const data = {
      type: BaseType.TEXT,
      nullable: false,
    };
    props.saveLinkedData([...variableList, { name, data }]);
  };

  const removeLinkedData = (name: string): void => {
    const list: LinkedData[] = variableList.filter((element: LinkedData) => element.name !== name);
    props.saveLinkedData(list);
  };

  const updateLinkedDataName = (name: string, updateIndex: number): void => {
    if (!StringUtils.isValid(name)) {
      message.error(`invalid linked data name, ${name}`);
      return;
    }
    const list: LinkedData[] = variableList.map((element: LinkedData, index) => {
      if (index === updateIndex) {
        return {
          name,
          data: element.data,
        };
      }
      return element;
    });
    props.saveLinkedData(list);
  };

  const updateLinkedDataType = (updateName: string, data: Variable): void => {
    const list: LinkedData[] = variableList.map((element: LinkedData) => {
      if (element.name === updateName) {
        return { name: updateName, data };
      }
      return element;
    });
    props.saveLinkedData(list);
  };

  const renderLinkedDataItemComponent = (linkedData: LinkedData, index: number) => {
    const options: string[] = ColumnTypes.map((element) => element as string);
    const referenceOptions: Field[] = DataBindingHelper.fetchReferenceFields(
      props.dataModelRegistry
    );
    let defaultValue = linkedData.data.type;
    if (!isBasicType(linkedData.data.type) && !isMediaType(linkedData.data.type)) {
      defaultValue = `Reference/${linkedData.data.type}`;
    }
    return (
      <>
        <Row justify="space-between" align="middle" style={styles.linkedDataContainer}>
          <div>{content.data.name}</div>
          <Input
            key={uniqid.process()}
            defaultValue={linkedData.name}
            style={styles.linkedDataInput}
            onBlur={(e) => {
              updateLinkedDataName(e.target.value, index);
            }}
          />
        </Row>
        <Row
          key={linkedData.name + index}
          justify="space-between"
          align="middle"
          style={styles.linkedDataContainer}
        >
          <div>{content.data.type}</div>
          <Select
            value={defaultValue}
            style={styles.linkedDataCascader}
            dropdownMatchSelectWidth={false}
            onSelect={(value, opt) => {
              let field = {} as Field;
              referenceOptions.forEach((element: Field) => {
                if (element.name === opt.children) {
                  field = element;
                }
              });
              if (field.name === undefined) {
                updateLinkedDataType(linkedData.name, {
                  type: value,
                  nullable: false,
                });
              } else {
                updateLinkedDataType(linkedData.name, field as Variable);
              }
            }}
            placeholder={content.data.placeholder}
          >
            {options.map((element) => {
              return (
                <Option key={element} value={element} style={styles.option}>
                  {(content.type as Record<string, any>)[element] ?? element}
                </Option>
              );
            })}

            <OptGroup label={content.data.reference}>
              {referenceOptions.map((element: Field) => {
                const value = `Reference/${element.type}`;
                return (
                  <Option key={value} value={value} style={styles.option}>
                    {element.name}
                  </Option>
                );
              })}
            </OptGroup>
          </Select>
        </Row>
      </>
    );
  };

  const collapseItems = variableList.map((element, index) => ({
    title: element.name,
    icon: (
      <DeleteFilled
        onClick={(e) => {
          e.stopPropagation();
          removeLinkedData(element.name);
        }}
      />
    ),
    content: renderLinkedDataItemComponent(element, index),
  }));

  return (
    <div>
      {variableList.length > 0 ? (
        <Collapse
          hasUnstableId
          activeIndex={activeIndex}
          onActiveIndexChange={(index: number) => setActiveIndex(index)}
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={collapseItems}
          bordered
        />
      ) : (
        <div style={styles.emptyContent}>{content.label.noLinkedData}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button
          icon={<PlusOutlined />}
          type="link"
          style={styles.addButton}
          onClick={addLinkedData}
        >
          {content.label.addLinkedData}
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
  linkedDataContainer: {
    marginBottom: '10px',
  },
  linkedDataInput: {
    background: '#eee',
    height: '32px',
    width: '70%',
  },
  linkedDataCascader: {
    width: '70%',
    fontSize: '12px',
  },
  option: {
    fontSize: '12px',
  },
};
