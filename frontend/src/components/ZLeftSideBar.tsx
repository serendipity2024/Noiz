import { useApolloClient } from '@apollo/client';
import { useObserver } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import { getSupersetAccessUrl } from '../graphQL/getSupersetAccessUrl';
import { FeatureType } from '../graphQL/__generated__/globalTypes';
import useIsDeveloperMode from '../hooks/useIsDeveloperMode';
import useLocale from '../hooks/useLocale';
import { useMutations } from '../hooks/useMutations';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useProjectDetails from '../hooks/useProjectDetails';
import useStores from '../hooks/useStores';
import useUserFlowTrigger, { UserFlow } from '../hooks/useUserFlowTrigger';
import StoreRehydrate from '../mobx/StoreRehydrate';
import { EditorMode, LeftDrawerKey } from '../models/interfaces/EditorInfo';
import ActionFlowHover from '../shared/assets/icons/action-flow-hover.svg';
import ActionFlowSelected from '../shared/assets/icons/action-flow-selected.svg';
import ActionFlow from '../shared/assets/icons/action-flow.svg';
import AddComponentHover from '../shared/assets/icons/add-component-hover.svg';
import AddComponentSelected from '../shared/assets/icons/add-component-selected.svg';
import AddComponent from '../shared/assets/icons/add-component.svg';
import AddScreenHover from '../shared/assets/icons/add-screen-hover.svg';
import AddScreenSelected from '../shared/assets/icons/add-screen-selected.svg';
import AddScreen from '../shared/assets/icons/add-screen.svg';
import ComponentTreeHover from '../shared/assets/icons/component-tree-hover.svg';
import ComponentTreeSelected from '../shared/assets/icons/component-tree-selected.svg';
import ComponentTree from '../shared/assets/icons/component-tree.svg';
import DashboardHover from '../shared/assets/icons/dashboard-hover.svg';
import Dashboard from '../shared/assets/icons/dashboard.svg';
import DataModelHover from '../shared/assets/icons/data-model-hover.svg';
import DataModelSelected from '../shared/assets/icons/data-model-selected.svg';
import DataModel from '../shared/assets/icons/data-model.svg';
import DebugConfigHover from '../shared/assets/icons/debug-config-hover.svg';
import DebugConfigSelected from '../shared/assets/icons/debug-config-selected.svg';
import DebugConfig from '../shared/assets/icons/debug-config.svg';
import DownloadHover from '../shared/assets/icons/download-hover.svg';
import Download from '../shared/assets/icons/download.svg';
import InteractionHover from '../shared/assets/icons/interaction-hover.svg';
import InteractionSelected from '../shared/assets/icons/interaction-selected.svg';
import Interaction from '../shared/assets/icons/interaction.svg';
import ImportHover from '../shared/assets/icons/import-hover.svg';
import Import from '../shared/assets/icons/import.svg';
import ManagementConsoleHover from '../shared/assets/icons/management-console-hover.svg';
import ManagementConsole from '../shared/assets/icons/management-console.svg';
import SaveHover from '../shared/assets/icons/save-hover.svg';
import Save from '../shared/assets/icons/save-normal.svg';
import ScreenListHover from '../shared/assets/icons/screen-list-hover.svg';
import ScreenListSelected from '../shared/assets/icons/screen-list-selected.svg';
import ScreenList from '../shared/assets/icons/screen-list.svg';
import SettingsHover from '../shared/assets/icons/settings-hover.svg';
import SettingsSelected from '../shared/assets/icons/settings-selected.svg';
import Settings from '../shared/assets/icons/settings.svg';
import SubsystemHover from '../shared/assets/icons/subsystem-hover.svg';
import SubsystemSelected from '../shared/assets/icons/subsystem-selected.svg';
import Subsystem from '../shared/assets/icons/subsystem.svg';
import ThemeHover from '../shared/assets/icons/theme-hover.svg';
import ThemeSelected from '../shared/assets/icons/theme-selected.svg';
import Theme from '../shared/assets/icons/theme.svg';
import UploadHover from '../shared/assets/icons/upload-hover.svg';
import UploadSelected from '../shared/assets/icons/upload-selected.svg';
import Upload from '../shared/assets/icons/upload.svg';
import TpApiHover from '../shared/assets/icons/tp-api-hover.svg';
import TpApiSelected from '../shared/assets/icons/tp-api-selected.svg';
import TpApi from '../shared/assets/icons/tp-api-normal.svg';
import { ZColors, ZThemedBorderRadius } from '../utils/ZConst';
import ZHoverableIcon from './editor/ZHoverableIcon';
import { ZManagementConsoleView } from './mc/ZManagementConsoleView';
import DownloadDebugFiles from './side-drawer-tabs/left-drawer/DownloadDebugFiles';
import i18n from './ZLeftSideBar.i18n.json';

export function ZLeftSideBar(): ReactElement {
  const uft = useUserFlowTrigger();
  const displayNotification = useNotificationDisplay();
  const client = useApolloClient();
  const { localizedContent } = useLocale(i18n);
  const { projectExId } = useProjectDetails();
  const isDeveloperMode = useIsDeveloperMode();
  const { editorStore, coreStore, featureStore } = useStores();
  const { managementConsoleMutation } = useMutations();
  const [managementConsoleConfigVisible, setManagementConsoleConfigVisible] =
    useState<boolean>(false);
  const isFocused = useObserver(() => editorStore.editorState.mode === EditorMode.FOCUS);
  const selectedLeftDrawerKey = useObserver(() => editorStore.selectedLeftDrawerKey);

  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'mutliple');
  fileSelector.onchange = (event: any) => {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const content = reader.result?.toString();
      const rehydratedCoreData = StoreRehydrate.rehydrateCoreStoreDataFromFile(content ?? '');
      if (!rehydratedCoreData) displayNotification('PROJECT_INIT_FAILURE');
      else {
        coreStore.rehydrate(rehydratedCoreData);
        displayNotification('PROJECT_FETCHING_SUCCESS');
      }
    };
    reader.readAsText(file);
  };

  const AddScreenIconData = {
    key: LeftDrawerKey.ADD_SCREEN,
    toolTip: localizedContent.addScreen,
    src: AddScreen,
    srcHover: AddScreenHover,
    srcSelected: AddScreenSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.ADD_SCREEN),
  };
  const ThemeColorIconData = {
    key: LeftDrawerKey.THEME,
    toolTip: localizedContent.theme,
    src: Theme,
    srcHover: ThemeHover,
    srcSelected: ThemeSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.THEME),
  };
  const DataModelIconData = {
    key: LeftDrawerKey.DATA_MODEL,
    toolTip: localizedContent.dataModel,
    src: DataModel,
    srcHover: DataModelHover,
    srcSelected: DataModelSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.DATA_MODEL),
  };
  const NewDataModelIconData = {
    key: LeftDrawerKey.NEW_DATA_MODEL,
    toolTip: localizedContent.dataModel,
    src: DataModel,
    srcHover: DataModelHover,
    srcSelected: DataModelSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.NEW_DATA_MODEL),
  };
  const ScreensIconData = {
    key: LeftDrawerKey.SCREENS,
    toolTip: localizedContent.screens,
    src: ScreenList,
    srcHover: ScreenListHover,
    srcSelected: ScreenListSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.SCREENS),
  };
  const DashboardIconData = {
    key: LeftDrawerKey.DASHBOARD,
    toolTip: localizedContent.dashboard,
    src: Dashboard,
    srcHover: DashboardHover,
    srcSelected: null,
    onHandle: () => getSupersetAccessUrl(client, projectExId),
  };
  const ManagementConsoleIconData = {
    key: LeftDrawerKey.MANAGAMENT_CONSOLE,
    toolTip: localizedContent.managementConsole,
    src: ManagementConsole,
    srcHover: ManagementConsoleHover,
    srcSelected: null,
    onHandle: () => {
      setManagementConsoleConfigVisible(true);
      managementConsoleMutation.syncManagementConsoleConfig();
    },
  };
  const ProjectSaveIconData = {
    key: LeftDrawerKey.PROJECT_SAVE,
    toolTip: localizedContent.save,
    src: Save,
    srcHover: SaveHover,
    srcSelected: null,
    onHandle: uft(UserFlow.SAVE_PROJECT),
  };
  const ProjectUploadIconData = {
    key: LeftDrawerKey.PROJECT_UPLOAD,
    toolTip: localizedContent.build,
    src: Upload,
    srcHover: UploadHover,
    srcSelected: UploadSelected,
    onHandle: () => {
      editorStore.auditNotification = false;
      iconOnSelect(LeftDrawerKey.PROJECT_UPLOAD);
    },
    notification: useObserver(() => editorStore.auditNotification),
  };
  const ProjectDownloadIconData = {
    key: LeftDrawerKey.PROJECT_DOWNLOAD,
    toolTip: localizedContent.download,
    src: Download,
    srcHover: DownloadHover,
    srcSelected: null,
    onHandle: () => {
      editorStore.switchDownloadWindowVisibility();
    },
  };
  const ShowDebugConfig = {
    key: LeftDrawerKey.SHOW_DEBUG_CONFIG,
    toolTip: localizedContent.showDebugConfig,
    src: DebugConfig,
    srcHover: DebugConfigHover,
    srcSelected: DebugConfigSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.SHOW_DEBUG_CONFIG),
  };
  const ProjectImportIconData = {
    key: LeftDrawerKey.PROJECT_IMPORT,
    toolTip: localizedContent.import,
    src: Import,
    srcHover: ImportHover,
    srcSelected: null,
    onHandle: () => {
      fileSelector.click();
    },
  };
  const SettingsIconData = {
    key: LeftDrawerKey.SETTINGS,
    toolTip: localizedContent.settings,
    src: Settings,
    srcHover: SettingsHover,
    srcSelected: SettingsSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.SETTINGS),
  };
  const RevertIconData = {
    key: LeftDrawerKey.REVERT,
    toolTip: localizedContent.revert,
    src: Interaction, // icon need to be added and changed//
    srcHover: InteractionHover,
    srcSelected: InteractionSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.REVERT),
  };
  const AddComponentIconData = {
    key: LeftDrawerKey.ADD_COMPONENT,
    toolTip: localizedContent.addComponent,
    src: AddComponent,
    srcHover: AddComponentHover,
    srcSelected: AddComponentSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.ADD_COMPONENT),
  };
  const ComponentTreeIconData = {
    key: LeftDrawerKey.COMPONENT_TREE,
    toolTip: localizedContent.componentTree,
    src: ComponentTree,
    srcHover: ComponentTreeHover,
    srcSelected: ComponentTreeSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.COMPONENT_TREE),
  };
  const SubSystemIconData = {
    key: LeftDrawerKey.SUB_SYSTEM,
    toolTip: localizedContent.subSystems,
    src: Subsystem,
    srcHover: SubsystemHover,
    srcSelected: SubsystemSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.SUB_SYSTEM),
  };
  const AddActionFlowData = {
    key: LeftDrawerKey.ACTION_FLOW,
    toolTip: localizedContent.actionFlow,
    src: ActionFlow,
    srcHover: ActionFlowHover,
    srcSelected: ActionFlowSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.ACTION_FLOW),
  };
  const ThirdPartyApiIconData = {
    key: LeftDrawerKey.THIRD_PARTY_API,
    toolTip: localizedContent.thirdPartyApi,
    src: TpApi,
    srcHover: TpApiHover,
    srcSelected: TpApiSelected,
    onHandle: () => iconOnSelect(LeftDrawerKey.THIRD_PARTY_API),
  };

  const projectIcons = [ProjectSaveIconData, ProjectUploadIconData, SettingsIconData].concat(
    !isDeveloperMode
      ? []
      : [ProjectDownloadIconData, ProjectImportIconData, ShowDebugConfig, RevertIconData]
  );
  const homeIconData: IconData[][] = [
    [AddScreenIconData, ScreensIconData, DataModelIconData, SubSystemIconData, ThemeColorIconData],
    [DashboardIconData, ManagementConsoleIconData],
    projectIcons,
  ];
  if (featureStore.isFeatureAccessible(FeatureType.ACTION_FLOW))
    homeIconData[0].push(AddActionFlowData);
  if (featureStore.isFeatureAccessible(FeatureType.NEW_DATA_MODEL_DESIGN))
    homeIconData[0].push(NewDataModelIconData);
  if (featureStore.isFeatureAccessible(FeatureType.THIRD_PARTY_API))
    homeIconData[0].push(ThirdPartyApiIconData);
  const focusIconData: IconData[][] = [
    [AddComponentIconData, ScreensIconData, DataModelIconData, ComponentTreeIconData],
    projectIcons,
  ];
  const iconData = isFocused ? focusIconData : homeIconData;

  const iconOnSelect = (selectedKey: LeftDrawerKey) => {
    editorStore.selectedLeftDrawerKey = selectedKey;
  };
  const iconIsSelected = (icon: IconData) => selectedLeftDrawerKey === icon.key;
  const handleIconOnClick = (icon: IconData) => {
    if (iconIsSelected(icon)) {
      editorStore.selectedLeftDrawerKey = null;
    } else {
      icon.onHandle();
    }
  };

  return (
    <div style={styles.container}>
      <DownloadDebugFiles />
      {iconData.map((block: IconData[], blockIndex: number) => (
        <div
          key={blockIndex.toString()}
          style={{ marginTop: blockIndex === 0 ? 0 : '20px', ...styles.block }}
        >
          {block.map((icon: IconData) => (
            <div
              key={icon.key}
              style={styles.iconContainer}
              onClick={() => handleIconOnClick(icon)}
            >
              <ZHoverableIcon
                isSelected={iconIsSelected(icon)}
                src={icon.src}
                hoveredSrc={icon.srcHover}
                selectedSrc={icon.srcSelected}
                containerStyle={styles.iconContainer}
                iconStyle={styles.icon}
                toolTip={icon.toolTip}
                notification={icon.notification}
              />
            </div>
          ))}
        </div>
      ))}
      <ZManagementConsoleView
        managementConsoleConfigVisible={managementConsoleConfigVisible}
        onManagementConsoleConfigVisibleChange={(visible) =>
          setManagementConsoleConfigVisible(visible)
        }
      />
    </div>
  );
}

interface IconData {
  notification?: boolean;
  key: LeftDrawerKey;
  toolTip: string;
  src: string;
  srcHover: string | null;
  srcSelected: string | null;
  onHandle: () => void;
}

const ICON_SIZE = '34px';
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10000,
    width: '68px',
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: ZThemedBorderRadius.LARGE,
    backgroundColor: ZColors.BACKGROUND_WITH_OPACITY,
    backdropFilter: 'blur(8px)',
  },
  seperator: {
    width: '100%',
    height: '20px',
  },
  iconContainer: {
    height: '64px',
    width: ICON_SIZE,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
};
