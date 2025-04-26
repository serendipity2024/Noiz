import { gql } from '@apollo/client';

export const GQL_SET_USERNAME = gql`
  mutation SetUsername($username: String!) {
    setUsername(username: $username) {
      username
    }
  }
`;
