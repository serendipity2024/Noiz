/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { BaseType, DecimalType, IntegerType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import { BorderStyle } from '../side-drawer-tabs/right-drawer/config-row/BorderStyleConfigRow';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export enum InputValueType {
  TEXT = 'TEXT',
  Numeric = 'Numeric',
}

export const ZInputDefaultReferenceAttributes = {
  valueType: InputValueType.TEXT,
  defaultValue: DataBinding.withTextVariable(),
  onChangeDebounceDuration: DataBinding.withSingleValue(IntegerType.INTEGER),
  onChangeActions: [] as EventBinding[],
  onBlurActions: [] as EventBinding[],
};

export const ZInputDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  placeholder: DataBinding.withLiteral('please input...'),
  color: DataBinding.withColor(ZColors.BLACK),
  placeholderColor: DataBinding.withColor(ZColors.GREY),
  backgroundColor: DataBinding.withColor(ZColors.WHITE),
  borderStyle: DataBinding.withLiteral(BorderStyle.Solid),
  borderWidth: DataBinding.withLiteral(1, DecimalType.FLOAT8),
  multiLine: DataBinding.withLiteral(false, BaseType.BOOLEAN),
  password: false,
  focus: false,
  cursorSpacing: DataBinding.withLiteral(0, DecimalType.FLOAT8),
  ...ZInputDefaultReferenceAttributes,
};

export type InputAttributes = typeof ZInputDefaultDataAttributes;

export const ZInputDefaultFrame: ZFrame = {
  size: { width: 200, height: 30 },
  position: { x: 0, y: 0 },
};

export default observer(function ZInput(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataAttributes = model.dataAttributes as InputAttributes;
  let text: string = dataAttributes.defaultValue.effectiveValue ?? '';
  const color = text.length > 0 ? cb(dataAttributes.color) : cb(dataAttributes.placeholderColor);
  const backgroundColor = cb(dataAttributes.backgroundColor);

  if (text.length <= 0) {
    text = dataAttributes.placeholder.effectiveValue;
  }
  const textStyle = {
    color,
    ...styles.text,
    WebkitLineClamp: dataAttributes.multiLine?.effectiveValue ? 10 : 1,
  };
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
      <label style={textStyle}>{text}</label>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  text: {
    paddingRight: '20px',
    paddingLeft: '10px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
};
