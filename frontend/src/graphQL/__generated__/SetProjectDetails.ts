/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetProjectDetails
// ====================================================

export interface SetProjectDetails_renameProject {
  __typename: "Project";
  /**
   * 项目名称
   */
  projectName: string;
}

export interface SetProjectDetails_setWechatAppSettings_projectConfig_wechatAppConfig {
  __typename: "WechatAppConfig";
  /**
   * 微信应用ID
   */
  wechatAppId: string | null;
  /**
   * 微信应用密钥
   */
  wechatAppSecret: string | null;
}

export interface SetProjectDetails_setWechatAppSettings_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 微信应用配置
   */
  wechatAppConfig: SetProjectDetails_setWechatAppSettings_projectConfig_wechatAppConfig | null;
}

export interface SetProjectDetails_setWechatAppSettings {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetProjectDetails_setWechatAppSettings_projectConfig | null;
}

export interface SetProjectDetails {
  /**
   * 重命名项目
   */
  renameProject: SetProjectDetails_renameProject;
  /**
   * 设置微信应用设置
   */
  setWechatAppSettings: SetProjectDetails_setWechatAppSettings;
}

export interface SetProjectDetailsVariables {
  projectExId: string;
  projectName: string;
  wechatAppId: string;
  wechatAppSecret: string;
}