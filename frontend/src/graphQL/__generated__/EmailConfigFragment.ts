/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EmailProvider } from "./globalTypes";

// ====================================================
// GraphQL fragment: EmailConfigFragment
// ====================================================

export interface EmailConfigFragment {
  __typename: "EmailConfig";
  /**
   * 邮箱密码
   */
  emailPassword: string | null;
  /**
   * 邮箱提供商
   */
  emailProvider: EmailProvider | null;
  /**
   * 邮箱发送者
   */
  emailSender: string | null;
}