/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CloudProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: getAllCloudConfigurations
// ====================================================

export interface getAllCloudConfigurations_allCloudConfigurations {
  __typename: "CloudConfiguration";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 存储桶
   */
  bucket: string;
  /**
   * 提供商
   */
  provider: CloudProvider;
}

export interface getAllCloudConfigurations {
  /**
   * 所有云配置
   */
  allCloudConfigurations: getAllCloudConfigurations_allCloudConfigurations[];
}