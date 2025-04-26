/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchAccountTags
// ====================================================

export interface FetchAccountTags_user_tags {
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

export interface FetchAccountTags_user {
  __typename: "Account";
  /**
   * 账户标签
   */
  tags: FetchAccountTags_user_tags | null;
}

export interface FetchAccountTags {
  /**
   * 当前用户
   */
  user: FetchAccountTags_user | null;
}