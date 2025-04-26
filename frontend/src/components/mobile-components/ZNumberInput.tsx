/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType, DecimalType } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { BorderStyle } from '../side-drawer-tabs/right-drawer/config-row/BorderStyleConfigRow';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZNumberInputDefaultReferenceAttributes = {
  inputDefaultValue: DataBinding.withLiteral(0, DecimalType.FLOAT8),
};

export const ZNumberInputDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ZNumberInputDefaultReferenceAttributes,
  color: DataBinding.withColor(ZColors.BLACK),
  backgroundColor: DataBinding.withColor(ZColors.WHITE),
  borderStyle: DataBinding.withLiteral(BorderStyle.NONE),
  borderWidth: DataBinding.withLiteral(1, DecimalType.FLOAT8),
  min: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  max: DataBinding.withLiteral(100, DecimalType.FLOAT8),
  step: DataBinding.withLiteral(1, DecimalType.FLOAT8),
  disabled: DataBinding.withLiteral(false, BaseType.BOOLEAN),
  inputDisabled: DataBinding.withLiteral(false, BaseType.BOOLEAN),
};

export type NumberInputAttributes = typeof ZNumberInputDefaultDataAttributes;

export const ZNumberInputDefaultFrame: ZFrame = {
  size: { width: 100, height: 30 },
  position: { x: 0, y: 0 },
};

export default observer(function ZNumberInput(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataAttributes = model.dataAttributes as NumberInputAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);

  const defaultValue = dataAttributes.inputDefaultValue.effectiveValue;

  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const rbuttonStyle = {
    backgroundColor,
    ...configuredStyle,
    ...styles.rbutton,
  };

  const lbuttonStyle = {
    backgroundColor,
    ...configuredStyle,
    ...styles.lbutton,
  };

  const inputStyle = {
    backgroundColor,
    ...styles.input,
  };

  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
      <button style={lbuttonStyle} type="button">
        -
      </button>
      <label style={inputStyle}>{defaultValue}</label>
      <button style={rbuttonStyle} type="button">
        +
      </button>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  lbutton: {
    borderStyle: 'none',
    height: '100%',
    width: '30px',
  },
  rbutton: {
    borderStyle: 'none',
    height: '100%',
    width: '30px',
  },
  input: {
    height: '100%',
    borderStyle: 'none',
    textAlign: 'center',
  },
};
