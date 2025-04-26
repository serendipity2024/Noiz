/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EmailConfigInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetEmailConfig
// ====================================================

export interface SetEmailConfig_setEmailConfig_projectConfig_emailConfig {
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

export interface SetEmailConfig_setEmailConfig_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 邮箱配置
   */
  emailConfig: SetEmailConfig_setEmailConfig_projectConfig_emailConfig | null;
}

export interface SetEmailConfig_setEmailConfig {
  __typename: "Project";
  /**
   * 项目配置
   */
  projectConfig: SetEmailConfig_setEmailConfig_projectConfig | null;
}

export interface SetEmailConfig {
  /**
   * 设置邮箱配置
   */
  setEmailConfig: SetEmailConfig_setEmailConfig;
}

export interface SetEmailConfigVariables {
  projectExId: string;
  emailConfig: EmailConfigInput;
}