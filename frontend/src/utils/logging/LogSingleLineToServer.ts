/* eslint-disable import/no-default-export */
import { ApolloClient } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import Environment, { isProduction } from '../../Environment';
import GQL_LOG_TO_SERVER from '../../graphQL/logToServer';
import { AllStores } from '../../mobx/StoreContexts';

export enum LoggingLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

export const LoggingEvent = {
  APP_LAUNCH: 'app-launch',
  NOTIFICATION_DISPLAYED: 'notification-displayed',
};

const LOGGING_CATEGORY = 'ZED';

export default function LogSingleLineToServer(
  client: ApolloClient<any>,
  level: LoggingLevel,
  event: string,
  extraData: Record<string, any>
): void {
  const { sessionStore, accountStore } = AllStores;
  const { sessionId } = sessionStore;
  const logLine = {
    eventId: uuid(),
    timestamp: new Date().getTime(),
    category: LOGGING_CATEGORY,
    data: {
      sessionId,
      event,
      user: {
        exId: accountStore.account.exId ?? 'unknown',
        username: accountStore.account.username ?? 'unknown',
      },
      ...extraData,
    },
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ZION_ENV: process.env.REACT_APP_ZION_ENV,
      environment: Environment,
    },
  };

  if (isProduction()) {
    client.mutate({
      mutation: GQL_LOG_TO_SERVER,
      variables: { logs: [logLine] },
    });
  } else {
    window.console.log(logLine);
  }
}
