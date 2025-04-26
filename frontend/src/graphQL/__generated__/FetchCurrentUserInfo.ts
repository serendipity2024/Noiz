/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AgeRange } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchCurrentUserInfo
// ====================================================

export interface FetchCurrentUserInfo_user_tags {
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

export interface FetchCurrentUserInfo_user_userProfile {
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

export interface FetchCurrentUserInfo_user {
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
   * 头像URL
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
  tags: FetchCurrentUserInfo_user_tags | null;
  /**
   * 用户资料
   */
  userProfile: FetchCurrentUserInfo_user_userProfile | null;
}

export interface FetchCurrentUserInfo {
  /**
   * 当前用户
   */
  user: FetchCurrentUserInfo_user | null;
}