/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetWechatAppSettings
// ====================================================

export interface SetWechatAppSettings_setWechatAppSettings_projectConfig_wechatAppConfig {
  __typename: "WechatAppConfig";
  /**
   * 微信应用ID
   */
  wechatAppId: string | null;
  /**
   * 微信应用密钥
   */
  wechatAppSecret: string | null;
  /**
   * 是否已授权第三方平台
   */
  hasGrantedThirdPartyAuthorization: boolean | null;
  /**
   * 微信支付商户ID
   */
  wechatPaymentMerchantId: string | null;
  /**
   * 微信支付商户密钥
   */
  wechatPaymentMerchantKey: string | null;
  /**
   * 微信支付通知URL
   */
  wechatPaymentNotifyUrl: string | null;
}

export interface SetWechatAppSettings_setWechatAppSettings_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 微信应用配置
   */
  wechatAppConfig: SetWechatAppSettings_setWechatAppSettings_projectConfig_wechatAppConfig | null;
}

export interface SetWechatAppSettings_setWechatAppSettings {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetWechatAppSettings_setWechatAppSettings_projectConfig | null;
}

export interface SetWechatAppSettings {
  /**
   * 设置微信应用设置
   */
  setWechatAppSettings: SetWechatAppSettings_setWechatAppSettings;
}

export interface SetWechatAppSettingsVariables {
  projectExId: string;
  wechatAppId: string;
  wechatAppSecret: string;
}