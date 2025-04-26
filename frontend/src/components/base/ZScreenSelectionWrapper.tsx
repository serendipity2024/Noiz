/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React, { ReactElement, ReactNode } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { head } from 'lodash';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { EditorMode } from '../../models/interfaces/EditorInfo';
import { ShortId } from '../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../utils/ZConst';

interface Props {
  mRef: ShortId;
  children: ReactNode;
  style?: React.CSSProperties;
}

// TODO: FZM-700 - do not scale selection indicator
export default function ZScreenSelectionWrapper(props: Props): ReactElement {
  const { mRef, style } = props;
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();
  const editorState = useObserver(() => editorStore.editorState);
  const selected = useObserver(() => head(editorStore.selectedTargets) === mRef);

  const isFocusMode = editorState.mode === EditorMode.FOCUS;
  const shouldFade = isFocusMode && editorState.target !== mRef;

  const onSingleClick = () => {
    if (!isFocusMode && !selected) uft(UserFlow.SELECT_TARGET)(mRef);
  };
  const onDoubleClick = () => {
    if (!isFocusMode) uft(UserFlow.FOCUS_TARGET)(mRef);
  };

  const renderSelectionOverlay = () => {
    const isHighlighted = selected || (isFocusMode && editorState.target === mRef);
    return (
      <div
        style={{
          ...styles.selectionIndicator,
          ...(isHighlighted ? styles.selected : null),
        }}
      />
    );
  };

  return (
    <div
      style={{ ...styles.container, ...(shouldFade ? styles.fadeAway : null) }}
      onClick={onSingleClick}
      onDoubleClick={onDoubleClick}
    >
      {/* TODO: FZM-758 - set up the context-menu usage properly */}
      <ContextMenuTrigger id="no-menu">
        <div style={{ ...styles.childrenContainer, ...style }}>{props.children}</div>
        {renderSelectionOverlay()}
      </ContextMenuTrigger>
    </div>
  );
}

export const WRAPPER_PADDING_SIZE = 22;
export const WRAPPER_BORDER_WIDTH = 2;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${WRAPPER_PADDING_SIZE}px`,
    zIndex: 100,
  },
  fadeAway: {
    zIndex: 0,
  },
  selectionIndicator: {
    position: 'absolute',
    top: `${WRAPPER_BORDER_WIDTH}px`,
    bottom: `${WRAPPER_BORDER_WIDTH}px`,
    left: `${WRAPPER_BORDER_WIDTH}px`,
    right: `${WRAPPER_BORDER_WIDTH}px`,
    border: `${WRAPPER_BORDER_WIDTH}px`,
    borderStyle: 'solid',
    borderColor: ZColors.TRANSPARENT,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    padding: `${WRAPPER_PADDING_SIZE - WRAPPER_BORDER_WIDTH}px`,
    backgroundColor: ZColors.TRANSPARENT,
  },
  selected: {
    borderColor: ZThemedColors.ACCENT_HIGHLIGHT,
    backgroundColor: ZThemedColors.ACCENT_HIGHLIGHT_WITH_OPACITY,
  },
  childrenContainer: {
    position: 'relative',
  },
};
