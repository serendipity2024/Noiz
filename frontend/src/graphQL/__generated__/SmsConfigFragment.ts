/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SmsConfigFragment
// ====================================================

export interface SmsConfigFragment_signature {
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

export interface SmsConfigFragment {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: SmsConfigFragment_signature | null;
}