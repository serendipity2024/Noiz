/* eslint-disable no-console */
import { AllStores } from '../mobx/StoreContexts';

export class ZDebug {
  public static error = (errorMessage: string): void => {
    if (AllStores.persistedStore.isDeveloperMode) {
      throw new Error(errorMessage);
    } else {
      console.error(errorMessage);
    }
  };
}
