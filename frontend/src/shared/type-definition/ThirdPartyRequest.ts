import { ShortId } from './ZTypes';

export enum ParamPosition {
  BODY = 'BODY',
  HEADER = 'HEADER',
  QUERY = 'QUERY',
  PATH = 'PATH',
}

export enum ThirdPartyRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// contrast with column types
export enum ZDataType {
  STRING = 'TEXT',
  FLOAT = 'FLOAT8',
  INT = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
}

export interface ThirdPartyData {
  name: string;
  uniqueId: string;
  type: ZDataType;
  itemType?: ZDataType;
  required: boolean;
  parameters?: ThirdPartyData[];
  zType?: string; // typeStystem type
}

export interface ThirdPartyRequest {
  id: ShortId;
  name: string;
  description?: string;
  url: string;
  method: ThirdPartyRequestMethod;
  parameters: ThirdPartyParameter[];
  response: ThirdPartyResponse;
}

export interface ThirdPartyParameter extends ThirdPartyData {
  position: ParamPosition;
}

export interface ThirdPartyResponse {
  successResponse: ThirdPartyResult; // 'statusCode: 2xx'
  temporaryFailResponse: ThirdPartyResult; // 'statusCode: 4xx'
  permanentFailResponse: ThirdPartyResult; // 'statusCode: 5xx'
}

export interface ThirdPartyResult {
  statusCode: '2xx' | '4xx' | '5xx';
  responseData?: ThirdPartyData;
}
