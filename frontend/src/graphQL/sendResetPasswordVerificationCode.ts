import { gql } from '@apollo/client';

export const GQL_SEND_RESETPASSWORD_VERIFICATION_CODE = gql`
  mutation SendResetPasswordVerificationCode($sendTo: String, $method: SendMethod!) {
    sendResetPasswordVerificationCode(sendTo: $sendTo, method: $method)
  }
`;
