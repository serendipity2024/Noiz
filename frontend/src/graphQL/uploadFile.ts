import { gql } from '@apollo/client';

export const IMAGE_PRESIGNED_URL = gql`
  mutation ImagePresignedUrl(
    $imgMd5Base64: String!
    $imageSuffix: MediaFormat!
    $projectExId: String!
  ) {
    imagePresignedUrl(
      imageSuffix: $imageSuffix
      imgMd5Base64: $imgMd5Base64
      projectExId: $projectExId
    ) {
      imageExId
      downloadUrl
      uploadUrl
      contentType
      imageExId
      imageId
    }
  }
`;

export const VIDEO_PRESIGNED_URL = gql`
  mutation VideoPresignedUrl(
    $videoMd5Base64: String!
    $videoFormat: MediaFormat!
    $projectExId: String!
  ) {
    videoPresignedUrl(
      videoMd5Base64: $videoMd5Base64
      videoFormat: $videoFormat
      projectExId: $projectExId
    ) {
      downloadUrl
      uploadUrl
      contentType
      videoExId
      videoId
    }
  }
`;

export const FILE_PRESIGNED_URL = gql`
  mutation FilePresignedUrl(
    $fileMd5Base64: String!
    $fileFormat: MediaFormat!
    $suffix: String
    $projectExId: String!
  ) {
    filePresignedUrl(
      md5Base64: $fileMd5Base64
      format: $fileFormat
      projectExId: $projectExId
      suffix: $suffix
    ) {
      downloadUrl
      uploadUrl
      contentType
      fileExId
      fileId
    }
  }
`;
