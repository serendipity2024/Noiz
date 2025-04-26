import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { useMemo, useState } from 'react';
import uniqid from 'uniqid';
import _ from 'lodash';
import { DataModelRegistry, Field } from '../../../../shared/type-definition/DataModelRegistry';
import {
  isMediaType,
  Variable,
  isMediaListType,
  VariableTable,
  isJsonType,
  isLocationType,
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
import { Button, Collapse, Input, message, Row, Select, Switch } from '../../../../zui';

export interface PageData {
  name: string;
  data: Variable;
}

interface Props {
  variableTable: VariableTable;
  dataModelRegistry: DataModelRegistry;
  noDataTitle: string;
  addDataTitle: string;
  savePageData: (list: PageData[]) => void;
  isGlobalDta?: boolean;
}

export const PageDataConfigRow = observer((props: Props): NullableReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const referenceFields = useMemo(
    () => DataBindingHelper.fetchReferenceFields(props.dataModelRegistry),
    [props.dataModelRegistry]
  );

  const variableList: PageData[] = Object.entries(props.variableTable).map((element) => ({
    name: element[0],
    data: element[1],
  }));

  const addPageData = (): void => {
    const name = `name_${uniqid.process()}`;
    const data = {
      type: BaseType.TEXT,
      nullable: false,
    };
    props.savePageData([...variableList, { name, data }]);
  };

  const removePageData = (name: string): void => {
    const list: PageData[] = variableList.filter((element: PageData) => element.name !== name);
    props.savePageData(list);
  };

  const updatePageDataName = (name: string, updateIndex: number): void => {
    if (!StringUtils.isValid(name)) {
      message.error(`invalid page data name, ${name}`);
      return;
    }
    const list: PageData[] = variableList.map((element: PageData, index) => {
      if (index === updateIndex) {
        return {
          name,
          data: element.data,
        };
      }
      return element;
    });
    props.savePageData(list);
  };

  const updatePageDataType = (updateName: string, data: Variable): void => {
    const list: PageData[] = variableList.map((element: PageData) => {
      if (element.name === updateName) {
        return { name: updateName, data, where: [] };
      }
      return element;
    });
    props.savePageData(list);
  };

  const renderPageDataItemComponent = (pageData: PageData, index: number) => {
    let options: Field[] = [...ColumnTypes, BITMAP, LOCATION_INFO]
      .filter((e) =>
        props.isGlobalDta ? !isMediaType(e) && !isJsonType(e) && !isLocationType(e) : e
      )
      .map((element) => ({
        name: element as string,
        type: element as string,
        nullable: false,
      }));
    if (!props.isGlobalDta) {
      options = options.concat(_.cloneDeep(referenceFields));
    }

    return (
      <>
        <Row justify="space-between" align="middle" style={styles.pageDataContainer}>
          <div style={styles.title}>{content.data.name}</div>
          <Input
            key={uniqid.process()}
            defaultValue={pageData.name}
            style={styles.pageDataInput}
            onBlur={(e) => {
              updatePageDataName(e.target.value, index);
            }}
          />
        </Row>
        <Row
          key={pageData.name + index}
          justify="space-between"
          align="middle"
          style={styles.pageDataContainer}
        >
          <div style={styles.title}>{content.data.type}</div>
          <Select
            value={pageData.data.itemType ?? pageData.data.type}
            style={styles.pageDataCascader}
            dropdownMatchSelectWidth={false}
            onSelect={(value) => {
              const field = options.find((element) => element.type === value);
              updatePageDataType(pageData.name, field as Variable);
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
        <Row justify="space-between" align="middle">
          <label style={styles.title}>{content.data.isList}</label>
          <Switch
            key={pageData.data.type}
            disabled={isMediaType(pageData.data.type)}
            checked={pageData.data.type === ARRAY_TYPE || isMediaListType(pageData.data.type)}
            onChange={(checked) => {
              if (checked) {
                updatePageDataType(pageData.name, {
                  ...pageData.data,
                  itemType: pageData.data.type,
                  type: ARRAY_TYPE,
                  unique: false,
                });
              } else if (pageData.data.itemType) {
                updatePageDataType(pageData.name, {
                  ...pageData.data,
                  type: pageData.data.itemType,
                  itemType: undefined,
                  unique: undefined,
                });
              }
            }}
          />
        </Row>
        {!!pageData.data.itemType && (
          <Row justify="space-between" align="middle" style={styles.rowMargin}>
            <label style={styles.title}>{content.data.unique}</label>
            <Switch
              key={pageData.data.type}
              checked={pageData.data.unique}
              onChange={(checked) => {
                updatePageDataType(pageData.name, {
                  ...pageData.data,
                  unique: checked,
                });
              }}
            />
          </Row>
        )}
      </>
    );
  };

  return (
    <div>
      {variableList.length > 0 ? (
        <Collapse
          hasUnstableId
          activeIndex={activeIndex}
          onActiveIndexChange={(index: number) => setActiveIndex(index)}
          items={variableList.map((element, index) => ({
            title: element.name,
            icon: (
              <DeleteFilled
                onClick={(e) => {
                  e.stopPropagation();
                  removePageData(element.name);
                }}
              />
            ),
            content: renderPageDataItemComponent(element, index),
          }))}
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
        />
      ) : (
        <div style={styles.emptyContent}>{props.noDataTitle}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button icon={<PlusOutlined />} type="link" style={styles.addButton} onClick={addPageData}>
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
  pageDataContainer: {
    marginBottom: '10px',
  },
  title: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  pageDataInput: {
    background: ZThemedColors.PRIMARY,
    height: '32px',
    width: '70%',
    border: '0px',
    color: ZColors.WHITE,
    borderRadius: '6px',
  },
  pageDataCascader: {
    width: '70%',
    fontSize: '12px',
    border: '0px',
  },
  option: {
    fontSize: '12px',
  },
  rowMargin: {
    marginTop: '15px',
  },
};
