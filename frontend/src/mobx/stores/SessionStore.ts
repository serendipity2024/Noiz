import { ApolloClient } from '@apollo/client';
import { action, computed, observable } from 'mobx';
import { v4 as uuid } from 'uuid';
import cookie from 'react-cookies';
import { createApolloClient } from '../../graphQL/createApolloClient';
import { DOMAIN } from '../../Environment';

const FUNCTORZ_COOKIE = 'functorz';

export class SessionStore {
  constructor() {
    this.setCookie();
  }

  @observable
  public sessionId: string = uuid();

  @computed
  public get clientForSession(): ApolloClient<any> {
    return createApolloClient(this.sessionId);
  }

  @computed
  public get cookie(): string {
    return cookie.load(FUNCTORZ_COOKIE);
  }

  @action
  private setCookie(): void {
    if (!this.cookie) {
      cookie.save(FUNCTORZ_COOKIE, uuid(), {
        domain: DOMAIN,
      });
    }
  }
}
