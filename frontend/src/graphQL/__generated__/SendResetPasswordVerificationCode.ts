/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SendMethod } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SendResetPasswordVerificationCode
// ====================================================

export interface SendResetPasswordVerificationCode {
  sendResetPasswordVerificationCode: boolean;
}

export interface SendResetPasswordVerificationCodeVariables {
  sendTo?: string | null;
  method: SendMethod;
}
