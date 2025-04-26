import { action, observable } from 'mobx';
import { ShortId } from '../../shared/type-definition/ZTypes';

export interface ThirdPartyRequestDebugCache {
  requestId: ShortId;
  statusCode?: string;
  value?: Record<string, any>;
  requestHeaders: Record<string, string>;
  requestBody: Record<string, string>;
  responseHeaders: Record<string, string>;
  responseBody: Record<string, string>;
}

export class RequestDebugStore {
  @observable
  public readonly requestDebugRecord: Record<string, ThirdPartyRequestDebugCache> = {};

  @action
  public addRequestDebugCache(requestDebugCache: ThirdPartyRequestDebugCache): void {
    this.requestDebugRecord[requestDebugCache.requestId] = requestDebugCache;
  }
}
