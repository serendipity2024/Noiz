/* eslint-disable import/no-default-export */
import { Switch } from 'antd-mobile';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import {
  BaseType,
  DecimalType,
  IntegerType,
  SwitchStyleType,
} from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';
import { EventBinding } from '../../shared/type-definition/EventBinding';

export const ZSwitchInputDefaultDataAttributes = {
  selectedColor: DataBinding.withColor(ZThemedColors.ACCENT),
  deselectedColor: DataBinding.withColor(ZColors.DARK_GREY),
  styleType: SwitchStyleType.SWITCH,
  size: DataBinding.withLiteral(25, IntegerType.INTEGER),
  scale: DataBinding.withLiteral(1, DecimalType.FLOAT8),
  selected: DataBinding.withLiteral(true, BaseType.BOOLEAN),
  onChangeActions: [] as EventBinding[],
};

export type SwitchInputAttributes = typeof ZSwitchInputDefaultDataAttributes;

export const ZSwitchInputDefaultFrame: ZFrame = {
  size: { width: 50, height: 30 },
  position: { x: 0, y: 0 },
};

export default observer(function ZSwitchInput(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataAttributes = model.dataAttributes as SwitchInputAttributes;
  const selectedColor = cb(dataAttributes.selectedColor);
  const deselectedColor = cb(dataAttributes.deselectedColor);
  const size = dataAttributes.size.effectiveValue;

  const selectedEffectiveValue = dataAttributes.selected.effectiveValue;
  let selected = false;
  if (typeof selectedEffectiveValue === 'string' && selectedEffectiveValue === 'true') {
    selected = true;
  } else if (typeof selectedEffectiveValue === 'boolean') {
    selected = selectedEffectiveValue as boolean;
  }

  function ZSwitchInputSwitchType(): ReactElement {
    const scale = dataAttributes.scale.effectiveValue;
    const style = selected
      ? { backgroundColor: `${selectedColor}`, transform: `scale(${scale})` }
      : { transform: `scale(${scale})` };
    return <Switch checked={selected} disabled style={{ ...style, opacity: 1 }} />;
  }

  function ZSwitchInputCheckboxTickType(): ReactElement {
    const tickStyle = {
      ...styles.tickStyle,
      borderRight: `${size * 0.07}px solid #ffffff`,
      borderBottom: `${size * 0.07}px solid #ffffff`,
      width: `${size / 4}px`,
      height: `${size / 2.5}px`,
    };
    const switchStyle = {
      height: `${size}px`,
      width: `${size}px`,
    };

    return (
      <div key={`checkboxTickOf${props.mRef}`}>
        {selected ? (
          <div
            style={{
              ...switchStyle,
              backgroundColor: `${selectedColor}`,
              border: '2px solid',
              borderColor: `${selectedColor}`,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              verticalAlign: 'middle',
            }}
          >
            <div style={tickStyle} />
          </div>
        ) : (
          <div
            style={{
              ...switchStyle,
              border: '2px solid',
              borderColor: `${deselectedColor}`,
              borderRadius: '50%',
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>
    );
  }

  function ZSwitchInputCheckboxRoundType(): ReactElement {
    const switchStyle = {
      height: `${size}px`,
      width: `${size}px`,
    };
    let subSize = size * 0.8;
    subSize = (size - subSize) % 2 === 0 ? subSize : subSize - 1;
    const selectedSwitchStyle = {
      height: `${subSize}px`,
      width: `${subSize}px`,
      backgroundColor: `${selectedColor}`,
      borderRadius: '50%',
    };
    return (
      <div key={`checkboxRoundOf${props.mRef}`}>
        {selected ? (
          <div
            style={{
              ...switchStyle,
              border: '1px solid',
              borderColor: `${deselectedColor}`,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={selectedSwitchStyle} />
          </div>
        ) : (
          <div
            style={{
              ...switchStyle,
              border: '1px solid',
              borderColor: `${deselectedColor}`,
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    );
  }

  let element;
  switch (dataAttributes.styleType) {
    case SwitchStyleType.SWITCH:
      element = ZSwitchInputSwitchType();
      break;
    case SwitchStyleType.TICK_CHECKBOX:
      element = ZSwitchInputCheckboxTickType();
      break;
    case SwitchStyleType.ROUND_CHECKBOX:
      element = ZSwitchInputCheckboxRoundType();
      break;
    default:
      throw new Error('unsupported switch style type');
  }
  return <div style={styles.container}>{element}</div>;
});

const styles: Record<string, React.CSSProperties> = {
  tickStyle: {
    transform: 'rotate(40deg)',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
