/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_DETAILS_FRAGMENT from './fragments/projectDetailsFragment';

const GQL_FETCH_PROJECT_DETAILS_BY_EX_ID = gql`
  query FetchProjectDetailsByExId($projectExId: String!) {
    project(projectExId: $projectExId) {
      ...ProjectDetailsFragment
    }
  }
  ${GQL_PROJECT_DETAILS_FRAGMENT}
`;

export default GQL_FETCH_PROJECT_DETAILS_BY_EX_ID;
