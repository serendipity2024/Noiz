/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_SCHEMA_DIFF_FRAGMENT = gql`
  fragment SchemaDiffFragment on SchemaDiff {
    exId
    schemaId
    seq
    uuid
    zedVersion
    content
  }
`;

export default GQL_SCHEMA_DIFF_FRAGMENT;
