/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AliyunSmsTemplateParamsInput, AliyunSmsStatus, AliyunSmsTemplateType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAliyunSmsTemplates
// ====================================================

export interface SetAliyunSmsTemplates_setAliyunSmsTemplates {
  __typename: "AliyunSmsTemplateStatusResponseEntity";
  /**
   * 创建时间
   */
  createdAt: any | null;
  /**
   * 原因
   */
  reason: string | null;
  /**
   * 模板代码
   */
  templateCode: string | null;
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

export interface SetAliyunSmsTemplates {
  /**
   * 设置阿里云短信模板
   */
  setAliyunSmsTemplates: SetAliyunSmsTemplates_setAliyunSmsTemplates[];
}

export interface SetAliyunSmsTemplatesVariables {
  projectExId: string;
  templates: AliyunSmsTemplateParamsInput[];
}