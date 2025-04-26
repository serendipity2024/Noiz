/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_WECHAT_AUDIT_FRAGMENT = gql`
  fragment WechatAuditFragment on WechatApiGetLatestAuditStatusResponseEntity {
    auditId
    reason
    screenShot
    status
    createdAt
    published
  }
`;

export default GQL_WECHAT_AUDIT_FRAGMENT;
