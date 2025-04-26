/* eslint-disable import/no-default-export */
import 'antd/dist/antd.css';
import { useObserver } from 'mobx-react';
import { Resizable } from 're-resizable';
import React from 'react';
import SideDataModelDesigner from '../components/data-model/SideDataModelDesigner';
import ZScrollableDiv from '../components/editor/ZScrollableDiv';
import { AddComponentTab } from '../components/side-drawer-tabs/left-drawer/AddComponentTab';
import AddSubSystemTab from '../components/side-drawer-tabs/left-drawer/AddSubSystemTab';
import AddWebTab from '../components/side-drawer-tabs/left-drawer/AddWebTab';
import AddMobileTab from '../components/side-drawer-tabs/left-drawer/AddMobileTab';
import ComponentTreeTab from '../components/side-drawer-tabs/left-drawer/ComponentTreeTab';
import PlaceholderTab from '../components/side-drawer-tabs/left-drawer/PlaceholderTab';
import PublishConfigureTab from '../components/side-drawer-tabs/left-drawer/PublishConfigureTab';
import ScreensTab from '../components/side-drawer-tabs/left-drawer/ScreensTab';
import SettingsTab from '../components/side-drawer-tabs/left-drawer/SettingsTab';
import ShowDebugConfig from '../components/side-drawer-tabs/left-drawer/ShowDebugConfig';
import { ThemeTab } from '../components/side-drawer-tabs/left-drawer/ThemeTab';
import useStores from '../hooks/useStores';
import { DEFAULT_DRAWER_WIDTH } from '../mobx/stores/EditorStore';
import { LeftDrawerKey } from '../models/interfaces/EditorInfo';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius } from '../utils/ZConst';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { DataModelTab } from '../components/data-model/DataModelTab';
import { ThirdPartyApiTab } from '../components/side-drawer-tabs/left-drawer/ThirdPartyApiTab';

export default function ZLeftDrawer(): NullableReactElement {
  const { editorStore } = useStores();
  const leftDrawerKey = useObserver(() => editorStore.selectedLeftDrawerKey);
  const drawerWidth = useObserver(
    () => editorStore.drawerTabWidth.get(leftDrawerKey) ?? DEFAULT_DRAWER_WIDTH
  );

  if (!leftDrawerKey) return null;

  let component = null;
  let resizable = false;
  let extraStyle = null;
  switch (leftDrawerKey) {
    // home mode
    case LeftDrawerKey.ADD_SCREEN:
      switch (editorStore.editorPlatform) {
        case ZedSupportedPlatform.MOBILE_WEB:
        case ZedSupportedPlatform.WECHAT: {
          component = <AddMobileTab />;
          break;
        }
        case ZedSupportedPlatform.WEB: {
          component = <AddWebTab />;
          break;
        }
        default: {
          component = <PlaceholderTab />;
          break;
        }
      }
      break;
    case LeftDrawerKey.THEME:
      component = <ThemeTab />;
      extraStyle = styles.visibleOverflow;
      break;
    case LeftDrawerKey.DATA_MODEL:
      component = <SideDataModelDesigner />;
      break;
    case LeftDrawerKey.NEW_DATA_MODEL:
      component = <DataModelTab />;
      extraStyle = styles.transparent;
      break;
    case LeftDrawerKey.PROJECT_UPLOAD:
      component = <PublishConfigureTab />;
      extraStyle = styles.fullPage;
      break;
    case LeftDrawerKey.SETTINGS:
      component = <SettingsTab />;
      break;
    case LeftDrawerKey.SCREENS:
      component = <ScreensTab />;
      break;
    case LeftDrawerKey.SUB_SYSTEM:
      component = <AddSubSystemTab />;
      break;
    case LeftDrawerKey.ACTION_FLOW:
      return null;
    case LeftDrawerKey.SHOW_DEBUG_CONFIG:
      component = <ShowDebugConfig />;
      break;
    case LeftDrawerKey.THIRD_PARTY_API:
      component = <ThirdPartyApiTab />;
      extraStyle = styles.transparent;
      break;

    // focus mode
    case LeftDrawerKey.ADD_COMPONENT:
      component = <AddComponentTab />;
      break;
    case LeftDrawerKey.COMPONENT_TREE:
      component = <ComponentTreeTab />;
      resizable = true;
      break;

    default:
      component = <PlaceholderTab />;
  }

  const outterStyle = { ...styles.container, ...extraStyle };
  return (
    <Resizable
      enable={{ right: resizable }}
      style={resizable ? outterStyle : {}}
      size={{ width: drawerWidth, height: 'auto' }}
      onResizeStop={(_event, _direction, _elementRef, delta) => {
        editorStore.drawerTabWidth.set(leftDrawerKey, drawerWidth + delta.width);
      }}
    >
      <ZScrollableDiv
        outterStyle={!resizable ? outterStyle : {}}
        innerStyle={styles.innerContainer}
        maxHeightPercent={0.9}
      >
        {component}
      </ZScrollableDiv>
    </Resizable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    zIndex: 1,
    position: 'fixed',
    top: '94px',
    left: '116px',
    width: '308px',
    height: 'auto',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZColors.BACKGROUND_WITH_OPACITY,
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
  },
  innerContainer: {
    padding: '18px',
  },
  visibleOverflow: {
    overflow: 'visible',
  },
  fullPage: {
    width: 'auto',
    maxWidth: 'calc(100% - 116px - 88px)',
    backdropFilter: 'none',
  },
  transparent: {
    backgroundColor: 'transparent',
    backdropFilter: 'none',
  },
};
