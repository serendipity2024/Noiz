import _ from 'lodash';
import update from 'immutability-helper';
import CoreStore from '../stores/CoreStore';
import DiffStore from '../stores/DiffStore';
import { generateSchemaDiff } from '../../diffs/SchemaDiffGenerator';

type UpdateObject = any;

export class SchemaMutator {
  private pendingUpdates: UpdateObject[] | null = null;

  constructor(public coreStore: CoreStore, private diffStore: DiffStore) {}

  public transaction(body: () => void, undoable = true): void {
    if (this.pendingUpdates != null) {
      throw new Error('Already inside a transaction');
    }

    this.pendingUpdates = [];

    body();

    const updates = this.pendingUpdates;
    this.pendingUpdates = null;
    this.applyTransaction(updates, undoable);
  }

  public applyUpdate<T>(updateObject: T, undoable = true): void {
    if (this.pendingUpdates == null) {
      this.transaction(() => this.applyUpdate(updateObject, undoable), undoable);
    } else {
      this.pendingUpdates.push(updateObject);
    }
  }

  private applyTransaction(updates: UpdateObject[], undoable: boolean) {
    if (this.diffStore.diffPendingApplication) {
      // There is a race condition in diff application. Suppose you have states
      // A, B, and C, and diffs d1 and d2, and:
      //
      //   A + d1 = B
      //   B + d2 = C
      //
      // If the user clicks very quickly to generate d1 and d2, it is possible
      // that d2 is computed before d1 is applied, hence d2 is based on A
      // instedad of B. After both diffs are applied, we'd end up with a merged
      // state of B and A + d2, whatever that is.
      //
      // In our current DiffStore setup, this bug is very hard to fix, since by
      // the time the diff reaches the store, it's already been computed based on the
      // possibly wrong base state.
      //
      // In the new scheme, we simply wait for the pending diffs to be flushed
      // before proceeding. This solves the local case entirely, but still
      // doesn't prevent network diffs to be miscalculated.
      _.defer(() => this.applyTransaction(updates, undoable));
      return;
    }

    // The schema diff generator differentiates between plain objects, for which we
    // can reasonably generate diffs, and objects of other classes, which might
    // have other logic attached. CoreStore is a class, but for diffs, we only
    // care about its data, hence we make a shallow copy here.
    const coreStoreData = { ...this.coreStore };
    const updated = updates.reduce(update, coreStoreData);
    const diffs = generateSchemaDiff(coreStoreData, updated);
    this.diffStore.applyDiff(diffs, undoable);
  }
}
