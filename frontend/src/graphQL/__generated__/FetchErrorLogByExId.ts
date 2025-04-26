/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeploymentStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchErrorLogByExId
// ====================================================

export interface FetchErrorLogByExId_deploymentOutputLog {
  __typename: "DeploymentOutputLog";
  /**
   * 日志内容
   */
  log: string | null;
  /**
   * 部署状态
   */
  status: DeploymentStatus | null;
}

export interface FetchErrorLogByExId {
  /**
   * 部署输出日志
   */
  deploymentOutputLog: FetchErrorLogByExId_deploymentOutputLog | null;
}

export interface FetchErrorLogByExIdVariables {
  projectExId: string;
  status?: (DeploymentStatus | null)[] | null;
}