import { gql } from '@apollo/client/core';
import { GQL_ACCOUNT_FRAGMENT } from './fragments/accountFragment';

export const GQL_UPDATE_ACCOUNT_PROFILE = gql`
  mutation updateAccountProfile($values: AccountProfileInput!) {
    updateAccountProfile(values: $values) {
      ...accountFragment
    }
  }
  ${GQL_ACCOUNT_FRAGMENT}
`;
