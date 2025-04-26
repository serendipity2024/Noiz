/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollaboratorType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAllProjectsForCurrentUser
// ====================================================

export interface GetAllProjectsForCurrentUser_allProjects_lastUploadedSchema {
  __typename: "ProjectSchema";
  /**
   * 创建时间
   */
  createdAt: any;
}

export interface GetAllProjectsForCurrentUser_allProjects {
  __typename: "Project";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 项目名称
   */
  projectName: string;
  /**
   * 协作者类型
   */
  collaboratorType: CollaboratorType;
  /**
   * 项目所有者
   */
  projectOwner: string | null;
  /**
   * 最后上传的模式
   */
  lastUploadedSchema: GetAllProjectsForCurrentUser_allProjects_lastUploadedSchema | null;
}

export interface GetAllProjectsForCurrentUser {
  /**
   * 所有项目
   */
  allProjects: GetAllProjectsForCurrentUser_allProjects[];
}