/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AliyunSmsSignatureInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAliyunSmsSignature
// ====================================================

export interface SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig_aliyunSmsConfig_signature {
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

export interface SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig_aliyunSmsConfig_signature | null;
}

export interface SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig_aliyunSmsConfig | null;
}

export interface SetAliyunSmsSignature_setAliyunSmsSignature {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetAliyunSmsSignature_setAliyunSmsSignature_projectConfig | null;
}

export interface SetAliyunSmsSignature {
  /**
   * 设置阿里云短信签名
   */
  setAliyunSmsSignature: SetAliyunSmsSignature_setAliyunSmsSignature;
}

export interface SetAliyunSmsSignatureVariables {
  projectExId: string;
  signature: AliyunSmsSignatureInput;
}