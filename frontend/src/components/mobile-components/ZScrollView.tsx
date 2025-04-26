/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import ScrollViewModel from '../../models/mobile-components/ScrollViewModel';
import ZFrame from '../../models/interfaces/Frame';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import { MRefProp } from './PropTypes';

export const ZScrollViewDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  hasScrollX: true,
  hasScrollY: true,
  showVerticalIndicator: true,
  showHorizontalIndicator: true,
};

export type ScrollViewAttributes = typeof ZScrollViewDefaultDataAttributes;

export const ZScrollViewDefaultFrame: ZFrame = {
  size: { width: 280, height: 180 },
  position: { x: 0, y: 0 },
};

export default observer(function ZScrollView(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel<ScrollViewModel>(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as ScrollViewAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };
  function renderChildComponent(component: BaseComponentModel) {
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
  }

  return (
    <div style={styles.resizable}>
      <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
        {model.children().map(renderChildComponent)}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  resizable: {
    overflow: 'hidden',
  },
  container: {
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
