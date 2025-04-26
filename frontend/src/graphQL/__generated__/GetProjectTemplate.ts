/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Visibility } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectTemplate
// ====================================================

export interface GetProjectTemplate_projectTemplates_edges_node_coverImage {
  __typename: "Image";
  /**
   * 图片URL
   */
  url: string;
}

export interface GetProjectTemplate_projectTemplates_edges_node_previewImages {
  __typename: "Image";
  /**
   * 图片URL
   */
  url: string;
}

export interface GetProjectTemplate_projectTemplates_edges_node_templatePreviewQrCodeLink {
  __typename: "Image";
  /**
   * 图片URL
   */
  url: string;
}

export interface GetProjectTemplate_projectTemplates_edges_node {
  __typename: "ProjectTemplate";
  /**
   * 封面图片
   */
  coverImage: GetProjectTemplate_projectTemplates_edges_node_coverImage | null;
  /**
   * 描述
   */
  description: string | null;
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 预览图片
   */
  previewImages: GetProjectTemplate_projectTemplates_edges_node_previewImages[] | null;
  /**
   * 模板预览二维码链接
   */
  templatePreviewQrCodeLink: GetProjectTemplate_projectTemplates_edges_node_templatePreviewQrCodeLink | null;
}

export interface GetProjectTemplate_projectTemplates_edges {
  __typename: "ProjectTemplateEdge";
  /**
   * 节点
   */
  node: GetProjectTemplate_projectTemplates_edges_node;
}

export interface GetProjectTemplate_projectTemplates {
  __typename: "ProjectTemplateConnection";
  /**
   * 边
   */
  edges: GetProjectTemplate_projectTemplates_edges[];
}

export interface GetProjectTemplate {
  /**
   * 项目模板
   */
  projectTemplates: GetProjectTemplate_projectTemplates | null;
}

export interface GetProjectTemplateVariables {
  visibility: Visibility;
}