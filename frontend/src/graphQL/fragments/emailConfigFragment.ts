/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_EMAIL_CONFIG_FRAGMENT = gql`
  fragment EmailConfigFragment on EmailConfig {
    emailPassword
    emailProvider
    emailSender
  }
`;

export default GQL_EMAIL_CONFIG_FRAGMENT;
