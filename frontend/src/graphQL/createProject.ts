/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_DETAILS_FRAGMENT from './fragments/projectDetailsFragment';

const GQL_CREATE_PROJECT = gql`
  mutation CreateProject($projectName: String!, $templateExId: String) {
    createProject(projectName: $projectName, templateExId: $templateExId) {
      ...ProjectDetailsFragment
    }
  }
  ${GQL_PROJECT_DETAILS_FRAGMENT}
`;

export default GQL_CREATE_PROJECT;
