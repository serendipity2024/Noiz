import { gql } from '@apollo/client';

export const GQL_REMOVE_ACCOUNT_FROM_PROJECT = gql`
  mutation RemoveAccountFromProject($collaboratorExId: String!, $projectExId: String!) {
    removeAccountFromProject(collaboratorExId: $collaboratorExId, projectExId: $projectExId)
  }
`;
