/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFeedback
// ====================================================

export interface CreateFeedback {
  /**
   * 创建反馈
   */
  createFeedback: {
    __typename: string;
  };
}

export interface CreateFeedbackVariables {
  message?: string | null;
  miscData?: any | null;
  mediaUrls?: string[] | null;
}