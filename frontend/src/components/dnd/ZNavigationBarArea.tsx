import { transaction } from 'mobx';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { AllStores } from '../../mobx/StoreContexts';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import { EditorMode, LeftDrawerKey } from '../../models/interfaces/EditorInfo';
import { DefaultAppBarHeight, ZMoveableClassName } from '../../utils/ZConst';

interface ZNavigationBarArea {
  componentModel: BaseComponentModel;
}

export const ZNavigationBarArea = observer((props: ZNavigationBarArea): ReactElement => {
  const { componentModel } = props;

  const openRightDrawer = (): void => {
    if (AllStores.editorStore.editorState.mode !== EditorMode.FOCUS) return;
    const childMRef = componentModel.mRef;
    if (childMRef) {
      AllStores.editorStore.rightDrawerTarget = childMRef;
    }
  };

  const handleOnDoubleClick = (): void => {
    if (componentModel.hasFocusMode()) {
      transaction(() => {
        AllStores.editorStore.selectedTargets = [];
        AllStores.editorStore.selectedLeftDrawerKey = LeftDrawerKey.ADD_COMPONENT;
        AllStores.editorStore.setEditorState({
          mode: EditorMode.FOCUS,
          target: componentModel.mRef,
        });
      });
    }
  };

  return (
    <div className={`${ZMoveableClassName.SNAPPABLE}`} style={styles.header}>
      <div onClick={() => openRightDrawer()} onDoubleClick={() => handleOnDoubleClick()}>
        {componentModel.renderForPreview()}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: '100%',
    height: DefaultAppBarHeight,
    borderTopRightRadius: '5px',
    borderTopLeftRadius: '5px',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 100,
  },
};
