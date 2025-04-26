import { gql } from '@apollo/client';

export const GQL_IMMUTABLE_APP_SCHEMA = gql`
  query FetchImmutableDataModel($projectExId: String!, $schemaExId: String!) {
    project(projectExId: $projectExId) {
      projectSchema(schemaExId: $schemaExId) {
        immutableAppSchema {
          dataModel
        }
      }
    }
  }
`;
