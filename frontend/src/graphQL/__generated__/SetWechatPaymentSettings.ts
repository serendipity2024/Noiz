/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetWechatPaymentSettings
// ====================================================

export interface SetWechatPaymentSettings_setWechatPaymentSettings_projectConfig_wechatAppConfig {
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

export interface SetWechatPaymentSettings_setWechatPaymentSettings_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 微信应用配置
   */
  wechatAppConfig: SetWechatPaymentSettings_setWechatPaymentSettings_projectConfig_wechatAppConfig | null;
}

export interface SetWechatPaymentSettings_setWechatPaymentSettings {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetWechatPaymentSettings_setWechatPaymentSettings_projectConfig | null;
}

export interface SetWechatPaymentSettings {
  /**
   * 设置微信支付设置
   */
  setWechatPaymentSettings: SetWechatPaymentSettings_setWechatPaymentSettings;
}

export interface SetWechatPaymentSettingsVariables {
  projectExId: string;
  wechatPaymentMerchantId: string;
  wechatPaymentMerchantKey: string;
}