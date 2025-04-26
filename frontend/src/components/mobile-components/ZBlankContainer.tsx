/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import BlankContainerModel from '../../models/mobile-components/BlankContainerModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { DecimalType } from '../../shared/type-definition/DataModel';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  BorderStyleDefaultDataAttributes,
  prepareBorderStyles,
} from '../side-drawer-tabs/right-drawer/config-row/BorderStyleConfigRow';
import ZDroppableArea from '../dnd/ZDroppableArea';
import BaseComponentModel from '../../models/base/BaseComponentModel';

export const ZBlankContainerDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZBlankContainerDefaultDataAttributes = {
  ...BorderStyleDefaultDataAttributes,
  ...ZBlankContainerDefaultReferenceAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT_LIKE_GREY),
  borderRadius: DataBinding.withLiteral(0, DecimalType.FLOAT8),
};

export type BlankContainerAttributes = typeof ZBlankContainerDefaultDataAttributes;

export interface Prop {
  mRef: ShortId;
  style?: CSSProperties;
  droppable?: boolean;
}

export default observer(function ZBlankContainer(props: Prop) {
  const cb = useColorBinding();
  const model = useModel<BlankContainerModel>(props.mRef);
  if (!model) return null;

  const { dataAttributes } = model;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const droppable = props.droppable ?? false;

  const configuredStyle = {
    ...prepareBorderStyles(dataAttributes, cb),
    overflow: droppable ? 'visible' : 'hidden',
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
        ...configuredStyle,
        backgroundColor,
      }}
    >
      {droppable ? <ZDroppableArea mRef={model.mRef} /> : model.children().map(renderChild)}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  childComponentContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
};
