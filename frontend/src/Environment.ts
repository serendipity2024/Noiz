/* eslint-disable import/no-default-export */
const PRODUCTION_DOMAIN = 'zionbackend.functorz.com';
const CANARY_DOMAIN = 'zionbackend-canary.functorz.com';
const STAGING_DOMAIN = 'zionbackend.functorz.work';
const HTTPS_PROTOCOL = 'https://';
const WSS_PROTOCOL = 'wss://';
export const DOMAIN = '.functorz.com';

export enum EnvironmentName {
  PRODUCTION = 'production',
  CANARY = 'canary',
  STAGING = 'staging',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

export enum ServerPath {
  GQL_PATH = '/api/graphql',
  WS_PATH = '/api/graphql-subscription',
}

export const isProduction = (): boolean =>
  process.env.NODE_ENV === EnvironmentName.PRODUCTION &&
  process.env.REACT_APP_ZION_ENV === EnvironmentName.PRODUCTION;

export const isCanary = (): boolean => process.env.REACT_APP_ZION_ENV === EnvironmentName.CANARY;

export const isStaging = (): boolean =>
  process.env.NODE_ENV === EnvironmentName.PRODUCTION &&
  process.env.REACT_APP_ZION_ENV === EnvironmentName.STAGING;

export const isTest = (): boolean =>
  process.env.NODE_ENV === EnvironmentName.TEST ||
  process.env.REACT_APP_ZION_ENV === EnvironmentName.TEST;

export const isDev = (): boolean => !isProduction() && !isStaging() && !isTest();

const domain = (() => {
  switch (process.env.REACT_APP_ZION_ENV) {
    case EnvironmentName.PRODUCTION:
      return PRODUCTION_DOMAIN;
    case EnvironmentName.CANARY:
      return CANARY_DOMAIN;
    case EnvironmentName.STAGING:
      return STAGING_DOMAIN;
    default:
      return 'localhost:3000';
  }
})();
const httpServerAddress = process.env.REACT_APP_OVERRIDE_HTTP_ADDRESS ?? HTTPS_PROTOCOL + domain;
const wsServerAddress = process.env.REACT_APP_OVERRIDE_WS_ADDRESS ?? WSS_PROTOCOL + domain;

const Environment = {
  httpServerAddress,
  wsServerAddress,
  graphqlServerAddress: httpServerAddress + ServerPath.GQL_PATH,
  webSocketServerAddress: wsServerAddress + ServerPath.WS_PATH,
};

export default Environment;
