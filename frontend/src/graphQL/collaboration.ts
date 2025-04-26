import { gql } from '@apollo/client';
import GQL_SCHEMA_DIFF_FRAGMENT from './fragments/schemaDiffFragment';

export const GQL_ON_SCHEMA_DIFF = gql`
  subscription OnNewSchemaDiff($schemaExId: String!) {
    onNewSchemaDiff(schemaExId: $schemaExId, shouldExcludeSameSessionDiffs: true) {
      ...SchemaDiffFragment
    }
  }
  ${GQL_SCHEMA_DIFF_FRAGMENT}
`;

export const GQL_ON_COLLABORATION = gql`
  subscription OnCollaborationEvent($projectExId: String!) {
    onCollaborationEvent(projectExId: $projectExId, shouldExcludeSameSessionChanges: true) {
      changeType
      firstDiffWithError {
        ...SchemaDiffFragment
      }
    }
  }
  ${GQL_SCHEMA_DIFF_FRAGMENT}
`;

export const GQL_CREATE_SCHEMA_DIFF = gql`
  mutation CreateSchemaDiff(
    $schemaExId: String!
    $uuid: UUID!
    $content: Json!
    $zedVersion: String!
  ) {
    createSchemaDiff(
      schemaExId: $schemaExId
      uuid: $uuid
      content: $content
      zedVersion: $zedVersion
    ) {
      ...SchemaDiffFragment
    }
  }
  ${GQL_SCHEMA_DIFF_FRAGMENT}
`;

export const GQL_SCHEMA_DIFFS = gql`
  query SchemaDiffs(
    $schemaExId: String!
    $startSeq: Long
    $endSeq: Long
    $shouldExcludeSameSessionDiffs: Boolean!
  ) {
    schemaDiffs(
      schemaExId: $schemaExId
      startSeq: $startSeq
      endSeq: $endSeq
      shouldExcludeSameSessionDiffs: $shouldExcludeSameSessionDiffs
    ) {
      ...SchemaDiffFragment
    }
  }
  ${GQL_SCHEMA_DIFF_FRAGMENT}
`;

export const GQL_REPORT_DIFF_ERROR = gql`
  mutation ReportDiffError($schemaExId: String!, $uuid: UUID!) {
    reportDiffError(schemaExId: $schemaExId, uuid: $uuid)
  }
`;
