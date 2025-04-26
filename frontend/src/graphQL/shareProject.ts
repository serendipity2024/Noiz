/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

export const GQL_GENERATE_SHARE_TOKEN = gql`
  query GenerateShareToken($projectExId: String!, $collaboratorType: CollaboratorType!) {
    generateShareToken(projectExId: $projectExId, collaboratorType: $collaboratorType) {
      code
    }
  }
`;

export const GQL_JOIN_PROJECT_BY_SHARE_TOKEN = gql`
  mutation JoinProjectByShareToken($code: String!) {
    joinProjectByShareToken(code: $code) {
      exId
    }
  }
`;
