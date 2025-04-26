/* eslint-disable import/no-default-export */
import { NullableShortId } from '../../shared/type-definition/ZTypes';

export default interface EditorInfo {
  sessionId: string;
  rightDrawerTarget: NullableShortId;
  selectedLeftDrawerKey: LeftDrawerKey | null;
  isHandToolOn: boolean;
  editorState: EditorState;
  singleClickSelectedTarget: NullableShortId;
  clipBoard: NullableShortId;
  floatingButtonOn: FloatingButtonOnType;
}

export enum LeftDrawerKey {
  // home
  ADD_SCREEN = 'add-screen',
  THEME = 'theme',
  DATA_MODEL = 'data-model',
  NEW_DATA_MODEL = 'new-data-model',
  DASHBOARD = 'dashboard',
  MANAGAMENT_CONSOLE = 'management-console',
  PROJECT_SAVE = 'project-save',
  PROJECT_UPLOAD = 'project-upload',
  PROJECT_DOWNLOAD = 'project-download',
  PROJECT_IMPORT = 'project-import',
  SETTINGS = 'settings',
  REVERT = 'revert',
  SCREENS = 'screens',
  SHOW_DEBUG_CONFIG = 'show-debug-config',
  SUB_SYSTEM = 'sub-system',
  ACTION_FLOW = 'action-flow',
  SMS_NOTIFICATION_TEMPLATE = 'sms-notification-template',
  THIRD_PARTY_API = 'third-party-api',

  // focus
  ADD_COMPONENT = 'add-component',
  COMPONENT_TREE = 'component-tree',
}

export interface EditorState {
  mode: EditorMode;
  target: NullableShortId;
}

export enum EditorMode {
  HOME = 'home',
  FOCUS = 'focus',
  DATA_MODEL = 'data-model',
}

export type FloatingButtonOnType = 'sharing' | 'feedback' | null;
