/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AuditStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchProjectAuditStatusByExId
// ====================================================

export interface FetchProjectAuditStatusByExId_latestAuditStatus {
  __typename: "WechatApiGetLatestAuditStatusResponseEntity";
  /**
   * 审核ID
   */
  auditId: string;
  /**
   * 原因
   */
  reason: string | null;
  /**
   * 截图
   */
  screenShot: string | null;
  /**
   * 状态
   */
  status: AuditStatus;
  /**
   * 创建时间
   */
  createdAt: any;
  /**
   * 是否已发布
   */
  published: boolean | null;
}

export interface FetchProjectAuditStatusByExId {
  /**
   * 最新审核状态
   */
  latestAuditStatus: FetchProjectAuditStatusByExId_latestAuditStatus | null;
}

export interface FetchProjectAuditStatusByExIdVariables {
  projectExId: string;
}