/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React, { ReactElement } from 'react';
import { Z_DRAG_SELECTABLE_CONTAINER } from '../components/editor/ZDragSelectable';
import { useScreenMRefs } from '../hooks/useScreenModels';
import useStores from '../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../hooks/useUserFlowTrigger';
import { ZColors, ZThemedColors } from '../utils/ZConst';

export default function ZBoardOverlay(): ReactElement {
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();
  const screenMRefs = useScreenMRefs();
  const screenMRefset = useObserver(() => new Set(screenMRefs));
  const isScreenFocused = useObserver(
    () => editorStore.inFocusMode && screenMRefset.has(editorStore.editorState.target ?? '')
  );
  const isHandToolOn = useObserver(() => editorStore.isHandToolOn);

  const handleSingleClick = () => {
    uft(UserFlow.DESELECT)();
    uft(UserFlow.DRAG_DESELECTED)();
  };
  const handleDoubleClick = () => uft(UserFlow.DEFOCUS)();

  const style = { ...styles.container, ...(isScreenFocused ? styles.focused : null) };
  return (
    <>
      <div
        className={Z_DRAG_SELECTABLE_CONTAINER}
        style={style}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
      />
      {isHandToolOn && <div style={styles.boardCover} />}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    backgroundColor: ZColors.TRANSPARENT,
    zIndex: 0,

    // TODO: FZM-710 - optimize this to use a smart way
    top: -100000,
    bottom: -100000,
    left: -100000,
    right: -100000,
  },
  focused: {
    opacity: 0.9,
    backgroundColor: ZThemedColors.SECONDARY,
  },
  boardCover: {
    position: 'fixed',
    backgroundColor: ZColors.TRANSPARENT,
    zIndex: 100,

    // TODO: FZM-710 - optimize this to use a smart way
    top: -100000,
    bottom: -100000,
    left: -100000,
    right: -100000,
  },
};
