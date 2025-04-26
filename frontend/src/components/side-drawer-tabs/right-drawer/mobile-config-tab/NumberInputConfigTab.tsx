/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { BaseType, DecimalType } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { NumberInputAttributes } from '../../../mobile-components/ZNumberInput';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingInput from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './NumberInputConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useNotificationDisplay from '../../../../hooks/useNotificationDisplay';
import NumberInputModel from '../../../../models/mobile-components/NumberInputModel';
import ConfigTab from './ConfigTab';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { InputNumber, Switch, Empty } from '../../../../zui';

const NumberInputStyleConfigTab = observer((props: { model: NumberInputModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as NumberInputAttributes;
  const { backgroundColor } = dataAttributes;
  const disabled = dataAttributes.disabled.effectiveValue;
  const inputDisabled = dataAttributes.inputDisabled.effectiveValue;

  const onInputDisabledChanged = (checked: boolean) => {
    model.onUpdateDataAttributes(
      'inputDisabled',
      DataBinding.withLiteral(checked, BaseType.BOOLEAN)
    );
  };
  const onDisabledChanged = (checked: boolean) => {
    model.onUpdateDataAttributes('disabled', DataBinding.withLiteral(checked, BaseType.BOOLEAN));
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.disable} />
      <Switch checked={disabled} onChange={onDisabledChanged} onClick={onDisabledChanged} />
      <ZConfigRowTitle text={content.label.disableInput} />
      <Switch
        checked={inputDisabled}
        onChange={onInputDisabledChanged}
        onClick={onInputDisabledChanged}
      />
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const NumberInputDataConfigTab = observer((props: { model: NumberInputModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const notification = useNotificationDisplay();
  const { model } = props;
  const dataAttributes = model.dataAttributes as NumberInputAttributes;

  const max = dataAttributes.max.effectiveValue;
  const min = dataAttributes.min.effectiveValue;
  const step = dataAttributes.step.effectiveValue;

  const { inputDefaultValue } = dataAttributes;

  return (
    <>
      <DataBindingInput
        title={content.label.defaultValue}
        componentModel={model}
        dataBinding={inputDefaultValue}
        onChange={(value) => {
          model.onUpdateDataAttributes('inputDefaultValue', value);
        }}
      />
      <ZConfigRowTitle text={content.label.maxValue} />
      <InputNumber
        value={max}
        step={step}
        style={styles.input}
        onChange={(value) => {
          if (dataAttributes.min.effectiveValue > (value as number)) {
            notification('MAX_LESS_THAN_MIN');
          } else {
            model.onUpdateDataAttributes('max', DataBinding.withLiteral(value, DecimalType.FLOAT8));
          }
        }}
      />
      <ZConfigRowTitle text={content.label.minValue} />
      <InputNumber
        value={min}
        step={step}
        style={styles.input}
        onChange={(value) => {
          if (dataAttributes.max.effectiveValue < (value as number)) {
            notification('MIN_LARGER_THAN_MAX');
          } else {
            model.onUpdateDataAttributes('min', DataBinding.withLiteral(value, DecimalType.FLOAT8));
          }
        }}
      />
      <ZConfigRowTitle text={content.label.stepValue} />
      <InputNumber
        value={step}
        style={styles.input}
        onChange={(value) => {
          if (
            (value as number) >
            dataAttributes.max.effectiveValue - dataAttributes.min.effectiveValue
          ) {
            notification('ILLEGAL_STEP_VALUE');
          } else {
            model.onUpdateDataAttributes(
              'step',
              DataBinding.withLiteral(value, DecimalType.FLOAT8)
            );
          }
        }}
      />
    </>
  );
});

export default observer(function NumberInputConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<NumberInputModel>(props.mRef);
  if (!model) return null;
  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={NumberInputDataConfigTab}
      StyleConfigTab={NumberInputStyleConfigTab}
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
  input: {
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    color: ZColors.WHITE,
    border: '0px',
  },
};
