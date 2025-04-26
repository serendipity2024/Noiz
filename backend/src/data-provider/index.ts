
import { GetListParams, GetOneParams, UpdateParams, CreateParams, DeleteParams, 
    DeleteManyParams, GetManyParams, GetManyReferenceParams, DataProvider, UpdateManyParams
} from 'ra-core';
import { ApolloClient, gql } from '@apollo/client';
import { 
    genCreateMutation, genDeleteManyMutation, genDeleteMutation, 
    genGetManyQuery, genGetManyReferenceQuery, 
    genListQuery, genOneQuery, genUpdateManyMutation, genUpdateMutation, processMediaData, processReferenceData } from './QueryGenerator'
import { string } from 'prop-types';
    
export type RaParams = GetListParams | GetOneParams | UpdateParams | CreateParams | DeleteParams | DeleteManyParams;

export default function buildDataProvider(client: any): DataProvider {
    return {
        async getList(resource: string, params: GetListParams) {
            const queryAndVariables = genListQuery(resource, params);
            const query = gql(queryAndVariables.query);
            const result = (await client.query({
                query, 
                variables: queryAndVariables.variables
            })).data;
            let data = result[queryAndVariables.dataFieldName];
            data = data.map((d: Record<string, any>) => processMediaData(d, resource));
            return {
                data, 
                total: result[queryAndVariables.dataFieldName + '_aggregate'].aggregate.count
            };
        },
        async getOne(resource: string, params: GetOneParams) {
            const queryAndVariables = genOneQuery(resource, params);
            let res = await client.query({
                query: gql(queryAndVariables.query), 
                variables: queryAndVariables.variables
            });
            let data = res.data[queryAndVariables.dataFieldName];
            data = processMediaData(data, resource);
            data = processReferenceData(data, resource);
            return { data };
        },
        async getMany(resource: string, params: GetManyParams) {
            const queryAndVariables = genGetManyQuery(resource, params);
            const res = await client.query({
                query: gql(queryAndVariables.query), 
                variables: queryAndVariables.variables
            });
            let data = res.data[queryAndVariables.dataFieldName];
            data = data.map((d: Record<string, any>) => processMediaData(d, resource));
            return { data }
        },
        async getManyReference(resource: string, params: GetManyReferenceParams) {
            const queryAndVariables = genGetManyReferenceQuery(resource, params);
            const query = gql(queryAndVariables.query);
            const result = (await client.query({
                query, 
                variables: queryAndVariables.variables
            })).data;
            return {
                data: result[resource], 
                total: result[queryAndVariables.dataFieldName + '_aggregate'].aggregate.count
            };
        },
        async update(resource: string, params: UpdateParams) {
            const mutationAndVariable = 
                await genUpdateMutation(resource, params, client as any as ApolloClient<any>);
            const res = await client.mutate({
                mutation: gql(mutationAndVariable.mutation),
                variables: mutationAndVariable.variables
            });
            return {data: res.data[mutationAndVariable.dataFieldName]};
        },
        async updateMany(resource: string, params: UpdateManyParams) {
            // only used by react-admin-import-csv for now
            // to distinguish, use isArray(params.data)
            const mutationAndVariable = 
                await genUpdateManyMutation(resource, params, client as any as ApolloClient<any>);
            const res = await client.mutate({
                mutation: gql(mutationAndVariable.mutation),
                variables: mutationAndVariable.variables
            });
            return {data: res.data[mutationAndVariable.dataFieldName]['returning'].map((value: any) => value.id)};
        },
        async create(resource: string, params: CreateParams) {
            const mutationAndVariable = 
                await genCreateMutation(resource, params, client as any as ApolloClient<any>);
            const res = await client.mutate({
                mutation: gql(mutationAndVariable.mutation), 
                variables: mutationAndVariable.variables
            });
            return { data: res.data[mutationAndVariable.dataFieldName]};
        },
        async delete(resource: string, params: DeleteParams) {
            const mutationAndVariable = genDeleteMutation(resource, params);
            const res = await client.mutate({
                mutation: gql(mutationAndVariable.mutation),
                variables: mutationAndVariable.variables
            });
            return {data: res.data[mutationAndVariable.dataFieldName]};
        },
        async deleteMany(resource: string, params: DeleteManyParams) {
            const typedParams = params as any as DeleteManyParams;
            const mutationAndVariable = genDeleteManyMutation(resource, typedParams);
            const res = await client.mutate({
                mutation: gql(mutationAndVariable.mutation), 
                variables: mutationAndVariable.variables
            });
            // needs fixing
            return { data: res.data[mutationAndVariable.dataFieldName].returning }
        }
    }
}