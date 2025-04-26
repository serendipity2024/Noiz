/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddWechatWebViewDomain
// ====================================================

export interface AddWechatWebViewDomain {
  /**
   * 添加微信WebView域名白名单
   */
  addWechatWebViewDomain: boolean | null;
}

export interface AddWechatWebViewDomainVariables {
  projectExId: string;
  webViewDomainList?: string[] | null;
}