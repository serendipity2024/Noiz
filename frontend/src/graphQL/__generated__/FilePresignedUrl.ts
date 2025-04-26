/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MediaFormat } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: FilePresignedUrl
// ====================================================

export interface FilePresignedUrl_filePresignedUrl {
  __typename: "FilePresignedUrl";
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
   * 文件外部ID
   */
  fileExId: string;
  /**
   * 文件ID
   */
  fileId: number;
}

export interface FilePresignedUrl {
  /**
   * 文件预签名URL
   */
  filePresignedUrl: FilePresignedUrl_filePresignedUrl;
}

export interface FilePresignedUrlVariables {
  fileMd5Base64: string;
  fileFormat: MediaFormat;
  suffix?: string | null;
  projectExId: string;
}