import { gql } from '@apollo/client';

export const GQL_FETCH_ACCOUNT_TAGS = gql`
  query FetchAccountTags {
    user {
      tags {
        hasSeenIntro
        hasUpdatedUserProfile
      }
    }
  }
`;

export const GQL_UPDATE_ACCOUNT_TAGS = gql`
  mutation UpdateAccountTags($values: Map_String_ObjectScalar!) {
    updateAccountTags(values: $values) {
      username
    }
  }
`;
