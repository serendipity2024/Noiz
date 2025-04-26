/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import { observer } from 'mobx-react';
import React from 'react';
import { DeleteFilled } from '@ant-design/icons';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventType,
  ImageFilterHandleBinding,
  ImageFilterParamsType,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import effectRecord from '../../../../shared/assets/json/filter-effect.json';
import { Collapse, Row, Select } from '../../../../zui';

import i18n from './ImageFilterActionRow.i18n.json';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import { ARRAY_TYPE, BITMAP, JsonType } from '../../../../shared/type-definition/DataModel';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: ImageFilterHandleBinding;
  onEventChange: () => void;
}

export default observer(function ImageFilterActionRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;

  const renderSelectListDataMode = (isCustomList: boolean, onSelected: () => void) => {
    const value = isCustomList ? content.select.customList : content.select.variable;
    return (
      <div style={styles.selectContainer}>
        <Select style={styles.select} value={value} onChange={() => onSelected()}>
          <Select.Option key={content.select.variable} value={content.select.variable}>
            {content.select.variable}
          </Select.Option>
          <Select.Option key={content.select.customList} value={content.select.customList}>
            {content.select.customList}
          </Select.Option>
        </Select>
      </div>
    );
  };

  const renderListComponent = (
    key: string,
    list: Record<string, DataBinding>[],
    onValueChange: (value: DataBinding | Record<string, DataBinding>[]) => void
  ) => {
    return (
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={[
          {
            title: key,
            content: (
              <>
                {renderSelectListDataMode(true, () => {
                  onValueChange(DataBinding.withSingleValue(ARRAY_TYPE, JsonType.JSONB));
                })}
                <Collapse
                  bordered
                  setContentFontColorToOrangeBecauseHistoryIsCruel
                  items={list.map((record, index) => ({
                    title: `item-${index}`,
                    icon: index !== 0 && (
                      <DeleteFilled
                        onClick={(mouseEvent) => {
                          mouseEvent.stopPropagation();
                          onValueChange(list.filter((iRecord, iIndex) => iIndex !== index));
                        }}
                      />
                    ),
                    content: (
                      <>
                        {Object.entries(record).map(([iKey, iValue]) => {
                          const dataBinding = iValue as DataBinding;
                          return (
                            <DataBindingConfigRow
                              key={iKey}
                              title={iKey}
                              componentModel={componentModel}
                              dataBinding={dataBinding}
                              onChange={(data) => {
                                record[iKey] = data;
                                onValueChange(
                                  list.map((iRecord, iIndex) =>
                                    iIndex === index ? record : iRecord
                                  )
                                );
                              }}
                            />
                          );
                        })}
                      </>
                    ),
                  }))}
                />
                <Row
                  align="middle"
                  justify="center"
                  style={styles.addItem}
                  onClick={(mouseEvent) => {
                    mouseEvent.stopPropagation();
                    if (list.length < 1) return;
                    const newItem: Record<string, DataBinding> = {};
                    Object.entries(list[0]).forEach(([iKey, iValue]) => {
                      newItem[iKey] = DataBinding.withSingleValue(iValue.type);
                    });
                    onValueChange([...list, newItem]);
                  }}
                >
                  Add Item
                </Row>
              </>
            ),
          },
        ]}
      />
    );
  };

  const renderObjectComponent = (
    key: string,
    object: Record<string, DataBinding>,
    onValueChange: (object: Record<string, DataBinding>) => void
  ) => {
    return Object.entries(object).map(([iKey, iValue]) => {
      const dataBinding = iValue as DataBinding;
      return (
        <DataBindingConfigRow
          key={iKey}
          title={`${key}/${iKey}`}
          componentModel={componentModel}
          dataBinding={dataBinding}
          onChange={(data) => {
            object[iKey] = data;
            onValueChange(object);
          }}
        />
      );
    });
  };

  return (
    <>
      <DataBindingConfigRow
        title={content.label.bitmap}
        componentModel={props.componentModel}
        dataBinding={event.bitmap}
        onChange={(value) => {
          event.bitmap = value;
          onEventChange();
        }}
      />
      <ZConfigRowTitle text={content.label.filterName} />
      <Select
        style={styles.select}
        value={event.filterName}
        placeholder={content.label.selectPlaceholder}
        onChange={(value) => {
          const params: Record<string, ImageFilterParamsType> = {};
          Object.entries((effectRecord as any)[value]).forEach(([key, item]) => {
            if (item instanceof Array && item.length > 0) {
              const childParams: Record<string, DataBinding> = {};
              Object.entries(item[0]).forEach(([iKey, iItem]) => {
                childParams[iKey] = DataBinding.withSingleValue((iItem as any).type);
              });
              params[key] = [childParams];
            } else if (item instanceof Object) {
              if (item.hasOwnProperty('type')) {
                params[key] = DataBinding.withSingleValue((item as any).type);
              } else {
                const childParams: Record<string, DataBinding> = {};
                Object.entries(item).forEach(([iKey, iItem]) => {
                  childParams[iKey] = DataBinding.withSingleValue((iItem as any).type);
                });
                params[key] = childParams;
              }
            }
          });
          event.filterName = value;
          event.params = params;
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {Object.keys(effectRecord).map((key) => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>

      <ZConfigRowTitle text={content.label.filterParmas} />
      {Object.entries(event.params ?? {}).map(([key, value]) => {
        if (DataBinding.isDataBinding(value)) {
          const dataBinding = value as DataBinding;
          return (
            <div key={key}>
              <DataBindingConfigRow
                title={key}
                componentModel={componentModel}
                dataBinding={dataBinding}
                onChange={(data) => {
                  if (event.params) {
                    event.params[key] = data;
                    onEventChange();
                  }
                }}
              />
            </div>
          );
        }
        if (value instanceof Array) {
          return (
            <div key={key}>
              {renderListComponent(key, value, (list) => {
                if (event.params) {
                  event.params[key] = list;
                  onEventChange();
                }
              })}
            </div>
          );
        }
        if (value instanceof Object) {
          const valueRecord = value as Record<string, DataBinding>;
          return (
            <div key={key}>
              {renderObjectComponent(key, valueRecord, (list) => {
                if (event.params) {
                  event.params[key] = list;
                  onEventChange();
                }
              })}
            </div>
          );
        }
        throw new Error(`ImageFilterHandleBinding params error, ${JSON.stringify(event.params)}`);
      })}
      <AssignPageDataConfigRow
        title={content.label.assignTo}
        pageDataFilter={(type) => type === BITMAP}
        model={componentModel}
        pathComponents={event.assignTo}
        onPathComponentsChange={(pathComponents) => {
          event.assignTo = pathComponents;
          onEventChange();
        }}
      />
      <RequestResultActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.IMAGE_FILTER,
            enabled: false,
          },
        ])}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  selectContainer: {
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  addItem: {
    marginTop: '15px',
  },
};
