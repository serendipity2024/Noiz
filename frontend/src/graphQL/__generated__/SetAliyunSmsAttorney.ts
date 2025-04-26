/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetAliyunSmsAttorney
// ====================================================

export interface SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig_signature {
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

export interface SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig_signature | null;
}

export interface SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig_aliyunSmsConfig | null;
}

export interface SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage_projectConfig | null;
}

export interface SetAliyunSmsAttorney {
  /**
   * 设置阿里云短信授权书图片
   */
  setAliyunSmsCertifiedPowerOfAttorneyImage: SetAliyunSmsAttorney_setAliyunSmsCertifiedPowerOfAttorneyImage;
}

export interface SetAliyunSmsAttorneyVariables {
  powerOfAttorneyImageExId: string;
  projectExId: string;
}