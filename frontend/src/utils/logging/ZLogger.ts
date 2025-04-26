import { ApolloClient } from '@apollo/client';
import LogSingleLineToServer, { LoggingLevel } from './LogSingleLineToServer';

export class ZLogger {
  constructor(public apolloClient: ApolloClient<any>) {
    // do nothing
  }

  public debug(event: string, extraData?: Record<string, any>): void {
    this.logSingleLine(LoggingLevel.DEBUG, event, extraData);
  }

  public info(event: string, extraData?: Record<string, any>): void {
    this.logSingleLine(LoggingLevel.INFO, event, extraData);
  }

  public warn(event: string, extraData?: Record<string, any>): void {
    this.logSingleLine(LoggingLevel.WARNING, event, extraData);
  }

  public error(event: string, extraData?: Record<string, any>): void {
    this.logSingleLine(LoggingLevel.ERROR, event, extraData);
  }

  public fatal(event: string, extraData?: Record<string, any>): void {
    this.logSingleLine(LoggingLevel.FATAL, event, extraData);
  }

  // TODO: FZM-898 - optimize this to aggregate logs and send in batch
  private logSingleLine(level: LoggingLevel, event: string, extraData?: Record<string, any>): void {
    LogSingleLineToServer(this.apolloClient, level, event, extraData ?? {});
  }
}
