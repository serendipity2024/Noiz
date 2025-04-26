/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const VALIDATE_LEGAL_TABLE_NAME = gql`
  query ValidateLegalTableName($tableName: String!, $existTableSet: [String]!) {
    validateLegalTableName(tableName: $tableName, existTableSet: $existTableSet)
  }
`;

export default VALIDATE_LEGAL_TABLE_NAME;
