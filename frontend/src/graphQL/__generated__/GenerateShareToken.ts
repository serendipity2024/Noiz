/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollaboratorType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GenerateShareToken
// ====================================================

export interface GenerateShareToken_generateShareToken {
  __typename: "ShareToken";
  /**
   * 分享代码
   */
  code: string;
}

export interface GenerateShareToken {
  /**
   * 生成分享令牌
   */
  generateShareToken: GenerateShareToken_generateShareToken | null;
}

export interface GenerateShareTokenVariables {
  projectExId: string;
  collaboratorType: CollaboratorType;
}