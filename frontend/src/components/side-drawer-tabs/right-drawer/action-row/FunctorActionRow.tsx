/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import uniqid from 'uniqid';
import { DataBinding, isBasicType } from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, BaseType, ColumnTypes } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import SharedStyles from '../config-row/SharedStyles';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { FunctorHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import ConfigInput from '../shared/ConfigInput';
import i18n from './FunctorActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Button, Collapse, Input, Row, Select } from '../../../../zui';

export interface FunctorArg {
  name: string;
  dataBinding: DataBinding;
}

interface Props {
  model: BaseComponentModel;
  event: FunctorHandleBinding;
  onEventChange: () => void;
}

export default observer(function FunctorActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, onEventChange } = props;

  const args: FunctorArg[] = Object.entries(event.args ?? {}).map((element) => ({
    name: element[0],
    dataBinding: element[1],
  }));

  const onSaveFunctorArgs = (list: FunctorArg[]) => {
    event.args = Object.fromEntries(list.map((item) => [item.name, item.dataBinding]));
    onEventChange();
  };

  const addArg = (): void => {
    onSaveFunctorArgs([
      ...args,
      {
        name: `name_${uniqid.process()}`,
        dataBinding: DataBinding.withSingleValue(BaseType.TEXT),
      },
    ]);
  };

  const removeArg = (removeIndex: number): void => {
    const list: FunctorArg[] = args.filter((element: FunctorArg, index) => index !== removeIndex);
    onSaveFunctorArgs(list);
  };

  const updateArgName = (name: string, updateIndex: number): void => {
    const list: FunctorArg[] = args.map((element: FunctorArg, index) =>
      index === updateIndex
        ? {
            ...element,
            name,
          }
        : element
    );
    onSaveFunctorArgs(list);
  };

  const updateArgType = (type: string, updateIndex: number): void => {
    const list: FunctorArg[] = args.map((element: FunctorArg, index) =>
      index === updateIndex
        ? {
            ...element,
            dataBinding: DataBinding.withSingleValue(type),
          }
        : element
    );
    onSaveFunctorArgs(list);
  };

  const updateArgDataBinding = (dataBinding: DataBinding, updateIndex: number): void => {
    const list: FunctorArg[] = args.map((element: FunctorArg, index) =>
      index === updateIndex
        ? {
            ...element,
            dataBinding,
          }
        : element
    );
    onSaveFunctorArgs(list);
  };

  const renderArgItemComponent = (arg: FunctorArg, index: number) => {
    const options: Field[] = [
      ...ColumnTypes.map((element) => ({
        name: element as string,
        type: element as string,
        nullable: false,
      })),
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
          componentModel={props.model}
          dataBinding={arg.dataBinding}
          onChange={(dataBinding) => updateArgDataBinding(dataBinding, index)}
        />
      </>
    );
  };

  return (
    <div>
      <div style={styles.functorNameContainer}>
        <ZConfigRowTitle text={content.label.name} />
        <ConfigInput
          value={event.name}
          placeholder={content.placeholder.name}
          onSaveValue={(value) => {
            event.name = value;
            onEventChange();
          }}
        />
      </div>
      <ZConfigRowTitle text={content.label.parameter} />
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
        <div style={styles.afterContainer}>
          <div style={styles.afterTitle}>{content.label.after}</div>
          <AssignPageDataConfigRow
            key={JSON.stringify(event.resultAssociatedPathComponents)}
            title={content.label.assign}
            pageDataFilter={(type) => isBasicType(type)}
            model={props.model}
            pathComponents={event.resultAssociatedPathComponents}
            onPathComponentsChange={(pcs) => {
              event.resultAssociatedPathComponents = pcs;
              onEventChange();
            }}
          />
          <ZConfigRowTitle text={content.label.onSuccess} />
          <ClickActionConfigRow
            componentModel={props.model}
            eventList={event.onSucceedActions}
            eventListOnChange={(list) => {
              event.onSucceedActions = list;
              onEventChange();
            }}
          />
          <ZConfigRowTitle text={content.label.onFailure} />
          <ClickActionConfigRow
            componentModel={props.model}
            eventList={event.onFailedActions}
            eventListOnChange={(list) => {
              event.onFailedActions = list;
              onEventChange();
            }}
          />
        </div>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  functorNameContainer: {
    marginBottom: '15px',
  },
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
    marginTop: '10px',
    backgroundColor: 'rgb(251, 189, 88)',
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
  afterContainer: {
    width: '100%',
  },
  afterTitle: {
    marginTop: '20px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
};
