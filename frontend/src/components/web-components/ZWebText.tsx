/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  prepareTextStyles,
  TextStyleDefaultDataAttributes,
} from '../side-drawer-tabs/right-drawer/config-row/TextStyleConfigRow';
import { MRefProp } from '../mobile-components/PropTypes';
import useShowDataBinding from '../../hooks/useShowDataBinding';
import ZGridLayout from '../../models/interfaces/GridLayout';

export const ZWebTextDefaultDataAttributes = {
  ...TextStyleDefaultDataAttributes,
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Text' }]),
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  color: DataBinding.withColor(ZColors.BLACK),
  clickActions: [] as EventBinding[],
};

export type WebTextAttributes = typeof ZWebTextDefaultDataAttributes;

export const ZWebTextDefaultGridLayout: ZGridLayout = {
  x: 0,
  y: 0,
  w: 2,
  h: 1,
};

export default observer(function ZWebText(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  const showDataBinding = useShowDataBinding();
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as WebTextAttributes;
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
        {title.split('\n').map((item: string, index: number) => (
          <div key={item}>
            {index !== 0 && <br />}
            {item}
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
