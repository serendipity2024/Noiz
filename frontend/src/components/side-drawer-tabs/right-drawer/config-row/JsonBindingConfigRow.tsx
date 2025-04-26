/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import uniqid from 'uniqid';
import {
  DataBinding,
  DataBindingKind,
  isMediaType,
  JsonBinding,
  ValueBinding,
} from '../../../../shared/type-definition/DataBinding';
import {
  ARRAY_TYPE,
  BaseType,
  ColumnTypes,
  JsonType,
} from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingConfigRow from './DataBindingConfigRow';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import i18n from './JsonBindingConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Button, Collapse, Input, Row, Select } from '../../../../zui';

export interface JsonArg {
  name: string;
  dataBinding: DataBinding;
}

interface Props {
  componentModel: BaseComponentModel;
  dataBinding: DataBinding;
  onJsonBindingChange: (jsonBinding: JsonBinding) => void;
}

export default observer(function JsonBindingConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { onJsonBindingChange } = props;

  let jsonBinding: JsonBinding = {
    kind: DataBindingKind.JSON,
    data: {},
  };
  if (
    props.dataBinding.valueBinding instanceof Object &&
    (props.dataBinding.valueBinding as ValueBinding).kind === DataBindingKind.JSON
  ) {
    jsonBinding = props.dataBinding.valueBinding as JsonBinding;
  }
  const args: JsonArg[] = Object.entries(jsonBinding.data ?? {}).map((element) => ({
    name: element[0],
    dataBinding: element[1],
  }));

  const onSaveJsonArgs = (list: JsonArg[]) => {
    jsonBinding.data = Object.fromEntries(list.map((item) => [item.name, item.dataBinding]));
    onJsonBindingChange(jsonBinding);
  };

  const addArg = (): void => {
    onSaveJsonArgs([
      ...args,
      {
        name: `name_${uniqid.process()}`,
        dataBinding: DataBinding.withSingleValue(BaseType.TEXT),
      },
    ]);
  };

  const removeArg = (removeIndex: number): void => {
    const list: JsonArg[] = args.filter((element: JsonArg, index) => index !== removeIndex);
    onSaveJsonArgs(list);
  };

  const updateArgName = (name: string, updateIndex: number): void => {
    const list: JsonArg[] = args.map((element: JsonArg, index) =>
      index === updateIndex
        ? {
            ...element,
            name,
          }
        : element
    );
    onSaveJsonArgs(list);
  };

  const updateArgType = (type: string, updateIndex: number): void => {
    const list: JsonArg[] = args.map((element: JsonArg, index) =>
      index === updateIndex
        ? {
            ...element,
            dataBinding: DataBinding.withSingleValue(type),
          }
        : element
    );
    onSaveJsonArgs(list);
  };

  const updateArgDataBinding = (dataBinding: DataBinding, updateIndex: number): void => {
    const list: JsonArg[] = args.map((element: JsonArg, index) =>
      index === updateIndex
        ? {
            ...element,
            dataBinding,
          }
        : element
    );
    onSaveJsonArgs(list);
  };

  const renderArgItemComponent = (arg: JsonArg, index: number) => {
    const options: Field[] = [
      ...ColumnTypes.filter((type) => type !== JsonType.JSONB && !isMediaType(type)).map(
        (type) => ({
          name: type,
          type,
          nullable: false,
        })
      ),
      {
        name: ARRAY_TYPE,
        type: ARRAY_TYPE,
        nullable: false,
      },
    ];

    return (
      <>
        <Row justify="space-between" align="middle" style={styles.pageDataContainer}>
          <div>{content.parameter.name}</div>
          <Input
            key={arg.name}
            defaultValue={arg.name}
            style={styles.pageDataInput}
            onBlur={(e) => {
              updateArgName(e.target.value, index);
            }}
          />
        </Row>
        <Row
          key={arg.name + index}
          justify="space-between"
          align="middle"
          style={styles.pageDataContainer}
        >
          <div>{content.parameter.type}</div>
          <Select
            key={arg.dataBinding.itemType ?? arg.dataBinding.type}
            defaultValue={arg.dataBinding.itemType ?? arg.dataBinding.type}
            style={styles.pageDataCascader}
            dropdownMatchSelectWidth={false}
            onSelect={(value) => {
              updateArgType(value, index);
            }}
          >
            {options.map((element) => (
              <Select.Option key={element.type} value={element.type} style={styles.option}>
                {element.type}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <DataBindingConfigRow
          title={content.parameter.value}
          componentModel={props.componentModel}
          dataBinding={arg.dataBinding}
          onChange={(dataBinding) => updateArgDataBinding(dataBinding, index)}
        />
      </>
    );
  };

  return (
    <div>
      {args.length > 0 ? (
        <Collapse
          bordered
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={args.map((element, index) => ({
            title: element.name,
            icon: (
              <DeleteFilled
                onClick={(e) => {
                  e.stopPropagation();
                  removeArg(index);
                }}
              />
            ),
            content: renderArgItemComponent(element, index),
          }))}
        />
      ) : (
        <div style={styles.emptyContent}>{content.label.noData}</div>
      )}
      <div style={styles.buttonContainer}>
        <Button icon={<PlusOutlined />} type="link" style={styles.addButton} onClick={addArg}>
          {content.label.addData}
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
  },
  pageDataContainer: {
    marginBottom: '10px',
  },
  pageDataInput: {
    background: '#eee',
    height: '32px',
    width: '70%',
  },
  pageDataCascader: {
    width: '70%',
    fontSize: '12px',
  },
  option: {
    fontSize: '12px',
  },
};
