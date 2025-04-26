import { gql } from '@apollo/client';

export const GQL_GET_PROJECT_TEMPLATE = gql`
  query GetProjectTemplate($visibility: Visibility!) {
    projectTemplates(visibility: $visibility) {
      edges {
        node {
          coverImage {
            url
          }
          description
          exId
          name
          previewImages {
            url
          }
          templatePreviewQrCodeLink {
            url
          }
        }
      }
    }
  }
`;
