/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

export const GQL_FETCH_ALIYUN_SMS_SIGNATURE_STATUS = gql`
  query FetchAliyunSmsSignatureStatus($projectExId: String!) {
    aliyunSmsSignatureStatus(projectExId: $projectExId) {
      signStatus
      reason
    }
  }
`;

export default GQL_FETCH_ALIYUN_SMS_SIGNATURE_STATUS;
