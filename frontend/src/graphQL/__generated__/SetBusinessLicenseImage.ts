/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetBusinessLicenseImage
// ====================================================

export interface SetBusinessLicenseImage_setBusinessLicenseImage_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 营业执照图片外部ID
   */
  businessLicenseImageExId: string | null;
}

export interface SetBusinessLicenseImage_setBusinessLicenseImage {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetBusinessLicenseImage_setBusinessLicenseImage_projectConfig | null;
}

export interface SetBusinessLicenseImage {
  /**
   * 设置营业执照图片
   */
  setBusinessLicenseImage: SetBusinessLicenseImage_setBusinessLicenseImage;
}

export interface SetBusinessLicenseImageVariables {
  projectExId: string;
  businessLicenseImageExId: string;
}