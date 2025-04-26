import { action, observable, computed } from 'mobx';
import { AllStores } from '../StoreContexts';
import {
  ZTypeSystem,
  OpaqueAppSchema,
  OpaqueLiveSchema,
  ValidationResults,
  DiffValidator,
  DiffValidationMessage,
} from '../../utils/ZTypeSystem';
import { Diff } from '../../shared/type-definition/Diff';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import DataBindingHelper from '../../utils/DataBindingHelper';

export class TypeSystemStore {
  @observable
  private currLiveSchema: OpaqueLiveSchema | null = null;

  rehydrate(): void {
    this.currLiveSchema = ZTypeSystem.parseLiveSchemaFromJsObject(AllStores.coreStore);
  }

  @action
  applySchemaDiff(diff: Diff): void {
    if (this.currLiveSchema) {
      this.currLiveSchema = ZTypeSystem.applySchemaDiffToLiveSchema(
        this.currLiveSchema,
        this.normalizedDiff(diff)
      );
    } else {
      throw new Error("Shouldn't get here, schema should already exist");
    }
  }

  @action
  genIncrementalErrors(diff: Diff): DiffValidationMessage[] {
    try {
      if (!this.currLiveSchema) {
        return [];
      }
      const allDataBindingsByComponentId: Record<string, DataBinding[]> =
        DataBindingHelper.genAllDatabindingFromMRefMap();
      return DiffValidator.getIncrementalErrors(
        this.currLiveSchema,
        this.normalizedDiff(diff),
        allDataBindingsByComponentId
      );
    } catch (error) {
      window.console.log(JSON.stringify(error));
    }
    return [];
  }

  @computed
  get appSchema(): OpaqueAppSchema | null {
    if (!this.currLiveSchema) {
      return null;
    }
    return ZTypeSystem.resolveLiveSchemaToAppSchema(this.currLiveSchema);
  }

  @computed
  get validated(): ValidationResults {
    if (!this.appSchema) return new ValidationResults([], []);

    return ZTypeSystem.validateAppSchema(this.appSchema);
  }

  private normalizedDiff(diff: Diff): any {
    // The interaction of 1. mobx wrapping objects in proxies, 2. Javascript
    // allowing { key: undefined } to happen, and 3. conversion to Kotlin
    // objects means sometimes we end up with objects Kotlin simply can't
    // handle.
    return JSON.parse(JSON.stringify(diff));
  }
}
