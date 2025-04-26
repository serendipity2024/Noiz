import { gql } from '@apollo/client';

export const GQL_FETCH_PROJECT_ACCOUNTS = gql`
  query FetchProjectAccounts($projectExId: String!) {
    projectAccounts(projectExId: $projectExId) {
      edges {
        node {
          exId
          displayName
          projectCollaboratorType(projectExId: $projectExId)
        }
      }
    }
  }
`;
