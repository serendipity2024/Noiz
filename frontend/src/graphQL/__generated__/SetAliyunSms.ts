/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AliyunSmsSignatureInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAliyunSms
// ====================================================

export interface SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig_signature {
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

export interface SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig_signature | null;
}

export interface SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig | null;
}

export interface SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig | null;
}

export interface SetAliyunSms_setAliyunSmsSignature_projectConfig_aliyunSmsConfig_signature {
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

export interface SetAliyunSms_setAliyunSmsSignature_projectConfig_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: SetAliyunSms_setAliyunSmsSignature_projectConfig_aliyunSmsConfig_signature | null;
}

export interface SetAliyunSms_setAliyunSmsSignature_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: SetAliyunSms_setAliyunSmsSignature_projectConfig_aliyunSmsConfig | null;
}

export interface SetAliyunSms_setAliyunSmsSignature {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetAliyunSms_setAliyunSmsSignature_projectConfig | null;
}

export interface SetAliyunSms {
  /**
   * 设置阿里云短信授权书图片
   */
  setAliyunSmsCertifiedPowerOfAttorneyImage: SetAliyunSms_setAliyunSmsCertifiedPowerOfAttorneyImage;
  /**
   * 设置阿里云短信签名
   */
  setAliyunSmsSignature: SetAliyunSms_setAliyunSmsSignature;
}

export interface SetAliyunSmsVariables {
  powerOfAttorneyImageExId: string;
  signature: AliyunSmsSignatureInput;
  projectExId: string;
}