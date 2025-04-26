/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import ModalViewModel from '../../models/mobile-components/ModalViewModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { ZColors } from '../../utils/ZConst';
import {
  BorderStyleDefaultDataAttributes,
  prepareBorderStyles,
} from '../side-drawer-tabs/right-drawer/config-row/BorderStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZModalViewDefaultDataAttributes = {
  ...BorderStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.WHITE_LIKE_GREY),
  closeOnClickOverlay: false,
};

export type ModalViewAttributes = typeof ZModalViewDefaultDataAttributes;

export const ZModalViewDefaultFrame: ZFrame = {
  size: { width: 265, height: 151 },
  position: { x: 55, y: 258 },
};

export default observer(function ZModalView(props: MRefProp) {
  const cb = useColorBinding();
  const model = useModel<ModalViewModel>(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as ModalViewAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const configuredStyle = prepareBorderStyles(dataAttributes, cb);

  const renderChild = (component: BaseComponentModel) => {
    const style: React.CSSProperties = {
      left: component.getComponentFrame().position?.x,
      top: component.getComponentFrame().position?.y,
      width: component.getComponentFrame().size.width,
      height: component.getComponentFrame().size.height,
      ...styles.childComponentContainer,
    };
    return (
      <div key={component.mRef} style={style}>
        {component.renderForPreview()}
      </div>
    );
  };

  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
      {model.children().map(renderChild)}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  childComponentContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
};
