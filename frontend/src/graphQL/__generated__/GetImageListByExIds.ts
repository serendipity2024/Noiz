/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetImageListByExIds
// ====================================================

export interface GetImageListByExIds_getImageListByExIds {
  __typename: "Image";
  /**
   * 图片URL
   */
  url: string;
}

export interface GetImageListByExIds {
  /**
   * 通过外部ID列表获取图片列表
   */
  getImageListByExIds: (GetImageListByExIds_getImageListByExIds | null)[] | null;
}

export interface GetImageListByExIdsVariables {
  imageExIds?: string[] | null;
  projectExId: string;
  option?: any | null;
}