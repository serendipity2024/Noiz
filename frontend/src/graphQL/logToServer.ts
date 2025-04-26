/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_LOG_TO_SERVER = gql`
  mutation LogToServer($logs: [ClientLogEntryInput]!) {
    log(logs: $logs)
  }
`;

export default GQL_LOG_TO_SERVER;
