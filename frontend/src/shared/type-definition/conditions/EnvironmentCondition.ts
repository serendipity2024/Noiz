/* eslint-disable import/no-default-export */
import ConditionCategory from './ConditionCategory';

export enum EnvironmentConditionType {
  OS_TYPE = 'os-type',
  WECHAT_PERMISSION = 'wechat-permission',
}

export enum OSType {
  IOS = 'ios',
  ANDROID = 'android',
  MAC = 'mac',
  WINDOWS = 'windows',
  DEVTOOLS = 'devtools',
}

// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/AuthSetting.html
export enum WechatPermission {
  USER_INFO = 'scope.userInfo',
  USER_LOCATION = 'scope.userLocation',
  WE_RUN = 'scope.werun',
  RECORD = 'scope.record',
  WRITE_PHOTOS_ALBUM = 'scope.writePhotosAlbum',
  CAMERA = 'scope.camera',
}

export type EnvironmentConditionInput =
  | {
      category: ConditionCategory.ENVIRONMENT;
      type: EnvironmentConditionType.OS_TYPE;
      value: OSType;
    }
  | {
      category: ConditionCategory.ENVIRONMENT;
      type: EnvironmentConditionType.WECHAT_PERMISSION;
      value: WechatPermission;
    };

export default class EnvironmentCondition {
  public static from(input: EnvironmentConditionInput): EnvironmentCondition {
    switch (input.type) {
      case EnvironmentConditionType.OS_TYPE:
        return new EnvironmentCondition({
          ...input,
          value: Object.values(OSType).find((v) => v === input.value) ?? OSType.IOS,
        });
      case EnvironmentConditionType.WECHAT_PERMISSION:
        return new EnvironmentCondition({
          ...input,
          value:
            Object.values(WechatPermission).find((v) => v === input.value) ??
            WechatPermission.CAMERA,
        });
      default:
        throw Error(`Unknown type: ${input}`);
    }
  }

  public readonly category: ConditionCategory.ENVIRONMENT = ConditionCategory.ENVIRONMENT;

  public readonly type: EnvironmentConditionType;

  public readonly label: string;

  public readonly updateable: boolean;

  public value: OSType | WechatPermission;

  private constructor(input: EnvironmentConditionMeta) {
    this.updateable = true;
    this.type = input.type;
    this.value = input.value;
    this.label = input.value;
  }
}

interface EnvironmentConditionMeta {
  type: EnvironmentConditionType;
  value: OSType | WechatPermission;
}

export const AllEnvironmentConditions: EnvironmentCondition[] = [
  EnvironmentCondition.from({
    category: ConditionCategory.ENVIRONMENT,
    type: EnvironmentConditionType.WECHAT_PERMISSION,
    value: WechatPermission.CAMERA,
  }),
  EnvironmentCondition.from({
    category: ConditionCategory.ENVIRONMENT,
    type: EnvironmentConditionType.OS_TYPE,
    value: OSType.IOS,
  }),
];
