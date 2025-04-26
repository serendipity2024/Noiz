/* eslint-disable import/no-default-export */
import { KeyMap } from 'react-hotkeys';

const HotKeyMap = {
  // project
  SAVE_PROJECT: ['ctrl+s', 'cmd+s'],

  // component
  COPY_SELECTED: ['ctrl+c', 'cmd+c'],
  PASTE_COPIED: ['ctrl+v', 'cmd+v'],
  DELETE_TARGET: ['del', 'backspace'],

  // control
  UNDO: ['ctrl+z', 'cmd+z'],
  REDO: ['ctrl+y', 'cmd+y'],
  ENABLE_HAND_TOOL: { sequence: 'space', action: 'keypress' },
  DISABLE_HAND_TOOL: { sequence: 'space', action: 'keyup' },
  MOVE_UP: 'up',
  MOVE_DOWN: 'down',
  MOVE_LEFT: 'left',
  MOVE_RIGHT: 'right',
  SHIFT_MOVE_UP: 'shift+up',
  SHIFT_MOVE_DOWN: 'shift+down',
  SHIFT_MOVE_LEFT: 'shift+left',
  SHIFT_MOVE_RIGHT: 'shift+right',
  ESCAPE: 'esc',
} as KeyMap;

export default HotKeyMap;
