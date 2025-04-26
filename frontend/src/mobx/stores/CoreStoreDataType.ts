/* eslint-disable import/no-default-export */
import { ActionFlow } from '../../shared/type-definition/ActionFlow';
import { DataModel } from '../../shared/type-definition/DataModel';
import { FunctorApi } from '../../shared/type-definition/FunctorSchema';
import { ThirdPartyRequest } from '../../shared/type-definition/ThirdPartySchema';
import { ColorTheme, ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import { BuildTarget } from '../../shared/data/BuildTarget';
import { SubsystemFragment } from '../../graphQL/__generated__/SubsystemFragment';

export interface AppGlobalSetting {
  appDidLoad: any[];
  globalVariableTable: Record<string, any>;
}

export interface AppConfiguration {
  isReady: boolean;
  buildTarget: BuildTarget;
  iconfontScriptUrl: string;
}

export interface WechatConfiguration {
  appId?: string;
  appSecret?: string;
}

export interface WebConfiguration {
  // 预留
}

export interface MobileWebConfiguration {
  // 预留
}

export interface CompositeConfiguration {
  appConfiguration: AppConfiguration;
  wechatConfiguration?: WechatConfiguration;
  webConfiguration?: WebConfiguration;
  mobileWebConfiguration?: MobileWebConfiguration;
}

export interface Configuration {
  appConfiguration: AppConfiguration;
  wechatConfiguration?: WechatConfiguration;
  webConfiguration?: WebConfiguration;
  mobileWebConfiguration?: MobileWebConfiguration;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  componentModel: BaseComponentModel;
}

export interface MCConfiguration {
  userRoles: string[];
  menuItems: any[];
  objects: any[];
}

export default interface CoreStoreDataType {
  wechatRootMRefs: ShortId[];
  mobileWebRootMRefs: ShortId[];
  webRootMRefs: ShortId[];
  mRefMap: Record<ShortId, BaseComponentModel>;
  componentTemplates: ComponentTemplate[];
  dataModel: DataModel;
  colorTheme: ColorTheme;
  colorThemeLabelMap?: Record<string, string>;
  appGlobalSetting: AppGlobalSetting;
  appConfiguration: AppConfiguration;
  wechatConfiguration?: WechatConfiguration;
  webConfiguration?: WebConfiguration;
  mobileWebConfiguration?: MobileWebConfiguration;
  mcConfiguration?: MCConfiguration;
  remoteApiSchema: any[];
  functors: FunctorApi[];
  actionFlows: ActionFlow[];
  thirdPartyApiConfigs: ThirdPartyRequest[];
  subsystemRecords: SubsystemFragment[];
  zedVersion: string;
}