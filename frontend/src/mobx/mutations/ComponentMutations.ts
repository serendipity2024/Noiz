import { SchemaMutator } from './SchemaMutator';
import { ShortId } from '../../shared/type-definition/ZTypes';

export class ComponentMutations {
  constructor(private mutator: SchemaMutator) {}

  public setDataAttribute<T>(componentId: ShortId, key: string, value: T): void {
    const updateObj = { dataAttributes: { [key]: { $set: value } } };
    this.mutator.applyUpdate(this.makeComponentUpdate(componentId, updateObj));
  }

  public setProperty<T>(componentId: ShortId, key: string, value: T): void {
    const updateObj = { [key]: { $set: value } };
    this.mutator.applyUpdate(this.makeComponentUpdate(componentId, updateObj));
  }

  private makeComponentUpdate(componentId: ShortId, updateObj: any) {
    return { mRefMap: { [componentId]: updateObj } };
  }
}
