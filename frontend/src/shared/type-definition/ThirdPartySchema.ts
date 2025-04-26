/* eslint-disable import/no-default-export */
import { ThirdPartyRequest } from './ThirdPartyRequest';

export interface ThirdPartyApi {
  name: string;
  description?: string;
  url: string;
  method: string;
  parameters: ThirdPartyApiParameter[];
  response: ThirdPartyApiResponse;
}

export interface ThirdPartyApiParameter {
  name: string;
  type: string;
  required: boolean;
  position: string;
}

export interface ThirdPartyApiResponse {
  type: string;
  properties?: Record<string, any>;
}

export interface ThirdPartySchemaGroup {
  name: string;
  apis: ThirdPartyApi[];
}