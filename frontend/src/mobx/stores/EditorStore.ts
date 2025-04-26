/* eslint-disable import/no-default-export */
import { action, computed, observable } from 'mobx';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import {
  EditorMode,
  EditorState,
  FloatingButtonOnType,
  LeftDrawerKey,
} from '../../models/interfaces/EditorInfo';
import { NullableShortId, ShortId } from '../../shared/type-definition/ZTypes';
import { isNotNull } from '../../utils/utils';
import { AllStores } from '../StoreContexts';
import { ZedSupportedPlatform } from '../../models/interfaces/ComponentModel';

export const RIGHT_DRAWER_KEY = 'RightDrawer';
export const DEFAULT_DRAWER_WIDTH = 308;

const EDITOR_DATA = 'editorData';

export default class EditorStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  public targetProjectExId: NullableShortId = null;

  @observable
  public editorPlatform: ZedSupportedPlatform = ZedSupportedPlatform.WECHAT;

  @observable
  public selectedLeftDrawerKey: LeftDrawerKey | null = null;

  @observable
  public rightDrawerTarget: NullableShortId = null;

  @observable
  public isHandToolOn = false;

  @observable
  public editorState: EditorState = {
    mode: EditorMode.HOME,
    target: null,
  };

  @observable
  public selectedTargets: ShortId[] = [];

  @observable
  public clipBoardMRefs: ShortId[] = [];

  @observable
  public clipBoardContainerMRef: NullableShortId = null;

  @observable
  public floatingButtonOn: FloatingButtonOnType = null;

  @observable
  public devPasswordEntryVisibility = false;

  @observable
  public downloadWindowVisibility = false;

  @observable
  public scale = 1.0;

  @observable
  public auditNotification = false;

  @observable
  public drawerTabWidth: Map<LeftDrawerKey | 'RightDrawer' | null, number> = new Map([
    [RIGHT_DRAWER_KEY, 308],
  ]);

  @observable
  public configTab: 'style' | 'data' | 'action' = 'style';

  @observable
  public expandedMRefsInComponentTree = new Set<ShortId>();

  public transientMRefMapCopy: Record<ShortId, ShortId> = {};

  /*
   * =====================
   * || Computed Fields ||
   * =====================
   */
  @computed
  public get inFocusMode(): boolean {
    return this.editorState.mode === EditorMode.FOCUS && !!this.editorState.target;
  }

  @computed
  public get inFullyFocusMode(): boolean {
    return (
      this.editorState.mode === EditorMode.FOCUS &&
      !!AllStores.coreStore.getModel(this.editorState.target ?? '')?.shouldFullyFocus()
    );
  }

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public reset(): void {
    AllStores.editorStore = new EditorStore();
  }

  @action
  public switchDevPasswordEntryVisibility(): void {
    this.devPasswordEntryVisibility = !this.devPasswordEntryVisibility;
  }

  @action
  public switchDownloadWindowVisibility(): void {
    this.downloadWindowVisibility = !this.downloadWindowVisibility;
  }

  @action.bound
  public setScale(newScale: number | undefined): void {
    this.scale = newScale ?? this.scale;
  }

  @action.bound
  public setEditorState(editorState: EditorState): void {
    this.editorState = editorState;
    if (editorState.target) {
      const model = AllStores.coreStore.getModel(editorState.target);
      this.clipBoardContainerMRef = model?.isRootContainer ? editorState.target : null;
      if (model?.isContainer && (model as BaseContainerModel).eligibleAsPasteTargetContainer) {
        this.clipBoardContainerMRef = model.previewMRef;
      }
    } else {
      this.clipBoardContainerMRef = null;
    }
  }

  @action.bound
  public setSingleClickAndRightDrawerTarget(mRef: NullableShortId): void {
    this.selectedTargets = [mRef].filter(isNotNull);
    this.rightDrawerTarget = mRef;
  }

  @action
  public addAuditNotification(): void {
    if (this.auditNotification || this.selectedLeftDrawerKey === LeftDrawerKey.PROJECT_UPLOAD)
      return;
    this.auditNotification = true;
  }

  public saveEditorDataToLocalStorage(): void {
    window.localStorage.setItem(
      EDITOR_DATA,
      JSON.stringify({
        editorState: this.editorState,
        selectedTargets: this.selectedTargets,
        rightDrawerTarget: this.rightDrawerTarget,
      })
    );
  }

  public restoreEditorDataFromLocalStorage(): void {
    const editorDataJson = window.localStorage.getItem(EDITOR_DATA);
    if (!editorDataJson) return;
    const editorData = JSON.parse(editorDataJson);
    if (!editorData) {
      window.localStorage.removeItem(EDITOR_DATA);
      return;
    }
    const modelExists = (mRef: string | undefined): boolean => {
      if (mRef && !AllStores.coreStore.mRefMap[mRef]) {
        window.localStorage.removeItem(EDITOR_DATA);
        return false;
      }
      return true;
    };
    if (!modelExists(editorData.editorState.target)) {
      return;
    }
    if (!modelExists(editorData.rightDrawerTarget)) {
      return;
    }
    for (let index = 0; index < editorData.selectedTargets.length; index++) {
      const target = editorData.selectedTargets[index];
      if (!modelExists(target)) {
        return;
      }
    }
    this.editorState = editorData.editorState;
    this.selectedTargets = editorData.selectedTargets;
    this.rightDrawerTarget = editorData.rightDrawerTarget;
    window.localStorage.removeItem(EDITOR_DATA);
  }
}
