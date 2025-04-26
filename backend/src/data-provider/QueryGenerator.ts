import dataModel from './schema/dataModel.json';
import _, { includes, isArray, isObject, keys } from 'lodash';
import { TableMetadata, ColumnMetadata, MediaType, RelationMetadata } from './type-definition/DataModel';
import { CreateParams, DataProviderResult, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams, UpdateParams, UpdateManyParams } from 'ra-core';
import { ApolloClient, gql } from '@apollo/client';
import uploadImage, { uploadFile, uploadImages, uploadVideo } from './uploadUtils';
import { auditEnabled } from '../config';

const tableByName = _.keyBy(dataModel.tableMetadata as unknown as TableMetadata[], 'name');
const relationBySourceTableName = _.groupBy(dataModel.relationMetadata as unknown as RelationMetadata[], 'sourceTable');
const relationByTargetTableName = _.groupBy(dataModel.relationMetadata as unknown as RelationMetadata[], 'targetTable');

export type QueryAndVariables = {
  dataFieldName: string;
  query: string;
  variables: Record<string, any>;
}

export type MutationAndVariables = {
  dataFieldName: string;
  mutation: string;
  variables: Record<string, any>;
}

export function genListQuery(tableName: string, params: GetListParams): QueryAndVariables {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  return topLevelQueryFieldToQueryString(tableQueryField, params);
}

export function genOneQuery(tableName: string, params: GetOneParams): QueryAndVariables {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const argsDecString = `($id:bigint!)`;
  const variables = { "id": params.id };
  const dataFieldName = `${tableName}_by_pk`;
  const query = `query get${tableName}One ${argsDecString} {
    ${dataFieldName} (id: $id) {
      ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
      ${(relationBySourceTableName[tableName] ?? [])
      .map((relation) => `${relation.nameInSource} { id }`).join('\n')}
      ${(relationByTargetTableName[tableName] ?? []).filter((relation) => relation.type === 'MANY_TO_MANY')
      .map((relation) => `${relation.nameInTarget} { id }`).join('\n')}
    }
  }
  `
  return { variables, query, dataFieldName };
}

export function genDeleteMutation(tableName: string, params: DeleteParams): MutationAndVariables {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  let argsDec: Record<string, string> = { id: "bigint!" };
  let variables: Record<string, any> = { id: params.id };
  const dataFieldName = `delete_${tableName}_by_pk`;
  let mutation = genDeleteMutationQueryString(tableName, argsDec, dataFieldName, tableQueryField)
  if (auditEnabled) {
    const auditMutation = genAuditMutation(variables, mutation);
    ({ argsDec, variables } = augmentArgsDecAndVariables(argsDec, variables, auditMutation));
    mutation = genDeleteMutationQueryString(tableName, argsDec, dataFieldName, tableQueryField, auditMutation.auditMutationString);
  }
  return { variables, mutation, dataFieldName };
}

function genDeleteMutationQueryString(tableName: string, argsDec: Record<string, string>, dataFieldName: string, tableQueryField: QueryField, auditQueryString?: string) {
  return `mutation delete${tableName}One ${genArgsDecString(argsDec)} {
    ${dataFieldName} (id: $id) {
      ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
    }
    ${auditQueryString ?? ''}
  }`;
}

export function genDeleteManyMutation(tableName: string, params: DeleteManyParams): MutationAndVariables {
  const idsVarName = 'ids';
  let argsDec: Record<string, string> = {
    [idsVarName]: '[bigint!]!'
  };
  const argsUseString = `(where: { id: {_in:$${idsVarName}}})`
  let variables: Record<string, any> = { [idsVarName]: params.ids };
  const dataFieldName = `delete_${tableName}`;
  let mutation = genDeleteManyMutationQueryString(tableName, argsDec, dataFieldName, argsUseString);
  if (auditEnabled) {
    const auditMutation = genAuditMutation(variables, mutation);
    ({ argsDec, variables } = augmentArgsDecAndVariables(argsDec, variables, auditMutation));
    mutation = genDeleteManyMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, auditMutation.auditMutationString);
  }
  return { variables, mutation, dataFieldName };
}

function genDeleteManyMutationQueryString(tableName: string, argsDec: Record<string, string>, dataFieldName: string, argsUseString: string, auditQueryString?: string) {
  return `mutation delete${tableName} ${genArgsDecString(argsDec)} {
    ${dataFieldName} ${argsUseString} {
      returning {
        id
      }
    }
    ${auditQueryString ?? ''}
  }`;
}

export async function genUpdateMutation(tableName: string, params: UpdateParams, client: ApolloClient<any>): Promise<MutationAndVariables> {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const setArgName = 'object';
  const pkArgName = 'pkObj'
  let argsDec: Record<string, string> = {
    [setArgName]: `${tableName}_set_input`,
    [pkArgName]: `${tableName}_pk_columns_input!`
  }
  let argsUseString = `(_set:$${setArgName} pk_columns:$${pkArgName})`;

  let object: Record<string, any> = {};

  let variables = {};

  Object.entries(params.data).forEach(([key, value]) => {
    if (params.previousData && _.isEqual(params.previousData[key], value)) {
      return;
    }
    object[key] = value;
  })
  let queries: string[] = [];
  const entries = await Promise.all(Object.entries(object).map(async ([key, value]) => {
    let result = [key, value];
    const relation = _.find(relationBySourceTableName[tableName], _.matches({ nameInSource: key }))
      ?? _.find(relationByTargetTableName[tableName], _.matches({ nameInTarget: key, type: 'MANY_TO_MANY' }));
    if (relation) {
      switch (relation.type) {
        case 'ONE_TO_ONE': {
          queries.push(genUpdateOneToOne(tableName, params.id.toString(), relation.targetTable, value, relation.targetColumn));
          result = [];
          break;
        }
        case 'ONE_TO_MANY': {
          queries.push(genUpdateManyToOne(tableName, params.id.toString(), relation.targetTable, value, relation.targetColumn));
          result = [];
          break;
        }
        case 'MANY_TO_MANY': {
          const { query, argName, arg } = await genUpdateManyToMany(client, relation, tableName, params.id.toString(), relation.sourceTable === tableName ? relation.targetTable : relation.sourceTable, value);
          queries.push(query);
          argsDec[`${argName}Arg`] = `[${argName}_insert_input!]!`;
          variables = { ...variables, [`${argName}Arg`]: arg };
          result = [];
          break;
        }
      }
    }
    if (_.includes(['__typename', 'id'], key)) {
      result = [];
    }
    return result;
  }));
  object = Object.fromEntries(_.reject(entries, _.isEmpty));

  await processMediaColumns(object, tableMetadata, client);

  const dataFieldName = `update_${tableName}_by_pk`;
  let mutation = genUpdateMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField, queries);
  variables = {
    [setArgName]: object,
    [pkArgName]: { id: params.data.id },
    ...variables
  };

  if (auditEnabled) {
    const auditMutation = genAuditMutation(variables, mutation);
    ({ argsDec, variables } = augmentArgsDecAndVariables(argsDec, variables, auditMutation));
    mutation = genUpdateMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField, queries, auditMutation.auditMutationString);
  }

  return {
    dataFieldName,
    mutation,
    variables
  };
}

function genUpdateMutationQueryString(tableName: string, argsDec: Record<string, string>, dataFieldName: string, argsUseString: string, tableQueryField: QueryField, queries: string[], auditQueryString?: string) {
  return `mutation update${tableName} ${genArgsDecString(argsDec)} {
    ${dataFieldName} ${argsUseString} {
      ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
    }
    ${queries.join('\n')}
    ${auditQueryString ?? ''}
  }
  `
}

export async function genUpdateManyMutation(tableName: string, params: UpdateManyParams, client: ApolloClient<any>): Promise<MutationAndVariables> {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const insertArgName = 'objects';
  let argsDec: Record<string, string> = {
    [insertArgName]: `[${tableName}_insert_input!]!`
  };
  let onConflictString = `on_conflict: {constraint: ${tableName}_pkey, update_columns: [${Object.keys(params.data[0]).join(',')}]}`
  let argsUseString = `(objects:$${insertArgName}, ${onConflictString})`;
  let variables: Record<string, any> = {
    [insertArgName]: [...params.data]
  };
  // processMediaColumns
  const dataFieldName = `insert_${tableName}`;
  let mutation = genUpdateManyMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField);

  if (auditEnabled) {
    const auditMutation = genAuditMutation(variables, mutation);
    ({ argsDec, variables } = augmentArgsDecAndVariables(argsDec, variables, auditMutation));
    mutation = genUpdateManyMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField, auditMutation.auditMutationString);
  }

  return {
    dataFieldName,
    mutation,
    variables
  }
}

function genUpdateManyMutationQueryString(tableName: string, argsDec: Record<string, string>, dataFieldName: string, argsUseString: string, tableQueryField: QueryField, auditQueryString?: string) {
  return `mutation upsert${tableName} ${genArgsDecString(argsDec)} {
    ${dataFieldName} ${argsUseString} {
      returning {
        ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
      }
    }
    ${auditQueryString ?? ''}
  }`;
}

export async function genCreateMutation(tableName: string, params: CreateParams, client: ApolloClient<any>): Promise<MutationAndVariables> {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const insertArgName = 'object';
  let argsDec: Record<string, string> = {
    [insertArgName]: `${tableName}_insert_input!`
  };
  let argsUseString = `(object:$${insertArgName})`;
  let object: Record<string, any> = { ...params.data };
  await processMediaColumns(object, tableMetadata, client);
  let variables: Record<string, any> = {
    [insertArgName]: object
  };
  const dataFieldName = `insert_${tableName}_one`;
  let mutation = genCreateMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField);
  if (auditEnabled) {
    const auditMutation = genAuditMutation(variables, mutation);
    ({ argsDec, variables } = augmentArgsDecAndVariables(argsDec, variables, auditMutation));
    mutation = genCreateMutationQueryString(tableName, argsDec, dataFieldName, argsUseString, tableQueryField, auditMutation.auditMutationString);
  }
  return {
    dataFieldName,
    mutation,
    variables
  }
}

function genCreateMutationQueryString(tableName: string, argsDec: Record<string, string>, dataFieldName: string, argsUseString: string, tableQueryField: QueryField, auditQueryString?: string) {
  return `mutation insert${tableName} ${genArgsDecString(argsDec)} {
    ${dataFieldName} ${argsUseString} {
      ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
    }
    ${auditQueryString ?? ''}
  }`
}

function genUpdateOneToOne(sourceTable: string, sourcePk: string, targetTable: string, targetPk: number, targetColumn: string) {
  return `
  delete_${sourceTable}_${targetTable}: update_${targetTable} (where: {
    ${targetColumn}: {_eq: ${sourcePk}}
  }, _set: {${targetColumn}: null}) {
    affected_rows
  }
  insert_${sourceTable}_${targetTable}: update_${targetTable} (where: {id: {_eq: ${targetPk}}}, 
    _set: {${targetColumn}: ${sourcePk}}) {
    affected_rows
  }
  `
}

function genUpdateManyToOne(sourceTable: string, sourcePk: string, targetTable: string, targetPk: number[], targetColumn: string) {
  return `
  delete_${sourceTable}_${targetTable}: update_${targetTable} (where: {_and: {
    ${targetColumn}: {_eq: ${sourcePk}}, id: {_nin: [${targetPk}]}
  }}, _set: {${targetColumn}: null}) {
    affected_rows
  }
  insert_${sourceTable}_${targetTable}: update_${targetTable} (where: {id: {_in: [${targetPk}]}}, 
    _set: {${targetColumn}: ${sourcePk}}) {
    affected_rows
  }
  `
}
async function genUpdateManyToMany(client: ApolloClient<any>, relation: RelationMetadata, sourceTable: string, sourcePk: string, targetTable: string, targetPk: number[]) {
  const tableName = await genAssociationTableName(relation);
  const queryResult = await client.query({
    query: gql`
  query CurrentOrder {
    ${tableName}(where: {${sourceTable}_id: {_eq: ${sourcePk}}}) {
      ${sourceTable}_id
      ${sourceTable}_order
      ${targetTable}_id
      ${targetTable}_order
    }
  }
  `});
  const currentOrder = queryResult.data[tableName] as any[];
  let existingOrder = _.sortBy(currentOrder.map((obj) => _.pick(obj, [`${targetTable}_id`, `${sourceTable}_order`])), `${sourceTable}_order`);
  let cumulator = 1;
  const result = targetPk.map(pk => {
    const oldOrder = _.find(existingOrder, { [`${targetTable}_id`]: pk });
    if (oldOrder) {
      existingOrder = _.filter(existingOrder, _.negate(_.matches(oldOrder)));
    }
    return {
      [`${sourceTable}_id`]: sourcePk,
      [`${sourceTable}_order`]: oldOrder?.[`${sourceTable}_order`],
      [`${targetTable}_id`]: pk,
      [`${targetTable}_order`]: (cumulator++)
    };
  });
  return {
    query: `
  delete_${tableName}(where: {${sourceTable}_id: {_eq: ${sourcePk}}}) {
    affected_rows
  }
  insert_${tableName}(objects:$${tableName}Arg) {
    affected_rows
  }
  `, argName: tableName, arg: result
  };
}

async function genAssociationTableName(relation: any) {
  const sourceViewName = `${relation.sourceTable}_${relation.nameInSource}`;
  const targetViewName = `${relation.targetTable}_${relation.nameInTarget}`;
  const associationTableNaame = relation.sourceTable.localeCompare(relation.targetTable) > 0
    ? `fz_${sourceViewName}_${targetViewName}`
    : `fz_${targetViewName}_${sourceViewName}`;
  return await hashConstraintName(associationTableNaame);
}

async function hashConstraintName(raw: string) {
  if (raw.length > 63) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    const hashString = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join('');
    return `hash_${hashString.substr(0, 55)}`;
  }
  return raw;
}

export function genGetManyQuery(tableName: string, params: GetManyParams): QueryAndVariables {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const idsVarName = 'ids';
  const argsDecString = `($${idsVarName}:[bigint!]!)`;
  const argsUseString = `(where: { id: {_in:$${idsVarName}}})`
  const variables = { [`${idsVarName}`]: params.ids };
  const dataFieldName = `${tableName}`;
  const query = `query ${tableName} ${argsDecString} {
    ${dataFieldName} ${argsUseString} {
      ${tableQueryField.subFields?.map(queryFieldToQueryString).join('\n')}
    }
  }`;
  return { variables, query, dataFieldName };
}

export function genGetManyReferenceQuery(tableName: string, params: GetManyReferenceParams): QueryAndVariables {
  const tableMetadata = tableByName[tableName] as TableMetadata;
  const tableQueryField = tableToQueryField(tableMetadata);
  const listQueryParams: GetListParams = {
    pagination: params.pagination,
    sort: params.sort,
    filter: Object.assign({ [params.target]: params.id }, params.filter)
  }

  return topLevelQueryFieldToQueryString(tableQueryField, listQueryParams);
}

async function processMediaList(mediaContent: any[], client: ApolloClient<any>) {
  const uploaded = mediaContent.filter(media => media.id);
  const toUpload = mediaContent.filter(media => !media.id);
  const uploadResult = await uploadImages(client, toUpload.map(content => content.rawFile));
  if (uploadResult === "") return ""
  else return [...uploaded, ...uploadResult]
}

async function processMediaColumns(object: Record<string, any>, tableMetadata: TableMetadata, client: ApolloClient<any>) {
  const mediaColumns = tableMetadata.columnMetadata.filter(isMedia);
  const uploadedMedia = mediaColumns.filter(mediaColumn => includes(Object.keys(object), mediaColumn.name))
    .map(mediaColumn => {
      const mediaContent: Record<string, any> = object[mediaColumn.name];
      delete object[mediaColumn.name];
      if (!mediaContent || (!isArray(mediaContent) && !mediaContent.rawFile) || (isArray(mediaContent) && mediaContent.length === 0)) {
        if (mediaColumn.type === 'IMAGE' || mediaColumn.type === 'VIDEO') {
          object[`${mediaColumn.name}_id`] = null;
        }
        else {
          object[`${mediaColumn.name}_ids`] = null;
        }
        return null;
      } else {
        if (isArray(mediaContent)) {
          return {
            name: mediaColumn.name,
            promise: processMediaList(mediaContent, client)
          };
        }
        else if (mediaColumn.type === MediaType.IMAGE) {
          return {
            name: mediaColumn.name,
            promise: uploadImage(client, mediaContent.rawFile)
          };
        }
        else if (mediaColumn.type === MediaType.VIDEO) {
          return {
            name: mediaColumn.name,
            promise: uploadVideo(client, mediaContent.rawFile)
          };
        }
        else {
          return {
            name: mediaColumn.name,
            promise: uploadFile(client, mediaContent.rawFile)
          };
        }
      }
    }).filter(promise => promise !== null).map(promise => promise!!);

  for (let i = 0; i < uploadedMedia.length; i++) {
    const uploadResult = await uploadedMedia[i].promise;
    console.log(uploadResult);
    if (uploadResult === '') {
      throw new Error('wtf');
    }
    if (isArray(uploadResult))
      object[`${uploadedMedia[i].name}_ids`] = "{" + uploadResult.map(result => result.id).join(',') + "}";
    else
      object[`${uploadedMedia[i].name}_id`] = uploadResult.id;
  }
}

export function processReferenceData(object: any, tableName: string) {
  const relationBySource = (relationBySourceTableName[tableName] ?? []).map(relation => relation.nameInSource);
  const relationByTarget = (relationByTargetTableName[tableName] ?? []).map(relation => relation.nameInTarget);
  return _.fromPairs(Object.entries(object).map(([key, value]) => {
    let result = [key, value];
    if (_.includes(relationBySource, key) || _.includes(relationByTarget, key)) {
      result = [key, _.map(value as any, 'id')];
    }
    return result;
  }));
}

export function processMediaData(object: any, tableName: string) {
  const mediaColumns = (tableByName[tableName] as TableMetadata).columnMetadata.filter(isMedia).map(column => column.name);
  return Object.fromEntries(Object.entries(object).map(([key, value]) => {
    if (_.includes(mediaColumns, key)) {
      if (isArray(value)) {
        return [key, value.map((v, index) => ({ ...v, id: object[`${key}_ids`][index] }))];
      }
      else if (isObject(value)) {
        return [key, { ...value, id: object[`${key}_id`] }];
      }
    }
    return [key, value];
  }));
}

function isMedia(column: ColumnMetadata): boolean {
  return column.type in MediaType;
}

function tableToQueryField(table: TableMetadata): QueryField {
  let result: QueryField = {
    name: table.name
  }
  result.subFields = table.columnMetadata.flatMap(columnToQueryField);
  return result;
}

function columnToQueryField(column: ColumnMetadata): QueryField[] {
  const columnType = column.type;
  let result: QueryField = {
    name: column.name
  }
  if (!(columnType in MediaType)) {
    return [result];
  }
  result.subFields = [{ name: 'url' }];
  let resultId: QueryField = {
    name: columnType === MediaType.IMAGE_LIST ? `${column.name}_ids` : `${column.name}_id`
  }
  return [result, resultId];
}

function queryFieldToQueryString(field: QueryField): string {
  const aliasStr = field.alias ? `${field.alias}: ` : '';
  const subFieldsStr = field.subFields ? `{
    ${field.subFields.map(queryFieldToQueryString).join('\n')}
  }` : '';
  return `${aliasStr} ${field.name} ${subFieldsStr}`;
}

function topLevelQueryFieldToQueryString(topLevelField: QueryField, params: GetListParams): QueryAndVariables {
  let argsDecString = '';
  let argsUseString = '';
  let variables: Record<string, any> = {};
  if (params.sort) {
    const orderByName = `${topLevelField.name}_order_bys`;
    argsDecString += `$${orderByName}: [${topLevelField.name}_order_by!] `;
    argsUseString += `order_by: $${orderByName} `;
    variables[orderByName] = [
      { [params.sort.field]: params.sort.order.toLowerCase() }
    ]
  }
  if (params.pagination) {
    const limitName = `${topLevelField.name}_limit`;
    const offsetName = `${topLevelField.name}_offset`;
    argsDecString += `$${limitName}:Int $${offsetName}:Int `;
    argsUseString += `limit:$${limitName} offset:$${offsetName} `
    variables[limitName] = params.pagination.perPage;
    variables[offsetName] = (params.pagination.page - 1) * params.pagination.perPage;
  }
  if (params.filter) {
    if (_.has(params.filter, 'q')) {
      // TODO: take into account option.name
      const whereName = 'where';
      variables[whereName] = { '_and': { id: { '_eq': params.filter.q } } };
      argsDecString += `$${whereName}:${topLevelField.name}_bool_exp `;
      argsUseString += `where:$${whereName} `;
    }
    else {
      const conditions = Object.entries(params.filter).map(([key, value]) => {
        const table = tableByName[topLevelField.name];
        if (key.endsWith('_≥')) {
          const column = table.columnMetadata.find((col) => `${col.name}_≥` === key);
          if (!column) return undefined;
          return { [column.name]: { "_gte": value } };
        }
        else if (key.endsWith('_≤')) {
          const column = table.columnMetadata.find((col) => `${col.name}_≤` === key);
          if (!column) return undefined;
          return { [column.name]: { "_lte": value } };
        }
        else {
          const column = table.columnMetadata.find((col) => col.name === key);
          if (!column) return undefined
          if (column.type === 'TEXT') {
            return { [column.name]: { "_ilike": `%${value}%` } };
          } else {
            return { [column.name]: { "_eq": value } }
          }
        }
      }).filter(condition => !!condition);
      const whereName = 'where';
      variables[whereName] = { '_and': conditions };
      argsDecString += `$${whereName}:${topLevelField.name}_bool_exp `;
      argsUseString += `where:$${whereName} `;
    }
  }

  if (argsDecString.length > 0) {
    argsDecString = `(${argsDecString})`;
  }
  if (argsUseString.length > 0) {
    argsUseString = `(${argsUseString})`;
  }
  const queryStr = `query get${topLevelField.name}s ${argsDecString} {
    ${topLevelField.name} ${argsUseString} {
      ${topLevelField.subFields?.map(queryFieldToQueryString).join('\n')}
    }
    ${topLevelField.name}_aggregate {
      aggregate {
        count
      }
    }
  }`;
  return {
    dataFieldName: topLevelField.name,
    query: queryStr,
    variables
  };
}

type AuditMutation = {
  auditArgsDec: Record<string, string>,
  auditMutationString: string,
  auditVariables: Record<string, any>
}

function genAuditMutation(variables: Record<string, any>, queryString: string): AuditMutation {
  const insertArgName = `auditObject`;
  let argsUseString = `(object:$${insertArgName})`;
  const auditMutationString = `insert_fz_audit_record_one ${argsUseString} {
    __typename
  }`;
  const auditVariables = {
    query_string: queryString,
    variables: variables,
    account_id: 1000000000000000
  }
  const auditArgsDec = {
    [insertArgName]: "fz_audit_record_insert_input!"
  }
  return {
    auditArgsDec,
    auditMutationString,
    auditVariables
  }
}

function genArgsDecString(argsDec: Record<string, string>) {
  const innerDec = Object.entries(argsDec).map(([k, v]: [string, string]) => `$${k}:${v}`).join(', ');
  return `(${innerDec})`;
}

function augmentArgsDecAndVariables(argsDec: Record<string, string>, variables: Record<string, any>, auditMutation: AuditMutation) {
  return {
    argsDec: { ...argsDec, ...auditMutation.auditArgsDec },
    variables: { ...variables, auditObject: auditMutation.auditVariables }
  };
}

export interface QueryField {
  name: string,
  alias?: string,
  args?: Record<string, any>,
  subFields?: QueryField[]
}
