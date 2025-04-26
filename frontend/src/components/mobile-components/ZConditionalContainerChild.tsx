/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React from 'react';
import useModel from '../../hooks/useModel';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import ConditionalContainerModel from '../../models/mobile-components/ConditionalContainerModel';
import { MRefProp } from './PropTypes';
import { EventBinding } from '../../shared/type-definition/EventBinding';

export const ZConditionalContainerChildDefaultReferenceAttributes = {
  clickActions: [] as EventBinding[],
};

export const ZConditionalContainerChildDefaultDataAttributes = {
  ...ZConditionalContainerChildDefaultReferenceAttributes,
};

export type ConditionalContainerChildAttributes =
  typeof ZConditionalContainerChildDefaultDataAttributes;

export default observer(function ZConditionalContainerChild(props: MRefProp) {
  const model = useModel<ConditionalContainerModel>(props.mRef);
  if (!model) return null;

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

  return <div style={styles.container}>{model.children().map(renderChild)}</div>;
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  childComponentContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
};
