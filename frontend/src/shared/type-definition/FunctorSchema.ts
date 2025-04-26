/* eslint-disable import/no-default-export */
import { FunctorType, Language } from '../../graphQL/__generated__/globalTypes';
import { ThirdPartySchema } from './ThirdPartySchema';

export interface DbInput {
  name: string;
  description: string;
  dataType: {
    pgType: string;
    isList: boolean;
  };
}

export interface RuntimeInput {
  name: string;
  description: string;
  dataType: {
    pgType: string;
    isList: boolean;
  };
}

export interface SqlArg {
  name: string;
  description: string;
  dataType: {
    pgType: string;
    isList: boolean;
  };
}

export interface DbModification {
  name: string;
  description: string;
  sql: string;
  sqlArgs: SqlArg[];
}

export interface DataType {
  list: boolean;
  baseType?: string;
  dataType?: DataType;
}

export interface FunctorApi {
  id: string;
  apiVersion: string;
  createdAt: string;
  displayName: string;
  invokeApiName: string;
  type: string;
  uniqueId: string;
  inputSchema: any;
  outputSchema: any;
}