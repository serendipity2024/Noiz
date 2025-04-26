/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "AuthPayload";
  accessToken: string;
  roleNames: string[];
}

export interface Register {
  register: Register_register;
}

export interface RegisterVariables {
  username: string;
  password: string;
  email?: string | null;
  phoneNumber?: string | null;
  verificationCode: string;
  channel?: string | null;
}
