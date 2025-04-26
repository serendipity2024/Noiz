/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WechatConfigFragment
// ====================================================

export interface WechatConfigFragment {
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