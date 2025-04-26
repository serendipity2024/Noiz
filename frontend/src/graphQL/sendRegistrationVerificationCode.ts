/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_SEND_REGISTRATION_VERIFICATION_CODE = gql`
  mutation SendRegistrationVerificationCode($sendTo: String!, $method: SendMethod!) {
    sendRegistrationVerificationCode(sendTo: $sendTo, method: $method)
  }
`;

export default GQL_SEND_REGISTRATION_VERIFICATION_CODE;
