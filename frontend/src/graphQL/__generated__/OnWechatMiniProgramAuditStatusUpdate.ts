/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AuditStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OnWechatMiniProgramAuditStatusUpdate
// ====================================================

export interface OnWechatMiniProgramAuditStatusUpdate_onWechatMiniProgramAuditStatusUpdate {
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

export interface OnWechatMiniProgramAuditStatusUpdate {
  /**
   * 微信小程序审核状态更新
   */
  onWechatMiniProgramAuditStatusUpdate: OnWechatMiniProgramAuditStatusUpdate_onWechatMiniProgramAuditStatusUpdate;
}

export interface OnWechatMiniProgramAuditStatusUpdateVariables {
  projectExId: string;
}