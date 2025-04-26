/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

export const GQL_LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      roleNames
    }
  }
`;

export default GQL_LOGIN;
