/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_HASURA_CONFIG_FRAGMENT = gql`
  fragment HasuraConfigFragment on HasuraConfig {
    rootUrl
    adminSecret
  }
`;

export default GQL_HASURA_CONFIG_FRAGMENT;
