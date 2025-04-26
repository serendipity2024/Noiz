import { ZedSupportedPlatform } from '../../models/interfaces/ComponentModel';
import { AllStores } from '../StoreContexts';
import { SchemaMutator } from './SchemaMutator';

export class AppConfigMutators {
  constructor(private mutator: SchemaMutator) {}

  public setProperty<T>(key: string, value: T): void {
    const updateObj = { [key]: { $set: value } };
    let rootKey = 'wechatConfiguration';
    const { editorPlatform } = AllStores.editorStore;
    switch (editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        rootKey = 'wechatConfiguration';
        break;
      case ZedSupportedPlatform.WEB:
        rootKey = 'webConfiguration';
        break;
      case ZedSupportedPlatform.MOBILE_WEB:
        rootKey = 'mobileWebConfiguration';
        break;
      default:
        throw new Error(`unsupported editorPlatform, ${editorPlatform}`);
    }
    this.mutator.applyUpdate({ [rootKey]: updateObj });
  }
}
