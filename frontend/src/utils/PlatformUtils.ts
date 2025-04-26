/* eslint-disable import/no-default-export */
export default class PlatformUtils {
  static isWindows = (): boolean => {
    return /windows|win32/i.test(navigator.userAgent);
  };

  static isMac = (): boolean => {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  };
}
