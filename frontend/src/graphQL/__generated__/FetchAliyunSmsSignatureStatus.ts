/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AliyunSmsStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAliyunSmsSignatureStatus
// ====================================================

export interface FetchAliyunSmsSignatureStatus_aliyunSmsSignatureStatus {
  __typename: "AliyunSmsSignatureStatusResponseEntity";
  /**
   * 签名状态
   */
  signStatus: AliyunSmsStatus | null;
  /**
   * 原因
   */
  reason: string | null;
}

export interface FetchAliyunSmsSignatureStatus {
  /**
   * 阿里云短信签名状态
   */
  aliyunSmsSignatureStatus: FetchAliyunSmsSignatureStatus_aliyunSmsSignatureStatus | null;
}

export interface FetchAliyunSmsSignatureStatusVariables {
  projectExId: string;
}