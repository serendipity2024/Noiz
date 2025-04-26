/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React, { ReactElement } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { head } from 'lodash';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { ZThemedColors } from '../../utils/ZConst';

export default function ZContextMenu(): ReactElement {
  return (
    <>
      <ContextMenu id="no-menu">
        <div />
      </ContextMenu>
      <ContextMenu id="screen-menu">
        <ScreenContextMenu />
      </ContextMenu>
      {/* other context-menus */}
    </>
  );
}

function ScreenContextMenu() {
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();
  const target = useObserver(() => head(editorStore.selectedTargets));
  if (!target) return null;

  const handleOnEdit = () => uft(UserFlow.SELECT_TARGET)(target);
  return (
    <MenuItem>
      <div style={styles.menuItem}>
        <span style={styles.menuText} onClick={handleOnEdit}>
          Edit
        </span>
      </div>
    </MenuItem>
  );
}

const styles: Record<string, React.CSSProperties> = {
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 12px',
    width: '100px',
    height: '30px',
    backgroundColor: ZThemedColors.PRIMARY,
    cursor: 'pointer',
  },
  menuText: {
    color: ZThemedColors.ACCENT,
  },
};
