/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import { useDrag } from 'react-dnd';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { ComponentTemplate } from '../../mobx/stores/CoreStoreDataType';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import ZDndType, { getDndTypeByComponentModelType } from './ZDndTypes';

interface Props {
  componentType: ComponentModelType;
  componentName: string;
  componentTemplate?: ComponentTemplate;
  dragSourceComponet: React.ReactElement;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function ZDraggableBox(props: Props): ReactElement {
  const { componentType, componentName, componentTemplate, dragSourceComponet } = props;

  const uft = useSelectionTrigger();
  const dndType: ZDndType = getDndTypeByComponentModelType(componentType);
  const [{ isDragging }, drag] = useDrag({
    item: { componentType, componentName, componentTemplate, type: dndType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: () => {
      uft(UserFlow.DRAG_DESELECTED)();
    },
  });

  const renderOnDragging = () => (
    // TODO: FZM-713 - improve how components are rendered being on-dragging
    <div style={styles.dragging}>{dragSourceComponet}</div>
  );
  return (
    <div style={props.style} onClick={props.onClick}>
      {drag(isDragging ? renderOnDragging() : dragSourceComponet)}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dragging: {
    opacity: 0.4,
  },
};
