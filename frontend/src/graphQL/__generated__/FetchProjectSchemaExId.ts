/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchProjectSchemaExId
// ====================================================

export interface FetchProjectSchemaExId_project_lastUploadedSchema {
  __typename: "ProjectSchema";
  /**
   * 外部ID
   */
  exId: string;
}

export interface FetchProjectSchemaExId_project {
  __typename: "Project";
  /**
   * 最后上传的模式
   */
  lastUploadedSchema: FetchProjectSchemaExId_project_lastUploadedSchema | null;
}

export interface FetchProjectSchemaExId {
  /**
   * 项目
   */
  project: FetchProjectSchemaExId_project | null;
}

export interface FetchProjectSchemaExIdVariables {
  projectExId: string;
}