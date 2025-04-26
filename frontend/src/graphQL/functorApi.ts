/* eslint-disable import/prefer-default-export */
import { gql, ApolloClient } from '@apollo/client';
import GQL_FUNCTOR_FRAGMENT from './fragments/functorFragment';
import {
  FetchProjectSchemaExId,
  FetchProjectSchemaExIdVariables,
} from './__generated__/FetchProjectSchemaExId';
import { CreateFunctor, CreateFunctorVariables } from './__generated__/CreateFunctor';
import { FunctorApi } from '../shared/type-definition/FunctorSchema';
import { AllStores } from '../mobx/StoreContexts';
import { FunctorSchema } from '../components/data-model/FunctorCreateForm';

export const GQL_CREATE_FUNCTORS = gql`
  mutation CreateFunctors($functorDefinitions: Json!, $projectExId: String!) {
    createFunctors(functorDefinitions: $functorDefinitions, projectExId: $projectExId) {
      ...FunctorFragment
    }
  }
  ${GQL_FUNCTOR_FRAGMENT}
`;

/*
 * TODO:
 * Save functor when upload schema
 */

export const GQL_CREATE_FUNCTOR = gql`
  mutation CreateFunctor($functor: FunctorCreationInputInput!, $schemaExId: String!) {
    addFunctorToProjectSchema(input: $functor, schemaExId: $schemaExId) {
      ...FunctorFragment
    }
  }
  ${GQL_FUNCTOR_FRAGMENT}
`;

export const GQL_FETCH_PROJECT_SCHEMA_EXID = gql`
  query FetchProjectSchemaExId($projectExId: String!) {
    project(projectExId: $projectExId) {
      lastUploadedSchema {
        exId
      }
    }
  }
`;

export const hackCreateFunctor = async (
  client: ApolloClient<any>,
  projectExId: string,
  functor: FunctorSchema
): Promise<void> => {
  const {
    data: { project },
  } = await client.query<FetchProjectSchemaExId, FetchProjectSchemaExIdVariables>({
    query: GQL_FETCH_PROJECT_SCHEMA_EXID,
    variables: {
      projectExId,
    },
  });
  if (project?.lastUploadedSchema?.exId) {
    const { data } = await client.mutate<CreateFunctor, CreateFunctorVariables>({
      mutation: GQL_CREATE_FUNCTOR,
      variables: {
        functor,
        schemaExId: project.lastUploadedSchema.exId,
      },
    });
    if (data?.addFunctorToProjectSchema) {
      AllStores.coreStore.addFunctor(data.addFunctorToProjectSchema as FunctorApi);
    }
  }
};
