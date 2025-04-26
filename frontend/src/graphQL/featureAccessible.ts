import { gql } from '@apollo/client';

export const GQL_FEATURE_ACCESSIBLE = gql`
  query AllFeatures($projectExId: String) {
    allFeatures(projectExId: $projectExId) {
      featureName
      enabled
    }
  }
`;
