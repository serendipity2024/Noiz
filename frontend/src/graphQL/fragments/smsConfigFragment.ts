/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_SMS_CONFIG_FRAGMENT = gql`
  fragment SmsConfigFragment on AliyunSmsConfig {
    powerOfAttorneyImageExId
    signature {
      description
      signSource
      signature
    }
  }
`;

export default GQL_SMS_CONFIG_FRAGMENT;
