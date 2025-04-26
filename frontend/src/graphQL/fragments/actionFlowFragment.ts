import { gql } from '@apollo/client';

export const ACTION_FLOWS = gql`
  fragment actionFlowsFragment on ActionFlow {
    uniqueId
    displayName
    inputArgs
    outputValues
    startNodeId
    versionId
    schemaVersion
    allNodes {
      ... on FlowEnd {
        uniqueId
        type
      }
      ... on RunCustomCode {
        type
        uniqueId
        inputArgs
        outputValues
        code
        andThenNodeId
      }
    }
  }
`;
