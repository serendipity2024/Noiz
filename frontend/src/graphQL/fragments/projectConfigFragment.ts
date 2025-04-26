/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_WECHAT_CONFIG_FRAGMENT from './wechatConfigFragment';
import GQL_HASURA_CONFIG_FRAGMENT from './hasuraConfigFragment';
import GQL_SMS_CONFIG_FRAGMENT from './smsConfigFragment';
import GQL_EMAIL_CONFIG_FRAGMENT from './emailConfigFragment';

const GQL_PROJECT_CONFIG_FRAGMENT = gql`
  fragment ProjectConfigFragment on ProjectConfig {
    wechatAppConfig {
      ...WechatConfigFragment
    }
    hasuraConfig {
      ...HasuraConfigFragment
    }
    aliyunSmsConfig {
      ...SmsConfigFragment
    }
    emailConfig {
      ...EmailConfigFragment
    }
    registerToken
    businessLicenseImageExId
  }
  ${GQL_HASURA_CONFIG_FRAGMENT}
  ${GQL_WECHAT_CONFIG_FRAGMENT}
  ${GQL_SMS_CONFIG_FRAGMENT}
  ${GQL_EMAIL_CONFIG_FRAGMENT}
`;

export default GQL_PROJECT_CONFIG_FRAGMENT;
