/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAccountTags
// ====================================================

export interface UpdateAccountTags_updateAccountTags {
  __typename: "Account";
  /**
   * 用户名
   */
  username: string;
}

export interface UpdateAccountTags {
  /**
   * 更新账户标签
   */
  updateAccountTags: UpdateAccountTags_updateAccountTags;
}

export interface UpdateAccountTagsVariables {
  values: any;
}