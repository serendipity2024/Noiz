/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MediaFormat } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: VideoPresignedUrl
// ====================================================

export interface VideoPresignedUrl_videoPresignedUrl {
  __typename: "VideoPresignedUrl";
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
   * 视频外部ID
   */
  videoExId: string;
  /**
   * 视频ID
   */
  videoId: number;
}

export interface VideoPresignedUrl {
  /**
   * 视频预签名URL
   */
  videoPresignedUrl: VideoPresignedUrl_videoPresignedUrl;
}

export interface VideoPresignedUrlVariables {
  videoMd5Base64: string;
  videoFormat: MediaFormat;
  projectExId: string;
}