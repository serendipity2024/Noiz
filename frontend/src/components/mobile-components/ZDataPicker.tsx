/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import { Field } from '../../shared/type-definition/DataModelRegistry';
import ZFrame from '../../models/interfaces/Frame';
import {
  DataBinding,
  DataBindingKind,
  PredefinedFunctionName,
  TODAY,
} from '../../shared/type-definition/DataBinding';
import { TimeType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';
import useShowDataBinding from '../../hooks/useShowDataBinding';
import { Row } from '../../zui';

export enum DataPickerMode {
  TIME = 'TIME',
  DATE = 'DATE',
  OBJECT = 'OBJECT',
}

export const ENTER_TIME = 'Enter time';
export const ENTER_DATE = 'Enter date';
export const ENTER_OBJECT = 'Enter object';

export const ZDataPickerDefaultReferenceAttributes = {
  title: DataBinding.withLiteral(ENTER_DATE),
  placeHolder: DataBinding.withLiteral(''),
  defaultValue: DataBinding.buildFromObject({
    type: TimeType.DATE,
    valueBinding: {
      kind: DataBindingKind.FUNCTION,
      label: TODAY,
      value: PredefinedFunctionName.GET_CURRENT_DATE,
    },
  }) as DataBinding,
  mode: DataPickerMode.DATE,
  valueType: TimeType.DATE,
  displayDataField: undefined as Field | undefined,
  onChangeActions: [] as EventBinding[],
};

export const ZDataPickerDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.WHITE),
  labelColor: DataBinding.withColor(ZColors.LIGHT_BLACK),
  textColor: DataBinding.withColor(ZColors.BLACK),
  clearable: false,
  ...ZDataPickerDefaultReferenceAttributes,
};

export type DataPickerAttributes = typeof ZDataPickerDefaultDataAttributes;

export const ZDataPickerDefaultFrame: ZFrame = {
  size: { width: 265, height: 40 },
  position: { x: 0, y: 0 },
};

export default observer(function ZDataPicker(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  const showDataBinding = useShowDataBinding();
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as DataPickerAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  const title: string = dataAttributes.title.effectiveValue;
  const placeHolder: string = dataAttributes.placeHolder.effectiveValue;
  const value: string = showDataBinding(dataAttributes.defaultValue);
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const labelColor = cb(dataAttributes.labelColor);
  const textColor = cb(dataAttributes.textColor);

  return (
    <div
      style={{
        ...styles.container,
        ...configuredStyle,
        backgroundColor,
      }}
    >
      <Row align="middle" justify="space-between" style={styles.row}>
        {title.length > 0 ? (
          <div style={{ ...styles.title, color: labelColor }}>{title}</div>
        ) : null}
        <div
          style={{
            ...styles.value,
            textAlign: title.length > 0 ? 'right' : 'left',
            color: textColor,
          }}
        >
          {value.length > 0 ? value : placeHolder}
        </div>
      </Row>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  row: {
    width: '100%',
    flexWrap: 'nowrap',
  },
  title: {
    marginLeft: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
  },
  value: {
    marginLeft: '10px',
    marginRight: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
  },
};
