/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_SCHEMA_JSON from './fragments/appSchemaFragment';

const GQL_GET_PROJECT_SCHEMA_BY_EX_ID = gql`
  query GetProjectSchemaByExId($projectExId: String!, $schemaExId: String!) {
    project(projectExId: $projectExId) {
      projectSchema(schemaExId: $schemaExId) {
        exId
        appSchema {
          ...AppSchemaFragment
        }
      }
    }
  }
  ${GQL_PROJECT_SCHEMA_JSON}
`;

export default GQL_GET_PROJECT_SCHEMA_BY_EX_ID;
