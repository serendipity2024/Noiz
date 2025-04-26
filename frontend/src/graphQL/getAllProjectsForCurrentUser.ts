/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_GET_ALL_PROJECTS_FOR_CURRENT_USER = gql`
  query GetAllProjectsForCurrentUser {
    allProjects {
      exId
      projectName
      collaboratorType
      projectOwner
      lastUploadedSchema {
        createdAt
      }
    }
  }
`;

export default GQL_GET_ALL_PROJECTS_FOR_CURRENT_USER;
