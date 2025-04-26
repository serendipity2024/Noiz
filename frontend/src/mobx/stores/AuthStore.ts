/* eslint-disable import/no-default-export */
import { action, computed, observable } from 'mobx';
import User, { UserData } from '../data-model/user';
import { AllStores } from '../StoreContexts';

const AUTH_STORE_STORAGE_KEY = 'loggedInUserStorageKey';

export default class AuthStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  public user: User | undefined = User.deserialize(
    window.localStorage.getItem(AUTH_STORE_STORAGE_KEY) ?? undefined
  );

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public login(user: User): void {
    if (!user) return;

    this.user = user;
    window.localStorage.setItem(AUTH_STORE_STORAGE_KEY, user.toJSONString());
  }

  @action
  public loginFromData(data: UserData): void {
    const user = User.buildFromUserData(data);
    this.login(user);
  }

  @action
  public logout(): void {
    this.user = undefined;
    window.localStorage.removeItem(AUTH_STORE_STORAGE_KEY);

    AllStores.coreStore.reset();
    AllStores.editorStore.reset();
    AllStores.diffStore.reset();
    AllStores.projectStore.reset();
  }

  /*
   * =====================
   * || Computed Fields ||
   * =====================
   */
  @computed
  public get isLoggedIn(): boolean {
    return !!this.user;
  }

  @computed
  public get isActive(): boolean {
    const roleNameSet = new Set(this.user?.roleNames ?? []);
    return roleNameSet.has('admin') || roleNameSet.has('user');
  }

  @computed
  public get userToken(): string {
    return this.user?.token ?? '';
  }
}
