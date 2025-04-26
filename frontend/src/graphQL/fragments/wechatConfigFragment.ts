/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_WECHAT_CONFIG_FRAGMENT = gql`
  fragment WechatConfigFragment on WechatAppConfig {
    wechatAppId
    wechatAppSecret
    hasGrantedThirdPartyAuthorization
    wechatPaymentMerchantId
    wechatPaymentMerchantKey
    wechatPaymentNotifyUrl
  }
`;

export default GQL_WECHAT_CONFIG_FRAGMENT;
