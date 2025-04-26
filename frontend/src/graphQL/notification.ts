import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const GQL_WECHAT_MESSAGE_TEMPLATE_LIST = gql`
  query WechatMessageTemplateList($projectExId: String!) {
    wechatMessageTemplateList(projectExId: $projectExId) {
      templateContent
      templateExample
      templateId
      templateTitle
      type
    }
  }
`;
