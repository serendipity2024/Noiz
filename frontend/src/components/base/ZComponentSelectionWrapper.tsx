/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement, ReactNode } from 'react';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import { ZMoveableClassName } from '../../utils/ZConst';
import { Z_DRAG_SELECTABLE_TARGET } from '../editor/ZDragSelectable';
import { TabViewAttributes, TabViewMode } from '../mobile-components/ZTabView';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import useModel from '../../hooks/useModel';

interface Props {
  children: ReactNode;
  component: BaseComponentModel;
  clickable?: boolean;
  draggable?: boolean;
}

export default observer(function ZComponentSelectionWrapper(props: Props): ReactElement {
  const { children, component, draggable } = props;
  const clickable = props.clickable ?? true;

  const { editorStore } = useStores();
  const uft = useSelectionTrigger();
  const isSelected = editorStore.selectedTargets.includes(component.mRef);
  const { target } = editorStore.editorState;

  const handleOnDoubleClick = () => {
    if (!clickable) return;
    if (component.hasFocusMode() && component.mRef !== target)
      uft(UserFlow.FOCUS_TARGET)(component.mRef);
  };

  // Hack tab component
  const tabContainer = useModel(
    (component.dataAttributes as TabViewAttributes).normalTabMRef ?? ''
  );

  const tabHeight =
    ((component.dataAttributes as TabViewAttributes).mode === TabViewMode.CUSTOM
      ? tabContainer?.getComponentFrame().size?.height
      : (component.dataAttributes as TabViewAttributes).tabHeight) ?? 0;
  const componentSize = component.getComponentFrame().size;

  const computedSize = {
    ...componentSize,
    ...(component.type === ComponentModelType.TAB_VIEW
      ? {
          height: componentSize.height + tabHeight,
        }
      : {}),
  };

  return draggable ? (
    <div
      id={component.mRef}
      className={`${Z_DRAG_SELECTABLE_TARGET} ${ZMoveableClassName.DRAGGABLE} ${
        clickable ? ZMoveableClassName.SELECTABLE : ''
      } ${isSelected ? ZMoveableClassName.SELECTED : ''}`}
      style={{
        position: 'absolute',
        ...computedSize,
        left: component.getComponentFrame().position.x,
        top: component.getComponentFrame().position.y,
      }}
    >
      <div
        className={`${ZMoveableClassName.SNAPPABLE} ${ZMoveableClassName.SNAPPABLE}_${component.mRef}`}
        style={{ height: '100%', width: '100%' }}
        onDoubleClick={handleOnDoubleClick}
      >
        {children}
      </div>
    </div>
  ) : (
    <div
      id={component.mRef}
      className={`${clickable ? ZMoveableClassName.SELECTABLE : ''} ${
        isSelected ? ZMoveableClassName.SELECTED : ''
      }`}
      style={{ ...computedSize }}
    >
      <div
        className={`${ZMoveableClassName.SNAPPABLE} ${ZMoveableClassName.SNAPPABLE}_${component.mRef}`}
        style={{ height: '100%', width: '100%' }}
        onDoubleClick={handleOnDoubleClick}
      >
        {children}
      </div>
    </div>
  );
});
