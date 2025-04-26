/* eslint-disable import/no-default-export */
import PlatformUtils from './PlatformUtils';

export default class HotKeyUtils {
  static ctrlOrCommandPressed = (event: React.MouseEvent): boolean => {
    const { ctrlKey, metaKey } = event;
    if (PlatformUtils.isWindows()) return ctrlKey;
    if (PlatformUtils.isMac()) return metaKey;
    return false;
  };
}
