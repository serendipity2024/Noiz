/* eslint-disable import/no-default-export */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import uniqid from 'uniqid';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import { useMutations } from '../../../../hooks/useMutations';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import SelectViewModel from '../../../../models/mobile-components/SelectViewModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, BaseType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { SelectViewMode, SelectViewAttributes } from '../../../mobile-components/ZSelectView';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import SelectListDataConfigRow from '../config-row/SelectListDataConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './SelectViewConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ConfigTab from './ConfigTab';
import useModel from '../../../../hooks/useModel';
import SwitchRow from '../shared/SwitchRow';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Button, Input, Row, Select, Switch, Collapse } from '../../../../zui';
import cssModule from './SelectViewConfigTab.module.scss';

const SelectViewStyleConfigTab = observer((props: { model: SelectViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);

  const { model } = props;
  const dataAttributes = model.dataAttributes as SelectViewAttributes;
  return (
    <>
      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.isMultiline} />
        <Switch
          checked={dataAttributes.isShowMultiLine}
          onChange={(checked) => {
            model.onUpdateDataAttributes('isShowMultiLine', checked);
          }}
        />
      </Row>

      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        key={model.mRef}
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const SelectViewDataConfigTab = observer((props: { model: SelectViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();
  const { transaction, componentMutations } = useMutations();

  const { model } = props;
  const modelId = model.mRef;
  const dataAttributes = model.dataAttributes as SelectViewAttributes;
  const fieldList: Field[] = DataBindingHelper.fetchQueryFields(model, dataModelRegistry);

  const defaultValueArrayElementMappingEnabledInitValue =
    dataAttributes.defaultValue.type === ARRAY_TYPE &&
    !(dataAttributes.defaultValue.valueBinding instanceof Array);

  const [defaultValueArrayElementMappingEnabled, setDefaultValueArrayElementMappingEnabled] =
    useState<boolean>(defaultValueArrayElementMappingEnabledInitValue ?? true);

  const renderSourceComponent = () => {
    switch (dataAttributes.sourceType) {
      case SelectViewMode.LOCAL:
        return renderLocalDataComponent();
      case SelectViewMode.QUERY:
        return renderListPanel();
      default:
        throw new Error(`SelectView sourceType error: ${JSON.stringify(model)}`);
    }
  };
  const renderLocalDataComponent = () => ({
    title: content.source.LOCAL,
    content: (
      <>
        <ZConfigRowTitle text={content.local.data} />
        {dataAttributes.localData.map((item, index) => {
          const canDelete = index >= 2;
          const inputWidth = canDelete ? '85%' : '100%';
          return (
            <Row key={item.key} align="middle" justify="space-between" style={styles.itemContainer}>
              <Input
                style={{ width: inputWidth, ...styles.input }}
                value={item.value}
                onChange={(e) => {
                  const localData = dataAttributes.localData.map((ldItem) =>
                    ldItem.key === item.key ? { ...item, value: e.target.value } : ldItem
                  );
                  model.onUpdateDataAttributes('localData', localData);
                }}
              />
              {canDelete ? (
                <DeleteOutlined
                  style={styles.menuItem}
                  onClick={() => {
                    const localData = dataAttributes.localData.filter(
                      (eItem, eIndex) => index !== eIndex
                    );
                    model.onUpdateDataAttributes('localData', localData);
                  }}
                />
              ) : null}
            </Row>
          );
        })}
        <Button
          style={{ ...styles.addButton }}
          icon={<PlusOutlined />}
          onClick={() => {
            const key = uniqid.process();
            const localData = dataAttributes.localData.concat({
              key,
              value: `selection-${key}`,
            });
            model.onUpdateDataAttributes('localData', localData);
          }}
        >
          {content.local.addTab}
        </Button>
      </>
    ),
  });

  const renderListPanel = () => ({
    title: content.source.QUERY,
    content: (
      <SelectListDataConfigRow mRef={model.mRef} title={content.query.limit} subscriptionEnabled />
    ),
  });

  return (
    <div>
      <SwitchRow
        title={content.label.keepChoice}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="keepChoiceOnRefresh"
      />
      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.multiple} />
        <Switch
          checked={dataAttributes.multiple}
          onChange={(checked) => {
            transaction(() => {
              componentMutations.setDataAttribute(modelId, 'multiple', checked);
              if (checked) {
                componentMutations.setDataAttribute(
                  modelId,
                  'defaultValue',
                  DataBinding.withSingleValue(ARRAY_TYPE)
                );
                setDefaultValueArrayElementMappingEnabled(true);
              } else {
                componentMutations.setDataAttribute(
                  modelId,
                  'defaultValue',
                  DataBinding.withSingleValue(BaseType.TEXT)
                );
              }
            });
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.deselectable} />
        <Switch
          checked={dataAttributes.deselectable}
          onChange={(checked) => {
            model.onUpdateDataAttributes('deselectable', checked);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.treatEmptyAsAll} />
        <Switch
          checked={dataAttributes.treatEmptyAsAll}
          onChange={(checked) => {
            model.onUpdateDataAttributes('treatEmptyAsAll', checked);
          }}
        />
      </Row>
      {model.dataAttributes.multiple ? (
        <>
          <Row justify="space-between" align="middle" style={styles.multiLine}>
            <ZConfigRowTitle text={content.label.defaultValueArrayElementMappingEnabled} />
            <Switch
              checked={defaultValueArrayElementMappingEnabled}
              onChange={(checked) => {
                setDefaultValueArrayElementMappingEnabled(checked);
                if (checked) {
                  model.onUpdateDataAttributes(
                    'defaultValue',
                    DataBinding.withSingleValue(ARRAY_TYPE)
                  );
                } else {
                  const valueBinding = [] as DataBinding[];
                  let type: string;
                  if (dataAttributes.displayDataField) {
                    type = dataAttributes.displayDataField.type;
                  } else {
                    type = BaseType.TEXT;
                  }
                  valueBinding.push(DataBinding.withSingleValue(type));
                  const defaultValue = DataBinding.withSingleValue(ARRAY_TYPE);
                  defaultValue.valueBinding = valueBinding;
                  model.onUpdateDataAttributes('defaultValue', defaultValue);
                }
              }}
            />
          </Row>
          {defaultValueArrayElementMappingEnabled ? (
            <DataBindingConfigRow
              title={content.label.defaultValue}
              componentModel={model}
              dataBinding={dataAttributes.defaultValue}
              onChange={(value) => {
                model.onUpdateDataAttributes('defaultValue', value);
              }}
            />
          ) : (
            <Collapse
              className={cssModule.selectionCollapse}
              setContentFontColorToOrangeBecauseHistoryIsCruel
              items={[
                {
                  title: content.label.defaultValue,
                  content: (
                    <>
                      {dataAttributes.defaultValue.valueBinding instanceof Array &&
                        dataAttributes.defaultValue.valueBinding.map((item, index) => {
                          return (
                            <div key={uniqid.process()}>
                              <DataBindingConfigRow
                                title={content.label.defaultValue + (index + 1)}
                                componentModel={model}
                                dataBinding={item as DataBinding}
                                onDelete={
                                  index >= 1
                                    ? () => {
                                        const valueBinding = (
                                          dataAttributes.defaultValue.valueBinding as DataBinding[]
                                        ).filter((eItem, eIndex) => index !== eIndex);
                                        const defaultValue =
                                          DataBinding.withSingleValue(ARRAY_TYPE);
                                        defaultValue.valueBinding = valueBinding;
                                        model.onUpdateDataAttributes('defaultValue', defaultValue);
                                      }
                                    : undefined
                                }
                                onChange={(value) => {
                                  const valueBinding = (
                                    dataAttributes.defaultValue.valueBinding as DataBinding[]
                                  ).concat();
                                  valueBinding[index] = value;
                                  const defaultValue = DataBinding.withSingleValue(ARRAY_TYPE);
                                  defaultValue.valueBinding = valueBinding;
                                  model.onUpdateDataAttributes('defaultValue', defaultValue);
                                }}
                              />
                            </div>
                          );
                        })}
                      <Button
                        style={{ ...styles.addButton }}
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const valueBinding = (
                            dataAttributes.defaultValue.valueBinding as DataBinding[]
                          ).concat();
                          const { type } = valueBinding[0];
                          valueBinding.push(DataBinding.withSingleValue(type));
                          const defaultValue = DataBinding.withSingleValue(ARRAY_TYPE);
                          defaultValue.valueBinding = valueBinding;
                          model.onUpdateDataAttributes('defaultValue', defaultValue);
                        }}
                      >
                        {content.label.addDefaultValue}
                      </Button>
                    </>
                  ),
                },
              ]}
              bordered
            />
          )}
        </>
      ) : (
        <DataBindingConfigRow
          title={content.label.defaultValue}
          componentModel={model}
          dataBinding={dataAttributes.defaultValue}
          onChange={(value) => {
            model.onUpdateDataAttributes('defaultValue', value);
          }}
        />
      )}
      <ZConfigRowTitle text={content.label.sourceType} />
      <Select
        style={styles.fullWidth}
        value={dataAttributes.sourceType}
        onChange={(value) => {
          transaction(() => {
            componentMutations.setDataAttribute(modelId, 'sourceType', value);
            componentMutations.setDataAttribute(modelId, 'displayDataField', undefined);

            if (dataAttributes.multiple) {
              const defaultValue = DataBinding.withSingleValue(ARRAY_TYPE);
              if (dataAttributes.defaultValue.valueBinding instanceof Array) {
                const valueBinding = [] as DataBinding[];
                valueBinding.push(DataBinding.withSingleValue(BaseType.TEXT));
                defaultValue.valueBinding = valueBinding;
              }
              componentMutations.setDataAttribute(modelId, 'defaultValue', defaultValue);
            } else {
              componentMutations.setDataAttribute(
                modelId,
                'defaultValue',
                DataBinding.withSingleValue(BaseType.TEXT)
              );
            }
            if (value === SelectViewMode.LOCAL) {
              componentMutations.setProperty(modelId, 'queries', []);
              componentMutations.setProperty(modelId, 'thirdPartyQueries', []);
              componentMutations.setProperty(modelId, 'itemVariableTable', {});
            }
          });
        }}
      >
        {Object.values(SelectViewMode).map((e) => (
          <Select.Option key={e} value={e} style={styles.selectOption}>
            {content.source[e] ?? e}
          </Select.Option>
        ))}
      </Select>

      <Collapse
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[renderSourceComponent()]}
        bordered
      />
      {fieldList.length > 0 ? (
        <Collapse
          className={cssModule.selectionCollapse}
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={[
            {
              title: content.query.field,
              content: (
                <Select
                  bordered={false}
                  value={dataAttributes.displayDataField?.name}
                  placeholder={content.query.placeholder}
                  size="large"
                  className={cssModule.listSelect}
                  onChange={(value) => {
                    const field = fieldList.find((e) => e.name === value);
                    if (field) {
                      transaction(() => {
                        componentMutations.setDataAttribute(modelId, 'displayDataField', field);
                        if (dataAttributes.multiple) {
                          if (!defaultValueArrayElementMappingEnabled) {
                            const valueBinding = [] as DataBinding[];
                            valueBinding.push(DataBinding.withSingleValue(field.type));
                            const defaultValue = DataBinding.withSingleValue(ARRAY_TYPE);
                            defaultValue.valueBinding = valueBinding;
                            componentMutations.setDataAttribute(
                              modelId,
                              'defaultValue',
                              defaultValue
                            );
                          }
                        } else {
                          componentMutations.setDataAttribute(
                            modelId,
                            'defaultValue',
                            DataBinding.withSingleValue(field.type)
                          );
                        }
                      });
                    }
                  }}
                >
                  {fieldList.map((item: Field) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
          ]}
          bordered
        />
      ) : null}
    </div>
  );
});

const SelectViewActionConfigTab = observer((props: { model: SelectViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as SelectViewAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.action} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={cloneDeep(dataAttributes.itemClickActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('itemClickActions', value)}
      />
    </>
  );
});

export default observer(function SelectViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<SelectViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      DataConfigTab={SelectViewDataConfigTab}
      ActionConfigTab={SelectViewActionConfigTab}
      StyleConfigTab={SelectViewStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  itemContainer: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  menuItem: {
    fontSize: '20px',
    color: '#666666',
    padding: '5px',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    backgroundColor: 'transparent',
    color: '#666666',
  },
  fullWidth: {
    width: '100%',
  },
  multiLine: {
    marginTop: '10px',
  },
  input: {
    color: ZColors.WHITE,
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    border: '0px',
  },
};
