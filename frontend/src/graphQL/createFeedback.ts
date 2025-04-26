/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_CREATE_FEEDBACK = gql`
  mutation CreateFeedback($message: String, $miscData: Json, $mediaUrls: [String]) {
    createFeedback(message: $message, miscData: $miscData, mediaUrls: $mediaUrls) {
      __typename
    }
  }
`;

export default GQL_CREATE_FEEDBACK;
