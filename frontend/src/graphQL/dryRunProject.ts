/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_DRY_RUN_PROJECT = gql`
  mutation DryRunProject($appSchema: Json!, $buildTarget: BuildTarget!, $projectExId: String!) {
    dryRun(appSchema: $appSchema, buildTarget: $buildTarget, projectExId: $projectExId) {
      createdAt
      result
      succeed
    }
  }
`;

export default GQL_DRY_RUN_PROJECT;
