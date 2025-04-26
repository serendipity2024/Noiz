/* eslint-disable import/no-default-export */
import 'antd/dist/antd.css';
import { useObserver } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { Z_DRAG_SELECTABLE_CONTAINER } from '../components/editor/ZDragSelectable';
import ZDragSelectMovable from '../components/editor/ZDragSelectMovable';
import useModel from '../hooks/useModel';
import useStores from '../hooks/useStores';
import useWindowSize from '../hooks/useWindowSize';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import './ZBoard.scss';
import { ZMoveableClassName } from '../utils/ZConst';

export default function ZFocusBoard(): NullableReactElement {
  const { width, height } = useWindowSize();
  const { editorStore } = useStores();
  const focusedTarget = useObserver(() => editorStore.editorState.target);
  const target = useModel(focusedTarget ?? '');

  if (!target || !target.shouldFullyFocus()) return null;

  return (
    <div style={{ ...styles.container, width, height }}>
      <ZDragSelectMovable />
      <div
        className={`${Z_DRAG_SELECTABLE_CONTAINER} ${ZMoveableClassName.SELECTO_CONTAINER}_${focusedTarget}`}
        style={styles.content}
      >
        {target.renderForFocusView()}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  content: {
    zIndex: 1,
  },
};
