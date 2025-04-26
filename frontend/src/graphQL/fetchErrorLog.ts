/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_FETCH_ERROR_LOG_BY_EX_ID = gql`
  query FetchErrorLogByExId($projectExId: String!, $status: [DeploymentStatus]) {
    deploymentOutputLog(projectExId: $projectExId, status: $status) {
      log
      status
    }
  }
`;

export default GQL_FETCH_ERROR_LOG_BY_EX_ID;
