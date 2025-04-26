/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import { MRefProp } from './PropTypes';

const ZIconFont = React.lazy(() => import('../editor/ZIconFont'));

export const ZIconDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZIconDefaultDataAttributes = {
  icon: 'icon-chat',
  fontSize: 26,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  color: DataBinding.withColor(ZColors.BLACK),
  ...ZIconDefaultReferenceAttributes,
};

export type IconAttributes = typeof ZIconDefaultDataAttributes;

export const ZIconDefaultFrame: ZFrame = {
  size: { width: 50, height: 50 },
  position: { x: 0, y: 0 },
};

export default observer(function ZIcon(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as IconAttributes;
  const color = cb(dataAttributes.color);
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const { icon, fontSize } = dataAttributes;
  return (
    <div style={{ ...styles.container, backgroundColor }}>
      <ZIconFont type={icon} style={{ color, fontSize }} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};
