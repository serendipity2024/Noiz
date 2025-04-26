/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useModel from '../../../../hooks/useModel';
import { AllStores } from '../../../../mobx/StoreContexts';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BaseType, DecimalType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { InputValueType, InputAttributes } from '../../../mobile-components/ZInput';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import SwitchRow from '../shared/SwitchRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './InputConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import InputModel from '../../../../models/mobile-components/InputModel';
import ConfigTab from './ConfigTab';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { EventType } from '../../../../shared/type-definition/EventBinding';
import { Input, InputNumber, Row, Slider, Switch, ZSelect } from '../../../../zui';
import stylesModule from './InputConfigTab.module.scss';

const InputStyleConfigTab = observer((props: { model: InputModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);

  const { model } = props;
  const dataAttributes = model.dataAttributes as InputAttributes;
  const { backgroundColor, color, placeholderColor } = dataAttributes;
  const inputDefaultValue = dataAttributes.placeholder.effectiveValue;
  const multiLine = dataAttributes.multiLine?.effectiveValue;
  return (
    <>
      <ZConfigRowTitle text={content.label.placeholder} />
      <Input
        value={inputDefaultValue}
        style={styles.input}
        onChange={(e) => {
          model.onUpdateDataAttributes('placeholder', DataBinding.withLiteral(e.target.value));
        }}
      />
      <SwitchRow
        title={content.label.isPassword}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="password"
      />
      <SwitchRow
        title={content.label.isFocused}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="focus"
      />
      <Row justify="space-between" align="middle">
        <ZConfigRowTitle text={content.label.multiline} />
        <Switch
          checked={multiLine}
          onChange={(checked) => {
            model.onUpdateDataAttributes(
              'multiLine',
              DataBinding.withLiteral(checked, BaseType.BOOLEAN)
            );
          }}
        />
      </Row>
      <ZConfigRowTitle text={content.label.cursorSpacing} />
      <Row>
        <Slider
          min={0}
          max={100}
          style={{ width: '70%', marginRight: '15px' }}
          value={dataAttributes.cursorSpacing.effectiveValue}
          onChange={(value: number) => {
            model.onUpdateDataAttributes('cursorSpacing', DataBinding.withLiteral(value));
          }}
        />
        <InputNumber
          key={`cursor-spacing-${model.mRef}`}
          min={0}
          max={100}
          style={styles.inputNumber}
          value={dataAttributes.cursorSpacing.effectiveValue}
          onChange={(value) => {
            model.onUpdateDataAttributes('cursorSpacing', DataBinding.withLiteral(value));
          }}
        />
      </Row>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        key={`color-picker-background-color-${model.mRef}`}
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(value) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(value));
        }}
      />
      <ColorPicker
        key={`color-picker-text-color-${model.mRef}`}
        style={styles.colorSelect}
        color={color}
        name={commonContent.label.textColor}
        onChange={(value) => {
          model.onUpdateDataAttributes('color', DataBinding.withColor(value));
        }}
      />
      <ColorPicker
        key={`color-picker-placeholder-color-${model.mRef}`}
        style={styles.colorSelect}
        color={placeholderColor}
        name={content.label.placeholderColor}
        onChange={(value) => {
          model.onUpdateDataAttributes('placeholderColor', DataBinding.withColor(value));
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const InputDataConfigTab = observer((props: { model: InputModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);

  const { model } = props;
  const dataAttributes = model.dataAttributes as InputAttributes;
  const { valueType, defaultValue } = dataAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.valueType} />
      <ZSelect
        className={stylesModule.fullWidth}
        value={valueType}
        onChange={(value) => {
          const diffItems = [
            ComponentDiff.buildUpdateDataAttributesDiff({
              model,
              valueKey: 'valueType',
              newValue: value,
            }),
          ];
          switch (value) {
            case InputValueType.TEXT: {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'defaultValue',
                  newValue: DataBinding.withSingleValue(BaseType.TEXT),
                })
              );
              break;
            }
            case InputValueType.Numeric: {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'defaultValue',
                  newValue: DataBinding.withLiteral(0, DecimalType.FLOAT8),
                })
              );
              break;
            }
            default:
              throw new Error(`input model valueType error, ${model}`);
          }
          AllStores.diffStore.applyDiff(diffItems);
        }}
        options={Object.values(InputValueType).map((e) => ({
          key: e,
          value: e,
          title: content.valueType[e] ?? e,
        }))}
      />

      <DataBindingConfigRow
        key={`${model.mRef}-${dataAttributes.valueType}`}
        title={commonContent.label.defaultValue}
        componentModel={model}
        dataBinding={defaultValue}
        onChange={(value) => {
          model.onUpdateDataAttributes('defaultValue', value);
        }}
      />
    </>
  );
});

const InputActionConfigTab = observer((props: { model: InputModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as InputAttributes;
  const { onChangeDebounceDuration } = dataAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.onChange} />
      <ClickActionConfigRow
        componentModel={model}
        enabledActions={[
          {
            type: EventType.RERUN_CONDITION,
            enabled: true,
          },
          {
            type: EventType.SWITCH_VIEW_CASE,
            enabled: true,
          },
        ]}
        eventList={cloneDeep(dataAttributes.onChangeActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onChangeActions', value)}
      />
      <DataBindingConfigRow
        title={content.label.onChangeDebounceDuration}
        componentModel={model}
        dataBinding={onChangeDebounceDuration}
        onChange={(value) => {
          model.onUpdateDataAttributes('onChangeDebounceDuration', value);
        }}
      />
      <ZConfigRowTitle text={content.label.onBlur} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={cloneDeep(dataAttributes.onBlurActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onBlurActions', value)}
      />
    </>
  );
});

export default observer(function InputConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<InputModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={InputActionConfigTab}
      DataConfigTab={InputDataConfigTab}
      StyleConfigTab={InputStyleConfigTab}
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
  fullWidth: {
    width: '100%',
  },
  fixedRow: {
    marginTop: '10px',
  },
  input: {
    background: ZThemedColors.SECONDARY,
    height: '40px',
    borderRadius: '6px',
    border: '0px',
    color: '#787878',
  },
  inputNumber: {
    background: ZThemedColors.SECONDARY,
    width: '20%',
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
  },
};
