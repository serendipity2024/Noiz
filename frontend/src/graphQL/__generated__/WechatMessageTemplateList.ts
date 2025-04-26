/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: WechatMessageTemplateList
// ====================================================

export interface WechatMessageTemplateList_wechatMessageTemplateList {
  __typename: "WechatMessageTemplate";
  /**
   * 模板内容
   */
  templateContent: string;
  /**
   * 模板示例
   */
  templateExample: string;
  /**
   * 模板ID
   */
  templateId: string;
  /**
   * 模板标题
   */
  templateTitle: string;
  /**
   * 类型
   */
  type: string;
}

export interface WechatMessageTemplateList {
  /**
   * 微信消息模板列表
   */
  wechatMessageTemplateList: WechatMessageTemplateList_wechatMessageTemplateList[];
}

export interface WechatMessageTemplateListVariables {
  projectExId: string;
}