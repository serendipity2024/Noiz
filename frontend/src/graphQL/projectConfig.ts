/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_EMAIL_CONFIG_FRAGMENT from './fragments/emailConfigFragment';
import GQL_PROJECT_CONFIG_FRAGMENT from './fragments/projectConfigFragment';
import GQL_SMS_CONFIG_FRAGMENT from './fragments/smsConfigFragment';
import GQL_WECHAT_CONFIG_FRAGMENT from './fragments/wechatConfigFragment';

const GQL_FETCH_PROJECT_CONFIG_BY_EX_ID = gql`
  query FetchProjecConfigByExId($projectExId: String!) {
    project(projectExId: $projectExId) {
      projectConfig {
        ...ProjectConfigFragment
      }
    }
  }
  ${GQL_PROJECT_CONFIG_FRAGMENT}
`;

export default GQL_FETCH_PROJECT_CONFIG_BY_EX_ID;

export const GQL_SET_WECHAT_APP_SETTINGS = gql`
  mutation SetWechatAppSettings(
    $projectExId: String!
    $wechatAppId: String!
    $wechatAppSecret: String!
  ) {
    setWechatAppSettings(
      projectExId: $projectExId
      wechatAppId: $wechatAppId
      wechatAppSecret: $wechatAppSecret
    ) {
      projectConfig {
        wechatAppConfig {
          ...WechatConfigFragment
        }
      }
    }
  }
  ${GQL_WECHAT_CONFIG_FRAGMENT}
`;

export const GQL_SET_WECHAT_PAYMENT_SETTINGS = gql`
  mutation SetWechatPaymentSettings(
    $projectExId: String!
    $wechatPaymentMerchantId: String!
    $wechatPaymentMerchantKey: String!
  ) {
    setWechatPaymentSettings(
      projectExId: $projectExId
      wechatPaymentMerchantId: $wechatPaymentMerchantId
      wechatPaymentMerchantKey: $wechatPaymentMerchantKey
    ) {
      projectConfig {
        wechatAppConfig {
          ...WechatConfigFragment
        }
      }
    }
  }
  ${GQL_WECHAT_CONFIG_FRAGMENT}
`;

export const GQL_SET_PROJECT_CLOUD_CONFIG = gql`
  mutation SetProjectCloudConfiguration($projectExId: String!, $cloudConfigurationExId: String!) {
    setProjectCloudConfiguration(
      projectExId: $projectExId
      cloudConfigurationExId: $cloudConfigurationExId
    )
  }
`;

export const GQL_SET_EMAIL_CONFIG = gql`
  mutation SetEmailConfig($projectExId: String!, $emailConfig: EmailConfigInput!) {
    setEmailConfig(projectExId: $projectExId, emailConfig: $emailConfig) {
      projectConfig {
        emailConfig {
          ...EmailConfigFragment
        }
      }
    }
  }
  ${GQL_EMAIL_CONFIG_FRAGMENT}
`;

export const GQL_SET_ALIYUN_SMS_ATTORNEY = gql`
  mutation SetAliyunSmsAttorney($powerOfAttorneyImageExId: String!, $projectExId: String!) {
    setAliyunSmsCertifiedPowerOfAttorneyImage(
      projectExId: $projectExId
      powerOfAttorneyImageExId: $powerOfAttorneyImageExId
    ) {
      projectConfig {
        aliyunSmsConfig {
          ...SmsConfigFragment
        }
      }
    }
  }
  ${GQL_SMS_CONFIG_FRAGMENT}
`;

export const GQL_SET_ALIYUN_SMS_SIGNATURE = gql`
  mutation SetAliyunSmsSignature($projectExId: String!, $signature: AliyunSmsSignatureInput!) {
    setAliyunSmsSignature(projectExId: $projectExId, signature: $signature) {
      projectConfig {
        aliyunSmsConfig {
          ...SmsConfigFragment
        }
      }
    }
  }
  ${GQL_SMS_CONFIG_FRAGMENT}
`;

export const GQL_SET_ALIYUN_SMS = gql`
  mutation SetAliyunSms(
    $powerOfAttorneyImageExId: String!
    $signature: AliyunSmsSignatureInput!
    $projectExId: String!
  ) {
    setAliyunSmsCertifiedPowerOfAttorneyImage(
      projectExId: $projectExId
      powerOfAttorneyImageExId: $powerOfAttorneyImageExId
    ) {
      projectConfig {
        aliyunSmsConfig {
          ...SmsConfigFragment
        }
      }
    }
    setAliyunSmsSignature(projectExId: $projectExId, signature: $signature) {
      projectConfig {
        aliyunSmsConfig {
          ...SmsConfigFragment
        }
      }
    }
  }
  ${GQL_SMS_CONFIG_FRAGMENT}
`;

export const GQL_SET_BUSINESS_LICENSE_IMAGE = gql`
  mutation SetBusinessLicenseImage($projectExId: String!, $businessLicenseImageExId: String!) {
    setBusinessLicenseImage(
      projectExId: $projectExId
      businessLicenseImageExId: $businessLicenseImageExId
    ) {
      projectConfig {
        businessLicenseImageExId
      }
    }
  }
`;
