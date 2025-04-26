/* eslint-disable import/no-default-export */
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react';
import { Resizable } from 're-resizable';
import React from 'react';
import ZScrollableDiv from '../components/editor/ZScrollableDiv';
import ComponentAlignmentTab from '../components/side-drawer-tabs/right-drawer/ComponentAlignmentTab';
import ComponentConfigTab from '../components/side-drawer-tabs/right-drawer/ComponentConfigTab';
import ComponentFrameTab from '../components/side-drawer-tabs/right-drawer/ComponentFrameTab';
import useLocalizedComponentModelType from '../hooks/useLocalizedComponentModelType';
import useModel from '../hooks/useModel';
import useStores from '../hooks/useStores';
import { DEFAULT_DRAWER_WIDTH, RIGHT_DRAWER_KEY } from '../mobx/stores/EditorStore';
import Cross from '../shared/assets/icons/cross.svg';
import { NullableReactElement, ShortId } from '../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../utils/ZConst';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import ZCustomComponentTab from '../components/ZCustomComponentTab';
import ComponentNameConfigRow from '../components/side-drawer-tabs/right-drawer/config-row/ComponentNameConfigRow';
import useUserFlowTrigger, { UserFlow } from '../hooks/useUserFlowTrigger';
import LeftDrawerButton from '../components/side-drawer-tabs/left-drawer/shared/LeftDrawerButton';
import commonI18n from '../components/side-drawer-tabs/right-drawer/mobile-config-tab/CommonConfigTab.i18n.json';

import useLocale from '../hooks/useLocale';
import ComponentInputOutTab from '../components/side-drawer-tabs/right-drawer/ComponentInputOutTab';
import useIsDeveloperMode from '../hooks/useIsDeveloperMode';

export default function ZRightDrawer(): NullableReactElement {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const localizeModelType = useLocalizedComponentModelType();
  const uft = useUserFlowTrigger();
  const isDeveloperMode = useIsDeveloperMode();
  const { editorStore } = useStores();
  const rightDrawerTarget = useObserver(() => editorStore.rightDrawerTarget);
  const rightDrawerWidth = useObserver(
    () => editorStore.drawerTabWidth.get(RIGHT_DRAWER_KEY) ?? DEFAULT_DRAWER_WIDTH
  );
  const model = useModel(rightDrawerTarget ?? '');
  if (!model) return null;

  const openRightDrawer = (mRef: ShortId): void => {
    editorStore.rightDrawerTarget = mRef;
  };
  const closeRightDrawer = (): void => {
    editorStore.rightDrawerTarget = null;
  };

  // children components
  const renderBackButton = () => (
    <ArrowLeftOutlined style={styles.arrowIcon} onClick={() => openRightDrawer(model.parentMRef)} />
  );
  const renderTitleComponent = () => (
    <div style={styles.titleContainer}>
      {model.parentMRef ? renderBackButton() : null}
      <label style={styles.titleText}>{localizeModelType(model.type)}</label>
      <div style={styles.crossContainer} onClick={closeRightDrawer}>
        <img alt="" style={styles.crossIcon} src={Cross} />
      </div>
    </div>
  );
  const renderFrameTabComponent = () => {
    if (model.type === ComponentModelType.CONDITIONAL_CONTAINER_CHILD) return <></>;
    return <ComponentFrameTab mRef={model.mRef} />;
  };

  const renderCustomComponentTab = () =>
    model.canCreateComponentTemplate() &&
    !model.isRootContainer && <ZCustomComponentTab componentModel={model} />;

  const renderDeleteButton = () =>
    model.hasDeleteConfiguration() ? (
      <LeftDrawerButton
        type="primary"
        text={commonContent.label.delete}
        handleOnClick={() => uft(UserFlow.DELETE_SELECTED)(model.mRef)}
      />
    ) : null;

  return (
    <Resizable
      enable={{ left: true }}
      style={styles.container}
      size={{ width: rightDrawerWidth, height: 'auto' }}
      onResizeStop={(_event, _direction, _elementRef, delta) => {
        editorStore.drawerTabWidth.set(RIGHT_DRAWER_KEY, rightDrawerWidth + delta.width);
      }}
    >
      <ZScrollableDiv innerStyle={styles.innerContainer} maxHeightPercent={0.9}>
        {renderTitleComponent()}
        <ComponentAlignmentTab mRef={model.mRef} />
        {renderFrameTabComponent()}
        <ComponentNameConfigRow model={model} />
        {isDeveloperMode && (
          <>
            {renderCustomComponentTab()}
            <ComponentInputOutTab mRef={model.mRef} />
          </>
        )}
        <ComponentConfigTab mRef={model.previewMRef} />
        {renderDeleteButton()}
      </ZScrollableDiv>
    </Resizable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: '82px',
    right: '24px',
    height: 'auto',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZColors.BACKGROUND_WITH_OPACITY_RIGHT_DRAWER,
    backdropFilter: 'blur(16px)',
    overflow: 'hidden',
  },
  innerContainer: {
    padding: '20px 24.5px',
  },
  separator: {
    marginBottom: '20px',
  },
  titleContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%',
    height: '24px',
  },
  arrowIcon: {
    marginRight: '10px',
    color: ZThemedColors.PRIMARY_TEXT,
  },
  titleText: {
    flex: 1,
    color: ZThemedColors.ACCENT,
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'start',
    verticalAlign: 'center',
  },
  crossContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
  },
  collapse: {
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    border: '0px',
    marginTop: '20px',
    marginBottom: '10PX',
  },
  panel: {
    border: '0px',
    borderRadius: '6px',
  },
};
