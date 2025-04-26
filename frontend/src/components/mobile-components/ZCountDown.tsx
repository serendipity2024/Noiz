/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding, DataBindingKind } from '../../shared/type-definition/DataBinding';
import { IntegerType } from '../../shared/type-definition/DataModel';
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

export enum UnitOfTime {
  SECOND = 's',
  MILLISCEOND = 'ms',
}

export const ZCountDownDefaultReferenceAttributes = {
  millisFromStart: DataBinding.withLiteral(60000, IntegerType.INTEGER),
  prefixTitle: DataBinding.withTextVariable([
    {
      kind: DataBindingKind.LITERAL,
      value: 'T-',
    },
  ]),
  suffixTitle: DataBinding.withTextVariable([
    {
      kind: DataBindingKind.LITERAL,
      value: 's',
    },
  ]),
  onTimeUpActions: [] as EventBinding[],
  eventListeners: [] as EventListener[],
};

export const ZCountDownDefaultDataAttributes = {
  ...ZCountDownDefaultReferenceAttributes,
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.GREY),
  color: DataBinding.withColor(ZColors.WHITE),
  ...TextStyleDefaultDataAttributes,
  textAlign: DataBinding.withLiteral('center'),
  fontSize: DataBinding.withLiteral(13, IntegerType.INTEGER),
  displayUnitOfTime: UnitOfTime.SECOND as UnitOfTime,
  step: 1000,
  invisible: false,
};

export type CountDownAttributes = typeof ZCountDownDefaultDataAttributes;

export const ZCountDownDefaultFrame: ZFrame = {
  size: { width: 90, height: 40 },
  position: { x: 0, y: 0 },
};

export interface EventListener {
  id: string;
  millisUntilExpiry: DataBinding;
  actions: EventBinding[];
}

export default observer(function ZCountDown(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataAttributes = model.dataAttributes as CountDownAttributes;
  const configuredStyle = {
    backgroundColor: cb(dataAttributes.backgroundColor),
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const textStyle: React.CSSProperties = {
    ...styles.text,
    color: cb(dataAttributes.color),
    ...prepareTextStyles(dataAttributes, cb),
  };

  const renderTitle = () => {
    let time = dataAttributes.millisFromStart.effectiveValue;
    switch (dataAttributes.displayUnitOfTime) {
      case UnitOfTime.SECOND: {
        time /= 1000;
        break;
      }
      default:
        break;
    }
    const title = `${dataAttributes.prefixTitle.effectiveValue}${time}${dataAttributes.suffixTitle.effectiveValue}`;
    return <label style={textStyle}>{title}</label>;
  };

  return (
    <div
      style={{
        ...styles.container,
        ...configuredStyle,
        ...(dataAttributes.invisible ? { visibility: 'hidden' } : {}),
      }}
    >
      {renderTitle()}
    </div>
  );
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
