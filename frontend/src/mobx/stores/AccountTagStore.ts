import { MutationOptions, QueryOptions } from '@apollo/client';
import { action, autorun, computed, observable } from 'mobx';
import { GQL_FETCH_ACCOUNT_TAGS, GQL_UPDATE_ACCOUNT_TAGS } from '../../graphQL/accountTags';
import {
  FetchAccountTags,
  FetchAccountTags_user_tags,
} from '../../graphQL/__generated__/FetchAccountTags';
import {
  UpdateAccountTags,
  UpdateAccountTagsVariables,
} from '../../graphQL/__generated__/UpdateAccountTags';
import { AllStores } from '../StoreContexts';

export enum AccountTag {
  SHOW_INTRO = 'hasSeenIntro',
  SHOW_USER_PROFILE = 'hasUpdatedUserProfile',
}

export class AccountTagStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  private accountTagQueue: AccountTag[] = [];

  @observable
  private accountTags: FetchAccountTags_user_tags | undefined;

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public openAccountTag(accountTag: AccountTag): void {
    if (this.accountTags && this.accountTags[accountTag]) {
      return;
    }
    this.accountTagQueue.push(accountTag);
  }

  @action
  public closeAccountTag(accountTag: AccountTag): void {
    this.accountTagQueue = this.accountTagQueue.filter((tag) => tag !== accountTag);
  }

  public fetchAccountTagValues(): void {
    autorun(() => {
      const { sessionStore, authStore } = AllStores;
      if (!authStore.isLoggedIn) return;
      const handleQueriesForFetchAccountTags = (query: QueryOptions<FetchAccountTags>) => {
        sessionStore.clientForSession
          .query(query)
          .then((rsp) => this.setAccountTags(rsp.data.user?.tags))
          .catch((e) => {
            window.console.log(e.message);
          });
      };
      handleQueriesForFetchAccountTags({
        query: GQL_FETCH_ACCOUNT_TAGS,
      });
    });
  }

  @action
  public setAccountTags(newAccountTags: FetchAccountTags_user_tags | undefined): void {
    this.accountTags = newAccountTags;
  }

  public saveAccountTagAsFinished(accountTag: AccountTag): void {
    const { sessionStore } = AllStores;
    const handleUpdateAccountTags = (
      mutation: MutationOptions<UpdateAccountTags, UpdateAccountTagsVariables>
    ) => {
      sessionStore.clientForSession
        .mutate(mutation)
        .then(() => this.fetchAccountTagValues())
        .catch((e) => {
          window.console.log(e.message);
        });
    };
    const newAccountTagValues: UpdateAccountTagsVariables = {
      values: {
        [accountTag]: true,
      },
    };
    handleUpdateAccountTags({
      mutation: GQL_UPDATE_ACCOUNT_TAGS,
      variables: newAccountTagValues,
    });
    this.closeAccountTag(accountTag);
  }

  @computed
  public get currentRunningTag(): AccountTag | undefined {
    if (this.accountTags) {
      for (let i = 0, len = this.accountTagQueue.length; i < len; ++i) {
        if (!this.accountTags[this.accountTagQueue[i]]) {
          return this.accountTagQueue[i];
        }
      }
    }
    return undefined;
  }
}
