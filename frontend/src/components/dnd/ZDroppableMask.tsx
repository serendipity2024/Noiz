/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import { useDrop } from 'react-dnd';
import useViewport from '../../hooks/useViewport';
import StoreHelpers from '../../mobx/StoreHelpers';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import ZDndType from './ZDndTypes';
import { ZNavigationBarArea } from './ZNavigationBarArea';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ComponentModelType from '../../shared/type-definition/ComponentModelType';

interface Props {
  item: BaseComponentModel;
}

export default function ZDroppableMask(props: Props): ReactElement {
  const viewport = useViewport();
  const accept = StoreHelpers.containerIsList(props.item as BaseContainerModel)
    ? [ZDndType.CONTENT]
    : [ZDndType.CONTENT, ZDndType.LIST_CONTAINER];
  const [, dropptableRef] = useDrop({ accept });

  const renderComponent = (component: BaseComponentModel) =>
    component.type === ComponentModelType.WECHAT_NAVIGATION_BAR ||
    component.type === ComponentModelType.MOBILE_NAVIGATION_BAR ? (
      <ZNavigationBarArea key={component.mRef} componentModel={component} />
    ) : (
      <ZComponentSelectionWrapper key={component.mRef} component={component} draggable>
        {component.renderForPreview()}
      </ZComponentSelectionWrapper>
    );

  return (
    <div ref={dropptableRef} style={styles.container}>
      <div style={{ ...viewport, overflow: 'hidden' }}>{renderComponent(props.item)}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
};
