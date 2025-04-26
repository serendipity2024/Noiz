import { gql } from '@apollo/client';

export const GQL_GET_ALL_CLOUD_CONFIGURATIONS = gql`
  query getAllCloudConfigurations {
    allCloudConfigurations {
      exId
      name
      bucket
      provider
    }
  }
`;
