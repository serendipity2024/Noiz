/* eslint-disable import/no-default-export */
import { detect } from 'detect-browser';
import { isMobile } from 'is-mobile';
import { useObserver } from 'mobx-react';
import React, { ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { GlobalHotKeys } from 'react-hotkeys';
import { useHistory } from 'react-router-dom';
import ZContextMenu from '../components/editor/ZContextMenu';
import ZHeadUpDisplay from '../components/editor/ZHeadUpDisplay';
import ZPageTitle from '../components/editor/ZPageTitle';
import ZZionLogo from '../components/editor/ZZionLogo';
import { ZActionFlowConfigModal } from '../components/ZActionFlowConfigModal';
import ZCollaborationView from '../components/ZCollaborationView';
import ZDiffValidationView from '../components/ZDiffValidationView';
import { ZLeftSideBar } from '../components/ZLeftSideBar';
import ZProjectActionBar from '../components/ZProjectActionBar';
import ZBoard from '../containers/ZBoard';
import ZLeftDrawer from '../containers/ZLeftDrawer';
import ZRightDrawer from '../containers/ZRightDrawer';
import { VariableContext } from '../context/VariableContext';
import { CollaboratorType } from '../graphQL/__generated__/globalTypes';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useProjectDetails from '../hooks/useProjectDetails';
import useStores from '../hooks/useStores';
import useSubscriptionForCollaboration from '../hooks/useSubscriptionForCollaboration';
import useSubscriptionForProjectAuditStatus from '../hooks/useSubscriptionForProjectAuditStatus';
import useSubscriptionOnProjectDelete from '../hooks/useSubscriptionForProjectDelete';
import useSubscriptionForProjectStatus from '../hooks/useSubscriptionForProjectStatus';
import useSubscriptionForWechatConfig from '../hooks/useSubscriptionForWechatConfig';
import useUserFlowTrigger, { UserFlow } from '../hooks/useUserFlowTrigger';
import { AllStores } from '../mobx/StoreContexts';
import { DefaultProjectName } from '../mobx/stores/ProjectStore';
import HotKeyMap from '../utils/HotKeyMap';
import { ZThemedColors } from '../utils/ZConst';
import { ZShowOnceOnBoardingIntro } from '../components/editor/show-once-components/ZOnboarding';
import { FloatingButtons } from '../components/editor/FloatingButtons';

export default function ZToolView(): ReactElement {
  useSubscriptionOnProjectDelete();
  useSubscriptionForProjectStatus();
  useSubscriptionForWechatConfig();
  useSubscriptionForProjectAuditStatus();
  useSubscriptionForCollaboration();

  const history = useHistory();
  const uft = useUserFlowTrigger();
  const displayNotif = useNotificationDisplay();
  const projectName = useProjectDetails().projectName ?? DefaultProjectName;
  const { editorStore } = useStores();
  const uftRef = useRef(uft);

  const targetProjectExId = useObserver(() => editorStore.targetProjectExId);

  useEffect(() => {
    if (detect()?.name !== 'chrome') displayNotif('NONE_CHROME_WARNING');
    if (isMobile()) displayNotif('IS_MOBILE_WARNING');
    /* eslint-disable-next-line */
  }, []);
  useEffect(() => {
    if (!targetProjectExId) {
      history.push('/');
    } else {
      uft(UserFlow.INIT_PROJECT)(targetProjectExId);
    }
    /* eslint-disable-next-line */
  }, []);

  useLayoutEffect(() => {
    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) e.preventDefault(); // 打断chrome的窗口缩放效果
      },
      { passive: false }
    );
  }, []);

  const prepareGlobalHotKeyHandler = (): Record<string, (event?: any) => void> => {
    const globalHotKeyHandler: Record<
      string,
      Exclude<
        UserFlow,
        | UserFlow.SELECT_TARGET
        | UserFlow.DRAG_SELECTED_TARGETS
        | UserFlow.DRAG_DESELECTED
        | UserFlow.DESELECT
        | UserFlow.FOCUS_TARGET
        | UserFlow.DEFOCUS
      >
    > = {
      // project
      SAVE_PROJECT: UserFlow.SAVE_PROJECT,

      // component
      COPY_SELECTED: UserFlow.COPY_SELECTED,
      PASTE_COPIED: UserFlow.PASTE_COPIED,
      DELETE_TARGET: UserFlow.DELETE_SELECTED,

      // control
      UNDO: UserFlow.UNDO,
      REDO: UserFlow.REDO,
      ENABLE_HAND_TOOL: UserFlow.ENABLE_HAND_TOOL,
      DISABLE_HAND_TOOL: UserFlow.DISABLE_HAND_TOOL,
      MOVE_UP: UserFlow.MOVE_UP,
      MOVE_DOWN: UserFlow.MOVE_DOWN,
      MOVE_LEFT: UserFlow.MOVE_LEFT,
      MOVE_RIGHT: UserFlow.MOVE_RIGHT,
      SHIFT_MOVE_UP: UserFlow.SHIFT_MOVE_UP,
      SHIFT_MOVE_DOWN: UserFlow.SHIFT_MOVE_DOWN,
      SHIFT_MOVE_LEFT: UserFlow.SHIFT_MOVE_LEFT,
      SHIFT_MOVE_RIGHT: UserFlow.SHIFT_MOVE_RIGHT,
      ESCAPE: UserFlow.ESCAPE,
    };

    const preventDefaultEnabledHandler: Record<string, (event?: any) => void> = {};
    Object.entries(globalHotKeyHandler).forEach(([key, value]) => {
      preventDefaultEnabledHandler[key] = (event?: any) => {
        if (event && event.preventDefault) event.preventDefault();
        uftRef.current(value)();
      };
    });
    return preventDefaultEnabledHandler;
  };

  return (
    <VariableContext.Provider value={{}}>
      <ZPageTitle>{projectName}</ZPageTitle>
      <div style={styles.container}>
        <GlobalHotKeys keyMap={HotKeyMap} handlers={prepareGlobalHotKeyHandler()} />
        <ContextMenuTrigger id="no-menu">
          <ZBoard />
        </ContextMenuTrigger>
        <ZContextMenu />

        <div style={styles.sideBar}>
          <ZLeftSideBar />
          <ZLeftDrawer />
        </div>
        <ZRightDrawer />

        <ZZionLogo enableDebug style={styles.logo} />
        <ZHeadUpDisplay />
        <ZProjectActionBar
          deleteEnabled={AllStores.projectStore.verifyUserCollaboratorType(CollaboratorType.OWNER)}
        />

        <FloatingButtons />

        <ZDiffValidationView />
        <ZCollaborationView />
        <ZActionFlowConfigModal />
        <ZShowOnceOnBoardingIntro />
      </div>
    </VariableContext.Provider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: ZThemedColors.SECONDARY,
  },
  sideBar: {
    position: 'fixed',
    top: '94px',
    left: '24px',
  },
  logo: {
    position: 'fixed',
  },
};
