/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import {
  prepareTextStyles,
  TextStyleDefaultDataAttributes,
} from '../side-drawer-tabs/right-drawer/config-row/TextStyleConfigRow';
import { MRefProp } from './PropTypes';
import useShowDataBinding from '../../hooks/useShowDataBinding';

export const ZButtonDefaultReferenceAttributes = {
  title: DataBinding.withTextVariable([{ kind: DataBindingKind.LITERAL, value: 'Button' }]),
  clickActions: [] as EventBinding[],
};

export const ZButtonDefaultDataAttributes = {
  ...ZButtonDefaultReferenceAttributes,
  ...TextStyleDefaultDataAttributes,
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.LIGHT_BLACK),
  color: DataBinding.withColor(ZColors.WHITE),
  textAlign: DataBinding.withLiteral('center'),
};

export type ButtonAttributes = typeof ZButtonDefaultDataAttributes;

export const ZButtonDefaultFrame: ZFrame = {
  size: { width: 80, height: 40 },
  position: { x: 0, y: 0 },
};

export default observer(function ZButton(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel(props.mRef);

  const showDataBinding = useShowDataBinding();
  if (!model) return null;

  const dataAttributes = model.dataAttributes as ButtonAttributes;

  const configuredStyle = {
    backgroundColor: cb(dataAttributes.backgroundColor),
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const textStyle: React.CSSProperties = {
    ...styles.text,
    color: cb(dataAttributes.color),
    ...prepareTextStyles(dataAttributes, cb),
  };

  // render children components
  const renderTitle = () => {
    const title = showDataBinding(dataAttributes.title);
    return <label style={textStyle}>{title}</label>;
  };

  return <div style={{ ...styles.container, ...configuredStyle }}>{renderTitle()}</div>;
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  text: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
};
