/* eslint-disable import/no-default-export */
import React from 'react';
import Selecto from 'react-selecto';
import { observer } from 'mobx-react';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZMoveableClassName } from '../../utils/ZConst';

export const Z_DRAG_SELECTABLE_CONTAINER = 'ZDragSelectable-container';
export const Z_DRAG_SELECTABLE_TARGET = 'ZDragSelectable-target';

export default observer(function ZDragSelectable(): NullableReactElement {
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();
  const editorTarget = editorStore.editorState.target;

  return editorTarget ? (
    <Selecto
      dragContainer={`.${Z_DRAG_SELECTABLE_CONTAINER}`}
      selectableTargets={[
        `.${ZMoveableClassName.SELECTO_CONTAINER}_${editorTarget} .${ZMoveableClassName.SELECTABLE}`,
      ]}
      hitRate={0}
      selectFromInside={false}
      toggleContinueSelect="meta"
      onSelect={(e) => {
        uft(UserFlow.DRAG_SELECTED_TARGETS)(e.selected.map((item) => item.id));
      }}
    />
  ) : null;
});
