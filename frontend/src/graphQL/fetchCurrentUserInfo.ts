/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import { GQL_ACCOUNT_FRAGMENT } from './fragments/accountFragment';

export const GQL_FETCH_CURRENT_USER_INFO = gql`
  query FetchCurrentUserInfo {
    user {
      ...accountFragment
    }
  }
  ${GQL_ACCOUNT_FRAGMENT}
`;

export default GQL_FETCH_CURRENT_USER_INFO;
