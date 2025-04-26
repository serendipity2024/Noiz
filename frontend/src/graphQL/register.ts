/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_REGISTER = gql`
  mutation Register(
    $username: String!
    $password: String!
    $email: String
    $phoneNumber: String
    $verificationCode: String!
    $channel: String
  ) {
    register(
      username: $username
      password: $password
      email: $email
      phoneNumber: $phoneNumber
      verificationCode: $verificationCode
      sourceChannel: $channel
    ) {
      accessToken
      roleNames
    }
  }
`;

export default GQL_REGISTER;
