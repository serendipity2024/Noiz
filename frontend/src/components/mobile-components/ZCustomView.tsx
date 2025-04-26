/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import CustomViewModel from '../../models/mobile-components/CustomViewModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding, FoldingMode } from '../../shared/type-definition/EventBinding';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';
import { getBackgroundStyle } from '../side-drawer-tabs/right-drawer/config-row/BackgroundConfigRow';
import { getOutterStyle } from '../dnd/ZDroppableArea';
import { useMediaUrl } from '../../hooks/useMediaUrl';

export enum HorizontalLocation {
  LEFT = 'left',
  RIGHT = 'right',
}

export const ZCustomViewDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZCustomViewDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...ZCustomViewDefaultReferenceAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  hasScrollX: false,
  hasScrollY: false,
  foldingMode: FoldingMode.NONE,
  foldingHeight: 0,
};

export type CustomViewAttributes = typeof ZCustomViewDefaultDataAttributes;

export const ZCustomViewDefaultFrame: ZFrame = {
  size: { width: 265, height: 150 },
  position: { x: 0, y: 0 },
};

export default observer(function ZCustomView(props: MRefProp) {
  const cb = useColorBinding();
  const umu = useMediaUrl();
  const model = useModel<CustomViewModel>(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as CustomViewAttributes;
  const backgroundStyles = getBackgroundStyle(model.dataAttributes, cb, umu);
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
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
    <div
      style={{
        ...styles.container,
        ...getOutterStyle(model, backgroundStyles),
        ...configuredStyle,
      }}
    >
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
