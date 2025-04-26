/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useConfigTabHelpers from '../../../../hooks/useConfigTabHelpers';
import useLocale from '../../../../hooks/useLocale';
import { useMutations } from '../../../../hooks/useMutations';
import DataPickerModel from '../../../../models/mobile-components/DataPickerModel';
import {
  DataBinding,
  DataBindingKind,
  NOW,
  PredefinedFunctionName,
  TODAY,
} from '../../../../shared/type-definition/DataBinding';
import { IntegerType, TimeType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import {
  DataPickerMode,
  ENTER_DATE,
  ENTER_OBJECT,
  ENTER_TIME,
  DataPickerAttributes,
} from '../../../mobile-components/ZDataPicker';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import SelectListDataConfigRow from '../config-row/SelectListDataConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './DataPickerTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import ConfigTab from './ConfigTab';
import { PredefinedColumnName, ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Collapse, Input, Row, Select, Switch } from '../../../../zui';
import cssModule from './DataPickerTab.module.scss';

const DataPickerStyleConfigTab = observer((props: { model: DataPickerModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as DataPickerAttributes;
  const { localizedContent: commonContent } = useLocale(commonI18n);
  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.labelColor}
        name={commonContent.label.labelColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('labelColor', DataBinding.withColor(color));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.textColor}
        name={commonContent.label.textColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('textColor', DataBinding.withColor(color));
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const DataPickerDataConfigTab = observer((props: { model: DataPickerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { transaction, componentMutations } = useMutations();
  const { dataModelRegistry } = useDataModelMetadata();

  const { model } = props;
  const modelId = model.mRef;
  const dataAttributes = model.dataAttributes as DataPickerAttributes;
  const fieldList: Field[] = DataBindingHelper.fetchQueryFields(model, dataModelRegistry);

  const onSelectMode = (mode: DataPickerMode) => {
    transaction(() => {
      componentMutations.setDataAttribute(modelId, 'mode', mode);
      componentMutations.setDataAttribute(modelId, 'clearable', false);

      switch (mode) {
        case DataPickerMode.TIME: {
          componentMutations.setProperty(modelId, 'queries', []);
          componentMutations.setProperty(modelId, 'thirdPartyQueries', []);
          componentMutations.setProperty(modelId, 'itemVariableTable', {});
          componentMutations.setDataAttribute(
            modelId,
            'defaultValue',
            DataBinding.buildFromObject({
              type: TimeType.TIMETZ,
              valueBinding: {
                kind: DataBindingKind.FUNCTION,
                label: NOW,
                value: PredefinedFunctionName.GET_CURRENT_TIME,
              },
            })
          );
          componentMutations.setDataAttribute(
            modelId,
            'title',
            DataBinding.withLiteral(ENTER_TIME)
          );
          componentMutations.setDataAttribute(modelId, 'valueType', TimeType.TIMETZ);
          componentMutations.setDataAttribute(modelId, 'displayDataField', undefined);
          break;
        }
        case DataPickerMode.DATE: {
          componentMutations.setProperty(modelId, 'queries', []);
          componentMutations.setProperty(modelId, 'thirdPartyQueries', []);
          componentMutations.setProperty(modelId, 'itemVariableTable', {});
          componentMutations.setDataAttribute(
            modelId,
            'defaultValue',
            DataBinding.buildFromObject({
              type: TimeType.DATE,
              valueBinding: {
                kind: DataBindingKind.FUNCTION,
                label: TODAY,
                value: PredefinedFunctionName.GET_CURRENT_DATE,
              },
            })
          );
          componentMutations.setDataAttribute(
            modelId,
            'title',
            DataBinding.withLiteral(ENTER_DATE)
          );
          componentMutations.setDataAttribute(modelId, 'valueType', TimeType.DATE);
          componentMutations.setDataAttribute(modelId, 'displayDataField', undefined);
          break;
        }
        case DataPickerMode.OBJECT: {
          componentMutations.setDataAttribute(modelId, 'defaultValue', DataBinding.withLiteral(''));
          componentMutations.setDataAttribute(
            modelId,
            'title',
            DataBinding.withLiteral(ENTER_OBJECT)
          );
          break;
        }
        default:
          break;
      }
    });
  };

  return (
    <div>
      <ZConfigRowTitle text={commonContent.label.title} />
      <Input
        value={dataAttributes.title.effectiveValue}
        style={styles.titleInput}
        onChange={(e) => {
          model.onUpdateDataAttributes('title', DataBinding.withLiteral(e.target.value));
        }}
      />
      <ZConfigRowTitle text={commonContent.label.placeHolder} />
      <Input
        value={dataAttributes.placeHolder.effectiveValue}
        style={styles.titleInput}
        onChange={(e) => {
          model.onUpdateDataAttributes('placeHolder', DataBinding.withLiteral(e.target.value));
        }}
      />
      <ZConfigRowTitle text={content.label.mode} />
      <Select
        bordered={false}
        value={dataAttributes.mode}
        size="large"
        style={styles.iconSelect}
        onChange={onSelectMode}
      >
        {Object.entries(DataPickerMode).map(([key, value]) => (
          <Select.Option key={key} value={value} style={styles.titleText}>
            <label>{content.mode[value] ?? value}</label>
          </Select.Option>
        ))}
      </Select>
      {dataAttributes.mode !== DataPickerMode.OBJECT ||
      (dataAttributes.mode === DataPickerMode.OBJECT && dataAttributes.displayDataField) ? (
        <DataBindingConfigRow
          title={commonContent.label.defaultValue}
          componentModel={model}
          dataBinding={dataAttributes.defaultValue}
          onChange={(value) => {
            model.onUpdateDataAttributes('defaultValue', value);
          }}
        />
      ) : null}
      {dataAttributes.mode === DataPickerMode.OBJECT ? (
        <>
          <Collapse
            bordered
            setContentFontColorToOrangeBecauseHistoryIsCruel
            defaultOpenIndex={0}
            className={cssModule.collapse}
            items={[
              {
                title: content.label.list,
                content: (
                  <SelectListDataConfigRow
                    mRef={model.mRef}
                    title={content.label.limit}
                    subscriptionEnabled
                    additionalUpdatesWithQueryChange={() => {
                      componentMutations.setDataAttribute(modelId, 'displayDataField', {
                        name: PredefinedColumnName.ID,
                        type: IntegerType.BIGINT,
                        nullable: false,
                      });
                      componentMutations.setDataAttribute(
                        modelId,
                        'defaultValue',
                        DataBinding.withSingleValue(IntegerType.BIGINT)
                      );
                    }}
                  />
                ),
              },
            ]}
          />
          {fieldList.length > 0 ? (
            <>
              <ZConfigRowTitle text={content.label.whichField} />
              <Select
                bordered={false}
                value={dataAttributes.displayDataField?.name}
                placeholder={commonContent.placeholder.select}
                size="large"
                style={styles.listSelect}
                onChange={(value) => {
                  const field = fieldList.find((e) => e.name === value);
                  if (field) {
                    transaction(() => {
                      componentMutations.setDataAttribute(modelId, 'displayDataField', field);
                      componentMutations.setDataAttribute(
                        modelId,
                        'defaultValue',
                        DataBinding.withSingleValue(field.type)
                      );
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
            </>
          ) : null}
        </>
      ) : null}

      <Row justify="space-between" align="middle" style={styles.rowContanier}>
        <ZConfigRowTitle text={content.label.deselectable} />
        <Switch
          disabled={dataAttributes.mode !== DataPickerMode.OBJECT}
          checked={dataAttributes.clearable}
          onChange={(checked) => {
            model.onUpdateDataAttributes('clearable', checked);
          }}
        />
      </Row>
    </div>
  );
});

const DataPickerActionConfigTab = observer((props: { model: DataPickerModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as DataPickerAttributes;
  const { localizedContent: content } = useLocale(i18n);
  return (
    <>
      <ZConfigRowTitle text={content.label.onChange} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={cloneDeep(dataAttributes.onChangeActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onChangeActions', value)}
      />
    </>
  );
});

export default observer(function DataPickerTab(props: MRefProp): NullableReactElement {
  const { model } = useConfigTabHelpers<DataPickerModel>(props.mRef);
  if (!model) return null;
  return (
    <ConfigTab
      model={model}
      DataConfigTab={DataPickerDataConfigTab}
      ActionConfigTab={DataPickerActionConfigTab}
      StyleConfigTab={DataPickerStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  iconSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    border: '0px',
    borderRadius: '6px',
    textAlign: 'center',
  },
  titleInput: {
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
    height: '40px',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  listSelect: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
  rowContanier: {
    marginTop: '10px',
  },
};
