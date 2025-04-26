/* eslint-disable import/no-default-export */
/* eslint-disable no-underscore-dangle */
import { action, computed, observable } from 'mobx';
import { ArrayDiffItem, Diff, DiffItem } from '../../shared/type-definition/Diff';
import DiffHelper from '../../utils/DiffHelper';
import { uuidV4 } from '../../utils/StringUtils';
import { SchemaDiffFragment } from '../../graphQL/__generated__/SchemaDiffFragment';
import { AllStores } from '../StoreContexts';

export enum DiffQueueState {
  WAITING = 'waiting',
  BEGINNING = 'beginning',
  IN_PROGRESS = 'inProgress',
  FINISHED = 'finished',
}

export enum CollaborationState {
  NORMAL = 'normal',
  DIFF_APPLICATION_ERROR = 'diff_application_error',
  SCHEMA_SAVED = 'schema_saved',
  PROJECT_RESET = 'project_reset',
  CREATE_SCHEMA_DIFF_ERROR = 'create_schema_diff_error',
  PROJECT_DELETED = 'project_deleted',
}

export default class DiffStore {
  // collaboration network diff

  @observable
  public collaborationState = CollaborationState.NORMAL;

  @observable
  public diffQueueUploadState = DiffQueueState.WAITING;

  public diffsPendingUpload: Diff[] = [];

  @observable
  public networkDiffApplicationQueueState = DiffQueueState.WAITING;

  public networkDiffsPendingApplication: SchemaDiffFragment[] = [];

  public lastNetworkDiffSeq: number | undefined;

  public addPendingUploadDiff(diff: Diff): void {
    if (!diff) return;
    this.diffsPendingUpload.push(diff);
    if (this.diffQueueUploadState === DiffQueueState.WAITING) {
      this.diffQueueUploadState = DiffQueueState.BEGINNING;
    }
  }

  public addPendingApplyNetworkDiff(schemaDiff: SchemaDiffFragment): void {
    if (!schemaDiff) return;
    this.networkDiffsPendingApplication.push(schemaDiff);
    if (this.networkDiffApplicationQueueState === DiffQueueState.WAITING) {
      this.networkDiffApplicationQueueState = DiffQueueState.BEGINNING;
    }
  }

  // local diff

  @observable
  public diffs: Diff[] = [];

  @observable
  public undoneDiffs: Diff[] = [];

  @observable
  public diffPendingApplication: Diff | undefined;

  @computed
  get localDiffRecord(): Record<string, Diff> {
    return Object.fromEntries([...this.diffs, ...this.undoneDiffs].map((diff) => [diff.id, diff]));
  }

  public existsInLocalDiffs(uuid: string): boolean {
    return !!this.localDiffRecord[uuid];
  }

  public clearAllDiffs(): void {
    this.diffs = [];
    this.undoneDiffs = [];
  }

  @action
  public applyDiff(dataSource: (DiffItem | ArrayDiffItem)[], undoable = true): void {
    if (dataSource.length <= 0) return;
    const diff = {
      id: uuidV4(),
      dataSource,
    };
    if (undoable) {
      this.diffs.push(diff);
    }
    this.undoneDiffs = [];
    this.diffPendingApplication = diff;
  }

  public undoDiff(): void {
    if (this.diffs.length <= 0) return;
    const diff = this.diffs[this.diffs.length - 1];
    this.diffs.splice(this.diffs.length - 1, 1);

    const newDiff = {
      id: uuidV4(),
      dataSource: diff.dataSource,
    };
    this.undoneDiffs.push(newDiff);
    this.diffPendingApplication = {
      id: newDiff.id,
      dataSource: diff.dataSource.map((data) => DiffHelper.reverseDiffItem(data)).reverse(),
    };
  }

  public redoDiff(): void {
    if (this.undoneDiffs.length <= 0) return;
    const diff = this.undoneDiffs[this.undoneDiffs.length - 1];
    this.undoneDiffs.splice(this.undoneDiffs.length - 1, 1);

    const newDiff = {
      id: uuidV4(),
      dataSource: diff.dataSource,
    };
    this.diffs.push(newDiff);
    this.diffPendingApplication = newDiff;
  }

  @action
  public reset(): void {
    AllStores.diffStore = new DiffStore();
  }
}
