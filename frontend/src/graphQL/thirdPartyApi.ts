import { gql } from '@apollo/client';

export const CONVERT_API_SCHEMA_TO_GRAPHQL_SCHEMA = gql`
  query ConvertApiSchemaToGraphqlSchema($apiSchema: Json!) {
    convertApiSchemaToGraphqlSchema(apiSchema: $apiSchema)
  }
`;

export const UPLOAD_THIRD_PARTY_API_SCHEMA = gql`
  mutation UploadThirdPartyApiSchema($projectExId: String!, $thirdPartyApiSchema: Json!) {
    uploadThirdPartyApiSchema(projectExId: $projectExId, thirdPartyApiSchema: $thirdPartyApiSchema)
  }
`;
