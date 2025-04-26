import { gql } from '@apollo/client';

export const GQL_RESET_PASSWORD = gql`
  mutation ResetPassword(
    $sendTo: String!
    $method: SendMethod!
    $username: String!
    $password: String!
    $verificationCode: String!
  ) {
    resetPassword(
      sendTo: $sendTo
      method: $method
      password: $password
      username: $username
      verificationCode: $verificationCode
    ) {
      accessToken
    }
  }
`;
