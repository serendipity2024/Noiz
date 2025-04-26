/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_PROJECT_STATUS_FRAGMENT = gql`
  fragment ProjectStatusFragment on Project {
    exId
    deploymentStatus
    wechatMiniAppLink
    wechatMiniAppQRCodeLink
    wechatMiniAppQRCodeBase64
  }
`;

export default GQL_PROJECT_STATUS_FRAGMENT;
