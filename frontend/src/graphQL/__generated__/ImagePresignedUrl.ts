/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MediaFormat } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ImagePresignedUrl
// ====================================================

export interface ImagePresignedUrl_imagePresignedUrl {
  __typename: "ImagePresignedUrl";
  /**
   * 图片外部ID
   */
  imageExId: string;
  /**
   * 下载URL
   */
  downloadUrl: string;
  /**
   * 上传URL
   */
  uploadUrl: string;
  /**
   * 内容类型
   */
  contentType: string;
  /**
   * 图片ID
   */
  imageId: number;
}

export interface ImagePresignedUrl {
  /**
   * 图片预签名URL
   */
  imagePresignedUrl: ImagePresignedUrl_imagePresignedUrl;
}

export interface ImagePresignedUrlVariables {
  imgMd5Base64: string;
  imageSuffix: MediaFormat;
  projectExId: string;
}