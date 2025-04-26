/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

const GQL_FUNCTOR_FRAGMENT = gql`
  fragment FunctorFragment on Functor {
    id
    apiVersion
    createdAt
    displayName
    invokeApiName
    type
    uniqueId
    inputSchema
    outputSchema
  }
`;

export default GQL_FUNCTOR_FRAGMENT;
