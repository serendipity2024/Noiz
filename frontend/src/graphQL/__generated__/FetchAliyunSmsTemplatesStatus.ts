/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AliyunSmsStatus, AliyunSmsTemplateType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAliyunSmsTemplatesStatus
// ====================================================

export interface FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus {
  __typename: "AliyunSmsTemplateStatusResponseEntity";
  /**
   * 模板代码
   */
  templateCode: string | null;
  /**
   * 创建时间
   */
  createdAt: any | null;
  /**
   * 原因
   */
  reason: string | null;
  /**
   * 模板内容
   */
  templateContent: string | null;
  /**
   * 模板描述
   */
  templateDescription: string | null;
  /**
   * 模板名称
   */
  templateName: string | null;
  /**
   * 模板状态
   */
  templateStatus: AliyunSmsStatus | null;
  /**
   * 模板类型
   */
  templateType: AliyunSmsTemplateType | null;
}

export interface FetchAliyunSmsTemplatesStatus {
  /**
   * 阿里云短信模板状态
   */
  aliyunSmsTemplatesStatus: FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus[] | null;
}

export interface FetchAliyunSmsTemplatesStatusVariables {
  projectExId: string;
}