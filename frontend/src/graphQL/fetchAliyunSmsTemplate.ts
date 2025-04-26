/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

export const GQL_SET_SMS_NOTIFICATION_TEMPLATE = gql`
  mutation SetAliyunSmsTemplates(
    $projectExId: String!
    $templates: [AliyunSmsTemplateParamsInput!]!
  ) {
    setAliyunSmsTemplates(projectExId: $projectExId, templates: $templates) {
      createdAt
      reason
      templateCode
      templateContent
      templateDescription
      templateName
      templateStatus
      templateType
    }
  }
`;

export const GQL_FETCH_SMS_NOTIFICATION_TEMPLATE = gql`
  query FetchAliyunSmsTemplatesStatus($projectExId: String!) {
    aliyunSmsTemplatesStatus(projectExId: $projectExId) {
      templateCode
      createdAt
      reason
      templateContent
      templateDescription
      templateName
      templateStatus
      templateType
    }
  }
`;

export const GQL_DELETE_SMS_NOTIFICATION_TEMPLATE = gql`
  mutation DeleteAliyunSmsTemplates($projectExId: String!, $templateCode: String!) {
    deleteAliyunSmsTemplates(projectExId: $projectExId, templateCode: $templateCode)
  }
`;
