/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  prepareTextStyles,
  TextStyleDefaultDataAttributes,
} from '../side-drawer-tabs/right-drawer/config-row/TextStyleConfigRow';
import { MRefProp } from './PropTypes';
import useShowDataBinding from '../../hooks/useShowDataBinding';

export const ZTextDefaultReferenceAttributes = {
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Text' }]),
  clickActions: [] as EventBinding[],
};

export const ZTextDefaultDataAttributes = {
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  color: DataBinding.withColor(ZColors.BLACK),
  ...TextStyleDefaultDataAttributes,
  ...ZTextDefaultReferenceAttributes,
};

export type TextAttributes = typeof ZTextDefaultDataAttributes;

export const ZTextDefaultFrame: ZFrame = {
  size: { width: 120, height: 25 },
  position: { x: 0, y: 0 },
};

export default observer(function ZText(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  const showDataBinding = useShowDataBinding();
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as TextAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const textStyle = {
    ...styles.text,
    color: cb(dataAttributes.color),
    ...prepareTextStyles(dataAttributes, cb),
  };
  const position: CSSProperties = dataAttributes.multiLine.effectiveValue
    ? { justifyContent: 'flex-start' }
    : { justifyContent: 'center' };

  // value
  const title = showDataBinding(dataAttributes.title);
  return (
    <div style={{ backgroundColor, ...styles.container, ...position }}>
      <label style={textStyle}>
        {title.split('\n').map((s: string, index: number) => (
          <div style={textStyle} key={s}>
            {index !== 0 && <br />}
            {s}
          </div>
        ))}
      </label>
    </div>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  text: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    overflow: 'hidden',
  },
};
