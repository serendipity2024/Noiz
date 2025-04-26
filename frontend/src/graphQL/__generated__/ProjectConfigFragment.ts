/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectConfigFragment
// ====================================================

export interface ProjectConfigFragment_wechatAppConfig_signature {
  __typename: "AliyunSmsSignature";
  /**
   * 描述
   */
  description: string | null;
  /**
   * 签名来源
   */
  signSource: string | null;
  /**
   * 签名
   */
  signature: string | null;
}

export interface ProjectConfigFragment_wechatAppConfig {
  __typename: "WechatAppConfig";
  /**
   * 微信应用ID
   */
  appId: string | null;
  /**
   * 微信应用密钥
   */
  appSecret: string | null;
  /**
   * 微信应用原始ID
   */
  originalId: string | null;
  /**
   * 微信应用名称
   */
  appName: string | null;
  /**
   * 微信应用图标
   */
  appIcon: string | null;
  /**
   * 微信应用描述
   */
  appDescription: string | null;
  /**
   * 微信应用类别
   */
  appCategory: string | null;
  /**
   * 微信应用服务类别
   */
  appServiceCategory: string | null;
  /**
   * 微信应用服务类别ID
   */
  appServiceCategoryId: string | null;
  /**
   * 微信应用支持版本
   */
  appSupportVersion: string | null;
  /**
   * 微信应用请求域名
   */
  requestDomain: string[] | null;
  /**
   * 微信应用Socket域名
   */
  socketDomain: string[] | null;
  /**
   * 微信应用上传域名
   */
  uploadDomain: string[] | null;
  /**
   * 微信应用下载域名
   */
  downloadDomain: string[] | null;
  /**
   * 微信应用业务域名
   */
  bizDomain: string[] | null;
  /**
   * 微信应用WebView域名
   */
  webViewDomain: string[] | null;
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

export interface ProjectConfigFragment_hasuraConfig {
  __typename: "HasuraConfig";
  /**
   * 根URL
   */
  rootUrl: string | null;
  /**
   * 管理员密钥
   */
  adminSecret: string | null;
}

export interface ProjectConfigFragment_aliyunSmsConfig_signature {
  __typename: "AliyunSmsSignature";
  /**
   * 描述
   */
  description: string | null;
  /**
   * 签名来源
   */
  signSource: string | null;
  /**
   * 签名
   */
  signature: string | null;
}

export interface ProjectConfigFragment_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: ProjectConfigFragment_aliyunSmsConfig_signature | null;
}

export interface ProjectConfigFragment_emailConfig {
  __typename: "EmailConfig";
  /**
   * 邮箱密码
   */
  emailPassword: string | null;
  /**
   * 邮箱提供商
   */
  emailProvider: string | null;
  /**
   * 邮箱发送者
   */
  emailSender: string | null;
}

export interface ProjectConfigFragment {
  __typename: "ProjectConfig";
  /**
   * 微信应用配置
   */
  wechatAppConfig: ProjectConfigFragment_wechatAppConfig | null;
  /**
   * Hasura配置
   */
  hasuraConfig: ProjectConfigFragment_hasuraConfig | null;
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: ProjectConfigFragment_aliyunSmsConfig | null;
  /**
   * 邮箱配置
   */
  emailConfig: ProjectConfigFragment_emailConfig | null;
  /**
   * 注册令牌
   */
  registerToken: string | null;
  /**
   * 营业执照图片外部ID
   */
  businessLicenseImageExId: string | null;
}