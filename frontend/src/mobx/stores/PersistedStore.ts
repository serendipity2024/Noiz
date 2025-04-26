/* eslint-disable import/no-default-export */
import { message } from 'antd';
import getUserLocale from 'get-user-locale';
import { action, observable } from 'mobx';
import { Locale } from '../../hooks/useLocale';

const PERSISTED_STORE_STORAGE_KEY = 'persistedStoreStorageKey';

export default class PersistedStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  public locale: Locale = this.getPersistedLocale();

  @observable
  public isDeveloperMode = this.getPersistedIsDeveloperMode();

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public setLocale(target: Locale): void {
    if (this.locale === target) return;
    this.locale = target;
    this.persist();
  }

  @action
  public switchDeveloperMode(): void {
    this.isDeveloperMode = !this.isDeveloperMode;
    this.persist();

    if (this.isDeveloperMode) {
      message.info('developer mode enabled');
    } else {
      message.info('developer mode disabled');
    }
  }

  /*
   * =====================
   * || Private Helpers ||
   * =====================
   */
  private getPersistedLocale(): Locale {
    const persisted = this.getPersistedValueByKey('locale') as Locale;
    if (persisted) {
      // TODO: remove this before christmas 2021
      // for migration only
      if (persisted.toString() === 'CN') {
        window.localStorage.setItem(
          PERSISTED_STORE_STORAGE_KEY,
          JSON.stringify({ locale: Locale.ZH })
        );
        return Locale.ZH;
      }
      return persisted;
    }
    return getUserLocale().toUpperCase().includes(Locale.EN) ? Locale.EN : Locale.ZH;
  }

  private getPersistedIsDeveloperMode(): boolean {
    return !!this.getPersistedValueByKey('isDeveloperMode');
  }

  private getPersistedValueByKey(key: string): string | null {
    const raw = window.localStorage.getItem(PERSISTED_STORE_STORAGE_KEY);
    if (!raw) return null;

    const json = JSON.parse(raw) ?? {};
    return json[key];
  }

  private persist(): void {
    window.localStorage.setItem(PERSISTED_STORE_STORAGE_KEY, JSON.stringify(this));
  }
}
