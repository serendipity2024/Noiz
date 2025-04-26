/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeploymentStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OnDeploymentStatusChanged
// ====================================================

export interface OnDeploymentStatusChanged_onDeploymentStatusChanged {
  __typename: "Project";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 部署状态
   */
  deploymentStatus: DeploymentStatus | null;
  /**
   * 微信小程序链接
   */
  wechatMiniAppLink: string | null;
  /**
   * 微信小程序二维码链接
   */
  wechatMiniAppQRCodeLink: string | null;
  /**
   * 微信小程序二维码Base64
   */
  wechatMiniAppQRCodeBase64: string | null;
}

export interface OnDeploymentStatusChanged {
  /**
   * 部署状态变更
   */
  onDeploymentStatusChanged: OnDeploymentStatusChanged_onDeploymentStatusChanged;
}

export interface OnDeploymentStatusChangedVariables {
  projectExId: string;
}