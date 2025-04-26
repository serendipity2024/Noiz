/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import useShowDataBinding from '../../hooks/useShowDataBinding';
import WebButtonModel from '../../models/web-components/WebButtonModel';
import ZGridLayout from '../../models/interfaces/GridLayout';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import { MRefProp } from '../mobile-components/PropTypes';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import {
  TextStyleDefaultDataAttributes,
  prepareTextStyles,
} from '../side-drawer-tabs/right-drawer/config-row/TextStyleConfigRow';

export const ZWebButtonDefaultDataAttributes = {
  ...TextStyleDefaultDataAttributes,
  ...CombinedStyleDefaultDataAttributes,
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Button' }]),
  backgroundColor: DataBinding.withColor(ZColors.LIGHT_BLUE),
  clickActions: [] as EventBinding[],
  color: DataBinding.withColor(ZColors.WHITE),
  textAlign: DataBinding.withLiteral('center'),
};

export type WebButtonAttributes = typeof ZWebButtonDefaultDataAttributes;

export const ZWebButtonDefaultGridLayout: ZGridLayout = {
  x: 0,
  y: 0,
  w: 2,
  h: 1,
};

export default observer(function ZWebButton(props: MRefProp) {
  const cb = useColorBinding();
  const showDataBinding = useShowDataBinding();
  const model = useModel<WebButtonModel>(props.mRef);
  if (!model) return null;

  // styles
  const { dataAttributes } = model;
  const configuredStyle = {
    backgroundColor: cb(dataAttributes.backgroundColor),
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const textStyle: React.CSSProperties = {
    ...styles.label,
    color: cb(dataAttributes.color),
    ...prepareTextStyles(dataAttributes, cb),
  };

  const renderTitle = () => {
    const title = showDataBinding(dataAttributes.title);
    return <label style={textStyle}>{title}</label>;
  };

  return <div style={{ ...styles.contanier, ...configuredStyle }}>{renderTitle()}</div>;
});

const styles: Record<string, React.CSSProperties> = {
  contanier: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    overflow: 'hidden',
  },
};
