/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_ON_PROJECT_DELETE = gql`
  subscription OnProjectDelete($projectExId: String!) {
    onProjectDelete(projectExId: $projectExId)
  }
`;

export default GQL_ON_PROJECT_DELETE;
