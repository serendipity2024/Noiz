/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeatureType } from "./globalTypes";

// ====================================================
// GraphQL query operation: AllFeatures
// ====================================================

export interface AllFeatures_allFeatures {
  __typename: "Feature";
  /**
   * 功能名称
   */
  featureName: FeatureType;
  /**
   * 是否启用
   */
  enabled: boolean;
}

export interface AllFeatures {
  /**
   * 获取所有功能及其状态
   */
  allFeatures: AllFeatures_allFeatures[];
}

export interface AllFeaturesVariables {
  projectExId?: string | null;
}