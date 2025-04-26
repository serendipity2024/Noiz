/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountProfileInput, AgeRange } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateAccountProfile
// ====================================================

export interface updateAccountProfile_updateAccountProfile_tags {
  __typename: "AccountTags";
  /**
   * 是否已经看过介绍
   */
  hasSeenIntro: boolean | null;
  /**
   * 是否已经更新用户资料
   */
  hasUpdatedUserProfile: boolean | null;
}

export interface updateAccountProfile_updateAccountProfile_userProfile {
  __typename: "UserProfile";
  /**
   * 年龄范围
   */
  ageRange: AgeRange | null;
  /**
   * 行业
   */
  industry: string | null;
}

export interface updateAccountProfile_updateAccountProfile {
  __typename: "Account";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 邮箱
   */
  email: string | null;
  /**
   * 电话号码
   */
  phoneNumber: string | null;
  /**
   * 个人资料图片URL
   */
  profileImageUrl: string | null;
  /**
   * 用户名
   */
  username: string;
  /**
   * 显示名称
   */
  displayName: string | null;
  /**
   * 账户标签
   */
  tags: updateAccountProfile_updateAccountProfile_tags | null;
  /**
   * 用户资料
   */
  userProfile: updateAccountProfile_updateAccountProfile_userProfile | null;
}

export interface updateAccountProfile {
  /**
   * 更新账户资料
   */
  updateAccountProfile: updateAccountProfile_updateAccountProfile;
}

export interface updateAccountProfileVariables {
  values: AccountProfileInput;
}