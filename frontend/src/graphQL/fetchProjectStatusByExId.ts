/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_STATUS_FRAGMENT from './fragments/projectStatusFragment';

const GQL_FETCH_PROJECT_STATUS_BY_EX_ID = gql`
  query FetchProjectStatusByExId($projectExId: String!) {
    project(projectExId: $projectExId) {
      ...ProjectStatusFragment
    }
  }
  ${GQL_PROJECT_STATUS_FRAGMENT}
`;

export default GQL_FETCH_PROJECT_STATUS_BY_EX_ID;
