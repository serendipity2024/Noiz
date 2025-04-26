/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_PROJECT_SCHEMA_JSON from './appSchemaFragment';
import GQL_PROJECT_CONFIG_FRAGMENT from './projectConfigFragment';
import GQL_PROJECT_STATUS_FRAGMENT from './projectStatusFragment';

const GQL_PROJECT_DETAILS_FRAGMENT = gql`
  fragment ProjectDetailsFragment on Project {
    projectName
    collaboratorType
    schemaExId
    debugScriptUrl
    mobileWebUrl
    customizedMcUrl
    customizedMcDefaultPassword
    managementConsoleUrl(
      deploymentEnvConfigName: "production"
      userDeploymentEnvironment: PRODUCTION
    )
    lastUploadedSchema {
      exId
      appSchema {
        ...AppSchemaFragment
      }
    }
    schemaHistory {
      exId
      createdAt
    }
    hasBindCloudConfiguration
    projectConfig {
      ...ProjectConfigFragment
    }
    ...ProjectStatusFragment
  }
  ${GQL_PROJECT_SCHEMA_JSON}
  ${GQL_PROJECT_CONFIG_FRAGMENT}
  ${GQL_PROJECT_STATUS_FRAGMENT}
`;

export default GQL_PROJECT_DETAILS_FRAGMENT;
