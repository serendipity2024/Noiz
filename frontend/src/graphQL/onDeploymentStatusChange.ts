/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_STATUS_FRAGMENT from './fragments/projectStatusFragment';

const GQL_ON_DEPLOYMENT_STATUS_CHANGE = gql`
  subscription OnDeploymentStatusChanged($projectExId: String!) {
    onDeploymentStatusChanged(projectExId: $projectExId) {
      ...ProjectStatusFragment
    }
  }
  ${GQL_PROJECT_STATUS_FRAGMENT}
`;

export default GQL_ON_DEPLOYMENT_STATUS_CHANGE;
