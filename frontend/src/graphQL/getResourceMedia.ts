import { gql } from '@apollo/client';

export const GQL_GET_IMAGE_BY_EX_ID = gql`
  query GetImageByExId(
    $imageExId: String!
    $projectExId: String!
    $option: ImageProcessOptionInput
  ) {
    getImageByExId(imageExId: $imageExId, projectExId: $projectExId) {
      url(option: $option, projectExId: $projectExId)
    }
  }
`;

export const GQL_GET_VIDEO_BY_EX_ID = gql`
  query GetVideoByExId($videoExId: String!, $projectExId: String!) {
    getVideoByExId(videoExId: $videoExId, projectExId: $projectExId) {
      url(projectExId: $projectExId)
    }
  }
`;

export const GQL_GET_FILE_BY_EX_ID = gql`
  query GetFileByExId($fileExId: String!, $projectExId: String!) {
    getFileByExId(fileExId: $fileExId, projectExId: $projectExId) {
      url(projectExId: $projectExId)
    }
  }
`;

export const GQL_GET_IMAGE_LIST_BY_EX_IDS = gql`
  query GetImageListByExIds(
    $imageExIds: [String]
    $projectExId: String!
    $option: ImageProcessOptionInput
  ) {
    getImageListByExIds(imageExIds: $imageExIds, projectExId: $projectExId) {
      url(option: $option, projectExId: $projectExId)
    }
  }
`;
