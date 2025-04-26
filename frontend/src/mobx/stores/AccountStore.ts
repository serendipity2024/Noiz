import { action, observable } from 'mobx';
import { isNil, omitBy } from 'lodash';
import {
  FetchCurrentUserInfo,
  FetchCurrentUserInfo_user,
} from '../../graphQL/__generated__/FetchCurrentUserInfo';
import { AllStores } from '../StoreContexts';
import GQL_FETCH_CURRENT_USER_INFO from '../../graphQL/fetchCurrentUserInfo';
import {
  updateAccountProfile,
  updateAccountProfileVariables,
} from '../../graphQL/__generated__/updateAccountProfile';
import { GQL_UPDATE_ACCOUNT_PROFILE } from '../../graphQL/updateAccountProfile';
import { AgeRange } from '../../graphQL/__generated__/globalTypes';

interface UpdateAccountProfileParams {
  ageRange?: AgeRange;
  industry?: string;
}

export class AccountStore {
  @observable
  public account: Partial<FetchCurrentUserInfo_user> = {};

  @action
  public fetchUserAccount(): void {
    const { sessionStore } = AllStores;
    sessionStore.clientForSession
      .query<FetchCurrentUserInfo>({
        query: GQL_FETCH_CURRENT_USER_INFO,
      })
      .then((res) => {
        if (res.data.user) {
          this.account = res.data.user;
        }
      })
      .catch((error) => {
        window.console.log(error);
      });
  }

  @action
  public updateAccountProfile(params: UpdateAccountProfileParams): void {
    AllStores.sessionStore.clientForSession
      .mutate<updateAccountProfile, updateAccountProfileVariables>({
        mutation: GQL_UPDATE_ACCOUNT_PROFILE,
        variables: {
          values: omitBy(params, isNil),
        },
      })
      .then((res) => {
        if (res.data?.updateAccountProfile) {
          this.account = res.data.updateAccountProfile;
        }
      })
      .catch((error) => {
        window.console.log(error);
      });
  }
}
