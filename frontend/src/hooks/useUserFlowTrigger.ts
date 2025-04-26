/* eslint-disable no-console */
/* eslint-disable import/no-default-export */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-expressions */
import {
  ApolloClient,
  MutationTuple,
  QueryOptions,
  useApolloClient,
  useMutation,
} from '@apollo/client';
import { head } from 'lodash';
import { transaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import uniqid from 'uniqid';
import { getDragSelectedContainerFrame } from '../components/editor/ZDragSelectMovable';
import { ProjectProgressStep } from '../components/side-drawer-tabs/left-drawer/PublishProgressTab';
import ComponentDiff from '../diffs/ComponentDiff';
import FrameDiff from '../diffs/FrameDiff';
import GQL_CREATE_PROJECT from '../graphQL/createProject';
import { deleteProject } from '../graphQL/deleteProject';
import { deployProject } from '../graphQL/deployProject';
import GQL_FETCH_PROJECT_DETAILS_BY_EX_ID from '../graphQL/fetchProjectDetailsByExId';
import {
  GQL_SET_ALIYUN_SMS,
  GQL_SET_ALIYUN_SMS_ATTORNEY,
  GQL_SET_ALIYUN_SMS_SIGNATURE,
  GQL_SET_BUSINESS_LICENSE_IMAGE,
  GQL_SET_PROJECT_CLOUD_CONFIG,
  GQL_SET_EMAIL_CONFIG,
  GQL_SET_WECHAT_APP_SETTINGS,
  GQL_SET_WECHAT_PAYMENT_SETTINGS,
} from '../graphQL/projectConfig';
import { setProjectDetails } from '../graphQL/setProjectDetails';
import { setProjectName } from '../graphQL/setProjectName';
import { submitToReview } from '../graphQL/submitToReview';
import { saveProject } from '../graphQL/uploadSchema';
import { publishWechatProgram } from '../graphQL/wechatAPI';
import {
  FetchProjectDetailsByExId,
  FetchProjectDetailsByExIdVariables,
  FetchProjectDetailsByExId_project,
} from '../graphQL/__generated__/FetchProjectDetailsByExId';
import { ProjectDetailsFragment } from '../graphQL/__generated__/ProjectDetailsFragment';
import { SetAliyunSms, SetAliyunSmsVariables } from '../graphQL/__generated__/SetAliyunSms';
import {
  SetAliyunSmsAttorney,
  SetAliyunSmsAttorneyVariables,
} from '../graphQL/__generated__/SetAliyunSmsAttorney';
import {
  SetAliyunSmsSignature,
  SetAliyunSmsSignatureVariables,
} from '../graphQL/__generated__/SetAliyunSmsSignature';
import {
  SetBusinessLicenseImage,
  SetBusinessLicenseImageVariables,
} from '../graphQL/__generated__/SetBusinessLicenseImage';
import {
  SetProjectCloudConfiguration,
  SetProjectCloudConfigurationVariables,
} from '../graphQL/__generated__/SetProjectCloudConfiguration';
import { SetEmailConfig, SetEmailConfigVariables } from '../graphQL/__generated__/SetEmailConfig';
import {
  SetWechatAppSettings,
  SetWechatAppSettingsVariables,
} from '../graphQL/__generated__/SetWechatAppSettings';
import {
  SetWechatPaymentSettings,
  SetWechatPaymentSettingsVariables,
} from '../graphQL/__generated__/SetWechatPaymentSettings';
import { AllStores } from '../mobx/StoreContexts';
import StoreHelpers from '../mobx/StoreHelpers';
import StoreRehydrate from '../mobx/StoreRehydrate';
import ProjectStore, {
  AliyunSmsConfig,
  DefaultProjectName,
  EmailConfig,
  ProjectConfig,
  ProjectDetails,
  WechatAppConfig,
} from '../mobx/stores/ProjectStore';
import BaseComponentModel from '../models/base/BaseComponentModel';
import BaseMobileComponentModel from '../models/base/BaseMobileComponentModel';
import { toModel } from '../models/ComponentModelBuilder';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { EditorMode, LeftDrawerKey } from '../models/interfaces/EditorInfo';
import ZFrame from '../models/interfaces/Frame';
import { BuildTarget } from '../shared/data/BuildTarget';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import { DiffItem } from '../shared/type-definition/Diff';
import { ShortId } from '../shared/type-definition/ZTypes';
import useIsDeveloperMode from './useIsDeveloperMode';
import useNotificationDisplay, { DisplayNotification } from './useNotificationDisplay';
import useProjectDetails from './useProjectDetails';
import useStores from './useStores';
import { GQL_JOIN_PROJECT_BY_SHARE_TOKEN } from '../graphQL/shareProject';
import BaseMobileContainerModel from '../models/base/BaseMobileContainerModel';

// TODO: FZM-747 - migrate all user actions to here
export enum UserFlow {
  // board actions
  UNDO,
  REDO,
  ENABLE_HAND_TOOL,
  DISABLE_HAND_TOOL,
  SELECT_TARGET,
  DESELECT,
  FOCUS_TARGET,
  DEFOCUS,
  COPY_SELECTED,
  PASTE_COPIED,
  DELETE_SELECTED,
  DRAG_SELECTED_TARGETS,
  DRAG_DESELECTED,
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  SHIFT_MOVE_UP,
  SHIFT_MOVE_DOWN,
  SHIFT_MOVE_LEFT,
  SHIFT_MOVE_RIGHT,
  ESCAPE,

  // project life-cycle
  CREATE_PROJECT,
  INIT_PROJECT,
  BE_READY,
  SAVE_PROJECT,
  UPLOAD_WECHAT_PROJECT,
  UPLOAD_WEB_PROJECT,
  UPDATE_PROJECT_CONFIGURATION,
  UPDATAE_PROJECT_DETAILS,
  DELETE_PROJECT,
  SUBMIT_PREVIEW,
  PUBLISH,
}

export function useSelectionTrigger(): (
  flow:
    | UserFlow.SELECT_TARGET
    | UserFlow.DRAG_SELECTED_TARGETS
    | UserFlow.DRAG_DESELECTED
    | UserFlow.DESELECT
    | UserFlow.FOCUS_TARGET
    | UserFlow.DEFOCUS
) => (...args: any[]) => void {
  const { coreStore, editorStore } = useStores();
  const handleDefocus = (): void => {
    const focusComponent = StoreHelpers.getComponentModel(editorStore.editorState.target ?? '');
    let parentModel = StoreHelpers.getComponentModel(focusComponent?.parentMRef ?? '');
    if (!parentModel) {
      transaction(() => {
        editorStore.setEditorState({ mode: EditorMode.HOME, target: null });
        editorStore.selectedLeftDrawerKey = null;
        editorStore.rightDrawerTarget = null;
      });
      return;
    }

    while (
      parentModel &&
      parentModel?.type !== ComponentModelType.MOBILE_PAGE &&
      !parentModel?.hasFocusMode()
    ) {
      parentModel = coreStore.getModel(parentModel?.parentMRef ?? '');
    }

    transaction(() => {
      editorStore.setEditorState({ mode: EditorMode.FOCUS, target: parentModel?.mRef ?? null });
      editorStore.selectedLeftDrawerKey = null;
      editorStore.rightDrawerTarget = null;
    });
  };
  return (flow) => {
    switch (flow) {
      case UserFlow.SELECT_TARGET:
        return (mRef: ShortId) =>
          transaction(() => {
            editorStore.selectedTargets = [];
            editorStore.setSingleClickAndRightDrawerTarget(mRef);
          });
      case UserFlow.DESELECT:
        return () => {
          transaction(() => {
            editorStore.selectedLeftDrawerKey = null;
            editorStore.setSingleClickAndRightDrawerTarget(null);
          });
        };
      case UserFlow.DRAG_SELECTED_TARGETS:
        return (dragSelectData: string[]) => {
          transaction(() => {
            if (
              editorStore.editorState.target &&
              dragSelectData.includes(editorStore.editorState.target)
            ) {
              editorStore.setSingleClickAndRightDrawerTarget(editorStore.editorState.target);
            } else {
              editorStore.selectedTargets = dragSelectData;
              editorStore.rightDrawerTarget =
                dragSelectData.length === 1 ? head(dragSelectData) ?? null : null;
            }
          });
        };

      case UserFlow.DRAG_DESELECTED:
        return () => {
          if (editorStore.selectedTargets.length > 0) {
            editorStore.selectedTargets = [];
          }
        };
      case UserFlow.FOCUS_TARGET:
        return (mRef: ShortId) =>
          transaction(() => {
            editorStore.selectedTargets = [];
            if (editorStore.selectedLeftDrawerKey !== LeftDrawerKey.COMPONENT_TREE) {
              editorStore.selectedLeftDrawerKey = LeftDrawerKey.ADD_COMPONENT;
            }
            editorStore.setEditorState({ mode: EditorMode.FOCUS, target: mRef });
          });

      case UserFlow.DEFOCUS:
        return () => {
          editorStore.selectedTargets = [];
          handleDefocus();
        };
      default:
        return () => {
          throw new Error('unknown user flow');
        };
    }
  };
}

export default function useUserFlowTrigger(): (
  flow: Exclude<
    UserFlow,
    | UserFlow.SELECT_TARGET
    | UserFlow.DRAG_SELECTED_TARGETS
    | UserFlow.DRAG_DESELECTED
    | UserFlow.DESELECT
    | UserFlow.FOCUS_TARGET
    | UserFlow.DEFOCUS
  >
) => (...args: any[]) => void {
  const history = useHistory();
  const client = useApolloClient();
  const { coreStore, editorStore, projectStore, diffStore } = useStores();
  const isDeveloperMode = useIsDeveloperMode();
  const displayNotification = useNotificationDisplay();
  const { projectExId, projectConfig } = useProjectDetails();

  const editorState = useObserver(() => editorStore.editorState);
  const inFocusMode = useObserver(() => editorState.mode === EditorMode.FOCUS);
  const focusedTarget = useObserver(() => editorState.target);

  const handleDeselect = (): void =>
    transaction(() => {
      editorStore.selectedLeftDrawerKey = null;
      editorStore.setSingleClickAndRightDrawerTarget(null);
    });
  const handleDefocus = (): void => {
    const focusComponent = StoreHelpers.getComponentModel(editorStore.editorState.target ?? '');
    let parentModel = StoreHelpers.getComponentModel(focusComponent?.parentMRef ?? '');
    if (!parentModel) {
      transaction(() => {
        editorStore.setEditorState({ mode: EditorMode.HOME, target: null });
        editorStore.selectedLeftDrawerKey = null;
        editorStore.rightDrawerTarget = null;
      });
      return;
    }

    while (
      parentModel &&
      parentModel?.type !== ComponentModelType.MOBILE_PAGE &&
      !parentModel?.hasFocusMode()
    ) {
      parentModel = coreStore.getModel(parentModel?.parentMRef ?? '');
    }

    transaction(() => {
      editorStore.setEditorState({ mode: EditorMode.FOCUS, target: parentModel?.mRef ?? null });
      editorStore.selectedLeftDrawerKey = null;
      editorStore.rightDrawerTarget = null;
    });
  };
  const handleDeselectMultSelection = (): void => {
    editorStore.selectedTargets = [];
  };

  const [setBusinessLicenseImage] = useMutation<
    SetBusinessLicenseImage,
    SetBusinessLicenseImageVariables
  >(GQL_SET_BUSINESS_LICENSE_IMAGE);
  const [setProjectCloudConfiguration] = useMutation<
    SetProjectCloudConfiguration,
    SetProjectCloudConfigurationVariables
  >(GQL_SET_PROJECT_CLOUD_CONFIG);
  const [setEmailConfig] = useMutation<SetEmailConfig, SetEmailConfigVariables>(
    GQL_SET_EMAIL_CONFIG
  );
  const [setWechatAppSettings] = useMutation<SetWechatAppSettings, SetWechatAppSettingsVariables>(
    GQL_SET_WECHAT_APP_SETTINGS
  );
  const [setWechatPaymentSettings] = useMutation<
    SetWechatPaymentSettings,
    SetWechatPaymentSettingsVariables
  >(GQL_SET_WECHAT_PAYMENT_SETTINGS);
  const [setAliyunSmsConfig] = useMutation<SetAliyunSms, SetAliyunSmsVariables>(GQL_SET_ALIYUN_SMS);
  const [setAliyunSmsAttorney] = useMutation<SetAliyunSmsAttorney, SetAliyunSmsAttorneyVariables>(
    GQL_SET_ALIYUN_SMS_ATTORNEY
  );
  const [setAliyunSmsSignature] = useMutation<
    SetAliyunSmsSignature,
    SetAliyunSmsSignatureVariables
  >(GQL_SET_ALIYUN_SMS_SIGNATURE);

  return (
    flow: Exclude<
      UserFlow,
      | UserFlow.SELECT_TARGET
      | UserFlow.DRAG_SELECTED_TARGETS
      | UserFlow.DRAG_DESELECTED
      | UserFlow.DESELECT
      | UserFlow.FOCUS_TARGET
      | UserFlow.DEFOCUS
    >
  ) => {
    switch (flow) {
      // BOARD ACTIONS
      case UserFlow.UNDO:
        return () => diffStore.undoDiff();

      case UserFlow.REDO:
        return () => diffStore.redoDiff();

      case UserFlow.ENABLE_HAND_TOOL:
        return () => {
          editorStore.isHandToolOn = true;
        };

      case UserFlow.DISABLE_HAND_TOOL:
        return () => {
          editorStore.isHandToolOn = false;
        };

      case UserFlow.COPY_SELECTED:
        return () => {
          editorStore.clipBoardMRefs = editorStore.selectedTargets.filter((mRef) => {
            const model = StoreHelpers.getComponentModel(mRef);
            if (!model || !model.canCopy()) return false;
            if (
              model.type === ComponentModelType.BLANK_CONTAINER ||
              model.type === ComponentModelType.CONDITIONAL_CONTAINER_CHILD ||
              model.type === ComponentModelType.MODAL_VIEW
            )
              return false;
            return true;
          });
          if (editorStore.clipBoardMRefs.length > 0) {
            displayNotification('COPIED_TO_CLIPBOARD');
          }
        };

      case UserFlow.PASTE_COPIED:
        return () => {
          const pasteTargets = editorStore.clipBoardMRefs;
          let pastable = true;
          if (pasteTargets.length <= 0) return;

          if (pasteTargets.length > 1) {
            const clipBoardContainerModel = editorStore.clipBoardContainerMRef
              ? StoreHelpers.getComponentModel(editorStore.clipBoardContainerMRef)
              : undefined;

            if (!clipBoardContainerModel) return;

            const models = pasteTargets
              .map((pt) => StoreHelpers.getComponentModel(pt))
              .filter((pt) => pt) as BaseComponentModel[];
            if (models.length !== pasteTargets.length) return;

            // component templates cannot nest itself
            const componentTemplateNested = !!models.find(
              (m) => m.referencedTemplateMRef === clipBoardContainerModel?.previewMRef
            );
            if (componentTemplateNested) return;

            const pasteContainerFrame = getDragSelectedContainerFrame(models);
            const clipBoardContainerFrame = clipBoardContainerModel.getComponentFrame();
            const tx =
              (clipBoardContainerFrame.size.width - pasteContainerFrame.size.width) / 2.0 -
              pasteContainerFrame.position.x;
            const ty =
              (clipBoardContainerFrame.size.height - pasteContainerFrame.size.height) / 2.0 -
              pasteContainerFrame.position.y;

            const clones = models
              .map((m) => m.createCopy(clipBoardContainerModel.mRef))
              .filter((m) => m) as BaseComponentModel[];
            const copyModels = clones.map((clone) => replaceAllReferenceFromComponentModel(clone));
            editorStore.transientMRefMapCopy = {};

            transaction(() => {
              const childDiffs: DiffItem[] = [];
              const childMrefsByParentMref: Record<ShortId, ShortId[]> = {};
              copyModels.forEach((clone) => {
                (clone as BaseMobileComponentModel).setComponentFrame({
                  size: clone.getComponentFrame().size,
                  position: {
                    x: clone.getComponentFrame().position.x + tx,
                    y: clone.getComponentFrame().position.y + ty,
                  },
                });
                const clonedModel = toModel(clone);
                clonedModel.onCreateComponentDiffs().forEach((di) => childDiffs.push(di));
                const parent = StoreHelpers.getComponentModel(clonedModel.parentMRef);
                if (!parent) throw new Error('unexpected empty parent');
                if (childMrefsByParentMref[parent.mRef]) {
                  childMrefsByParentMref[parent.mRef] = [
                    ...childMrefsByParentMref[parent.mRef],
                    clonedModel.mRef,
                  ];
                } else {
                  childMrefsByParentMref[parent.mRef] = [clonedModel.mRef];
                }
              });
              const addChildrenDiffs = Object.entries(childMrefsByParentMref).map(([key, value]) =>
                ComponentDiff.buildAddChildMRefsDiff(key, value)
              );
              diffStore.applyDiff([...childDiffs, ...addChildrenDiffs]);
            });
            editorStore.setSingleClickAndRightDrawerTarget(null);
            editorStore.clipBoardMRefs = [];
            editorStore.selectedTargets = copyModels.map((m) => m.mRef);
          } else {
            const model = StoreHelpers.getComponentModel(pasteTargets[0]);
            if (!model) return;

            if (!editorStore.clipBoardContainerMRef && !model.isRootContainer) return;

            const clipBoardContainerModel = editorStore.clipBoardContainerMRef
              ? StoreHelpers.getComponentModel(editorStore.clipBoardContainerMRef)
              : undefined;

            // component templates cannot nest itself
            if (
              clipBoardContainerModel &&
              model.referencedTemplateMRef === clipBoardContainerModel?.previewMRef
            ) {
              return;
            }

            const cloned = model.createCopy(
              !model.isRootContainer ? clipBoardContainerModel?.mRef : undefined
            );
            if (!cloned) return;
            const clonedModel = replaceAllReferenceFromComponentModel(cloned);
            editorStore.transientMRefMapCopy = {};

            // update position to parent container center
            (clonedModel as BaseMobileComponentModel).setComponentFrame({
              size: clonedModel.getComponentFrame().size,
              position: {
                x: clipBoardContainerModel
                  ? (clipBoardContainerModel.getComponentFrame().size.width -
                      clonedModel.getComponentFrame().size.width) /
                    2.0
                  : 0,
                y: clipBoardContainerModel
                  ? (clipBoardContainerModel.getComponentFrame().size.height -
                      clonedModel.getComponentFrame().size.height) /
                    2.0
                  : 0,
              },
            });
            transaction(() => {
              if (clonedModel.isRootContainer) {
                diffStore.applyDiff([
                  ComponentDiff.buildAddPageMRefDiff(clonedModel.mRef),
                  ...clonedModel.onCreateComponentDiffs(),
                ]);
                editorStore.selectedLeftDrawerKey = LeftDrawerKey.ADD_COMPONENT;
                editorStore.setEditorState({ mode: EditorMode.FOCUS, target: clonedModel.mRef });
              } else {
                const parent = StoreHelpers.findComponentModelOrThrow(clonedModel.parentMRef);
                const wechatOfficialAccountCount = StoreHelpers.getWechatOfficialAccountCount(
                  (parent as BaseMobileContainerModel).childMRefs
                );
                if (model.type === ComponentModelType.WECHAT_OFFICIAL_ACCOUNT) {
                  if (parent.type !== ComponentModelType.MOBILE_PAGE) {
                    displayNotification('ADD_COMPONENT_FAILURE');
                    pastable = false;
                    return;
                  }
                  if (wechatOfficialAccountCount >= 1) {
                    displayNotification('COMPONENT_LIMIT_ONE');
                    pastable = false;
                    return;
                  }
                }
                diffStore.applyDiff([
                  ...clonedModel.onCreateComponentDiffs(),
                  ComponentDiff.buildAddChildMRefsDiff(parent.mRef, [clonedModel.mRef]),
                ]);
              }
              editorStore.setSingleClickAndRightDrawerTarget(clonedModel.mRef);
              editorStore.clipBoardMRefs = [];
              editorStore.selectedTargets = [];
            });
          }
          if (!pastable) return;
          displayNotification('PASTED_FROM_CLIPBOARD');
        };

      case UserFlow.DELETE_SELECTED:
        return (target?: ShortId) => {
          let diffItems: DiffItem[] = [];
          const { selectedTargets } = editorStore;
          if (selectedTargets.length > 0 && !target) {
            transaction(() => {
              const childMrefsByParentMref: Record<string, string[]> = {};
              selectedTargets.forEach((item) => {
                const targetComponent = StoreHelpers.getComponentModel(item);
                if (targetComponent && targetComponent.hasDeleteConfiguration()) {
                  ComponentDiff.buildDeleteComponentDiffs(targetComponent).forEach((di) =>
                    diffItems.push(di)
                  );
                  const { parentMRef, mRef } = targetComponent;
                  const itemChildMRefs = childMrefsByParentMref[parentMRef];
                  if (parentMRef && parentMRef.length > 0) {
                    childMrefsByParentMref[parentMRef] = itemChildMRefs
                      ? [...itemChildMRefs, mRef]
                      : [mRef];
                  }
                }
                if (targetComponent?.isRootContainer) {
                  const refreshTabBarDiffItem = StoreHelpers.genUpdateTabBarDiffItem(
                    targetComponent.mRef
                  );
                  if (refreshTabBarDiffItem) {
                    diffItems.push(refreshTabBarDiffItem);
                  }
                }
              });
              editorStore.selectedTargets = [];
              diffItems = [
                ...diffItems,
                ...Object.entries(childMrefsByParentMref).map(([key, value]) =>
                  ComponentDiff.buildDeleteChildMRefsDiff(key, value)
                ),
              ];
            });
          } else {
            const targetMRef = target ?? head(editorStore.selectedTargets) ?? '';
            const targetComponent = StoreHelpers.getComponentModel(targetMRef);
            if (!targetComponent) return;
            if (!targetComponent.hasDeleteConfiguration()) {
              displayNotification('COMPONENT_NOT_DELETABLE');
              return;
            }
            diffItems = ComponentDiff.buildDeleteComponentDiffs(targetComponent);
            editorStore.rightDrawerTarget = null;
            if (targetComponent.isRootContainer) {
              editorStore.selectedLeftDrawerKey = null;
              editorStore.setEditorState({ mode: EditorMode.HOME, target: null });
              const refreshTabBarDiffItem = StoreHelpers.genUpdateTabBarDiffItem(
                targetComponent.mRef
              );
              if (refreshTabBarDiffItem) {
                diffItems.push(refreshTabBarDiffItem);
              }
            } else {
              const { parentMRef, mRef } = targetComponent;
              diffItems = [
                ...diffItems,
                ComponentDiff.buildDeleteChildMRefsDiff(parentMRef, [mRef]),
              ];
            }
            if (inFocusMode && focusedTarget === targetComponent.mRef) {
              handleDefocus();
            }
          }
          diffStore.applyDiff(diffItems);
        };

      case UserFlow.MOVE_UP:
      case UserFlow.MOVE_DOWN:
      case UserFlow.MOVE_LEFT:
      case UserFlow.MOVE_RIGHT:
      case UserFlow.SHIFT_MOVE_UP:
      case UserFlow.SHIFT_MOVE_DOWN:
      case UserFlow.SHIFT_MOVE_LEFT:
      case UserFlow.SHIFT_MOVE_RIGHT:
        return () => {
          const targetMRefs = editorStore.selectedTargets;

          const targetModels: BaseComponentModel[] = [];
          targetMRefs.forEach((mRef) => {
            const model = StoreHelpers.getComponentModel(mRef);
            if (!model || !model.isDraggable || model.isFrameConfigurationDisabled()) return;
            targetModels.push(model);
          });
          if (targetModels.length < 1) return;

          const getMoveOneComponentFrame = (model: BaseComponentModel): Partial<ZFrame> => {
            let { x, y } = model.getComponentFrame().position;
            if (flow === UserFlow.MOVE_UP) y -= 1;
            else if (flow === UserFlow.MOVE_DOWN) y += 1;
            else if (flow === UserFlow.MOVE_LEFT) x -= 1;
            else if (flow === UserFlow.MOVE_RIGHT) x += 1;
            else if (flow === UserFlow.SHIFT_MOVE_UP) y -= 10;
            else if (flow === UserFlow.SHIFT_MOVE_DOWN) y += 10;
            else if (flow === UserFlow.SHIFT_MOVE_LEFT) x -= 10;
            else if (flow === UserFlow.SHIFT_MOVE_RIGHT) x += 10;
            return { position: { x, y } };
          };
          const diffItems: DiffItem[] = [];
          targetModels.forEach((model) => {
            const newFrame = getMoveOneComponentFrame(model);
            FrameDiff.buildUpdateComponentFrameDiffs(model, newFrame).forEach((di) =>
              diffItems.push(di)
            );
          });
          diffStore.applyDiff(diffItems);
        };

      case UserFlow.ESCAPE:
        if (editorStore.selectedTargets.length === 1) {
          return handleDeselect;
        }
        if (editorStore.selectedTargets.length > 1) {
          return handleDeselectMultSelection;
        }
        return handleDefocus;

      // PROJECT LIFE-CYCLE
      case UserFlow.INIT_PROJECT:
        return (targetProjectExId: ShortId) => {
          if (!targetProjectExId) {
            // go to root path, if no target project exid specified
            history.push('/');
            return;
          }
          const urlSearchParams = new URLSearchParams(window.location.search);
          const joinProjectCode = urlSearchParams.get('code');
          if (joinProjectCode) {
            joinProjectByShareToken(
              client,
              joinProjectCode,
              displayNotification,
              history,
              targetProjectExId
            );
          } else {
            handleProjectInitialization(targetProjectExId, client, history, displayNotification);
          }
        };

      case UserFlow.BE_READY:
        return () => {
          // do nothing
        };

      case UserFlow.CREATE_PROJECT:
        return (
          templateExId: ShortId,
          projectName: string,
          setLoading: (loading: boolean) => void,
          onSuccess?: (projectExId: ShortId) => void
        ) =>
          handleProjectCreation(
            client,
            templateExId,
            projectName,
            setLoading,
            displayNotification,
            onSuccess
          );

      case UserFlow.SAVE_PROJECT:
        return () => {
          StoreHelpers.generateAllComponentLayoutData();
          saveProject(client, (schemaExId: string | null) => {
            if (!schemaExId) {
              displayNotification('PROJECT_SAVE_FAILURE');
            } else {
              diffStore.clearAllDiffs();
              diffStore.lastNetworkDiffSeq = undefined;
              diffStore.diffsPendingUpload = [];
              diffStore.networkDiffsPendingApplication = [];
              projectStore.updateProjectDetails({ schemaExId });
              displayNotification('PROJECT_SAVED');
            }
          });
        };

      case UserFlow.UPLOAD_WECHAT_PROJECT:
        return () => {
          const { wechatAppId, wechatAppSecret } = projectConfig?.wechatAppConfig ?? {};
          if (!wechatAppId || !wechatAppSecret) {
            displayNotification('WECHAT_NOT_AUTHORIZED');
            return;
          }
          StoreHelpers.generateAllComponentLayoutData();

          // TODO: FZM-754 - migrate this to use Promise
          deployProject(client, projectExId ?? '', (exId: string | null) => {
            projectStore.updateDeploymentStatus({
              progressStep: exId ? ProjectProgressStep.PENDING : null,
              isUploading: false,
            });
          });
          projectStore.updateDeploymentStatus({ isUploading: true });
        };

      case UserFlow.UPLOAD_WEB_PROJECT:
        return () => {
          deployProject(client, projectExId ?? '', (exId: string | null) => {
            projectStore.updateDeploymentStatus({
              progressStep: exId ? ProjectProgressStep.PENDING : null,
              isUploading: false,
            });
          });
          projectStore.updateDeploymentStatus({ isUploading: true });
        };

      case UserFlow.UPDATAE_PROJECT_DETAILS:
        return (projectDetails: Partial<ProjectDetails>, callback: () => void) => {
          if (!projectExId) {
            displayNotification('PROJECT_INFO_INVALID');
            return;
          }
          const { projectName } = projectDetails;
          if (!projectName) {
            displayNotification('PROJECT_NAME_MISSING');
            return;
          }
          const { wechatAppId, wechatAppSecret } =
            projectDetails.projectConfig?.wechatAppConfig ?? {};

          const requestCallback = () => {
            projectStore.updateProjectDetails(projectDetails);
            callback();
          };
          if (!isDeveloperMode || !wechatAppId || !wechatAppSecret) {
            setProjectName(client, projectName, projectExId, requestCallback);
          } else {
            setProjectDetails(
              client,
              projectName,
              projectExId,
              wechatAppId,
              wechatAppSecret,
              requestCallback
            );
          }
        };

      case UserFlow.UPDATE_PROJECT_CONFIGURATION:
        return (projectConfiguration: Partial<ProjectConfig>) => {
          if (projectConfiguration.businessLicenseImageExId) {
            updateBusinessLicenseImage(
              projectConfiguration.businessLicenseImageExId,
              projectExId,
              setBusinessLicenseImage,
              displayNotification,
              projectStore
            );
          }
          if (projectConfiguration.cloudConfigurationExId) {
            updateProjectCloudConfiguration(
              projectConfiguration.cloudConfigurationExId,
              projectExId,
              setProjectCloudConfiguration,
              displayNotification,
              projectStore
            );
          }
          if (projectConfiguration.emailConfig) {
            updateEmailConfig(
              projectConfiguration.emailConfig,
              projectExId,
              setEmailConfig,
              displayNotification,
              projectStore
            );
          }
          if (projectConfiguration.wechatAppConfig) {
            if (
              projectConfiguration.wechatAppConfig.wechatAppId &&
              projectConfiguration.wechatAppConfig.wechatAppSecret
            ) {
              if (
                projectConfiguration.wechatAppConfig.wechatPaymentMerchantId &&
                projectConfiguration.wechatAppConfig.wechatPaymentMerchantKey
              ) {
                updateWechatPaymentConfig(
                  projectConfiguration.wechatAppConfig,
                  projectExId,
                  setWechatPaymentSettings,
                  displayNotification,
                  projectStore
                );
              } else {
                updateWechatAppConfig(
                  projectConfiguration.wechatAppConfig,
                  projectExId,
                  setWechatAppSettings,
                  displayNotification,
                  projectStore
                );
              }
            }
          }
          if (projectConfiguration.aliyunSmsConfig) {
            updateAliyunSmsConfig(
              projectConfiguration.aliyunSmsConfig,
              projectExId,
              setAliyunSmsConfig,
              setAliyunSmsAttorney,
              setAliyunSmsSignature,
              displayNotification,
              projectStore
            );
          }
        };

      case UserFlow.DELETE_PROJECT:
        return () => {
          if (!projectExId) return;
          deleteProject(client, projectExId, () => {
            history.push('/');
          });
        };

      case UserFlow.SUBMIT_PREVIEW:
        return () => {
          submitToReview(client);
        };

      case UserFlow.PUBLISH:
        return () => {
          publishWechatProgram(client);
        };

      default:
        return () => {
          throw new Error('unknown user flow');
        };
    }
  };
}

function handleProjectCreation(
  client: ApolloClient<any>,
  templateExId: string,
  projectName: string,
  setLoading: (loading: boolean) => void | null,
  displayNotification: DisplayNotification,
  onSuccess?: (projectExId: ShortId) => void
): void {
  const handleProjectDetailsReception = (project: ProjectDetailsFragment | null | undefined) => {
    const { exId: targetProjectExId } = project ?? {};
    if (onSuccess && targetProjectExId) onSuccess(targetProjectExId);
  };
  const handleProjectCreationFailure = (error?: any) => {
    displayNotification(error.message, undefined, 'error');
    setLoading && setLoading(false);
  };
  setLoading && setLoading(true);

  client
    .mutate({
      mutation: GQL_CREATE_PROJECT,
      variables: {
        projectName: projectName.length > 0 ? projectName : DefaultProjectName,
        templateExId: templateExId.length > 0 ? templateExId : undefined,
      },
    })
    .then((response) => handleProjectDetailsReception(response.data?.createProject))
    .catch(handleProjectCreationFailure);
}

function handleProjectInitialization(
  projectExId: string | null,
  client: ApolloClient<any>,
  history: any,
  displayNotification: DisplayNotification
): void {
  // helpers
  const handleUploadSchemaFailure = (error?: any) => {
    if (AllStores.persistedStore.isDeveloperMode) {
      console.error(JSON.stringify(error));
    }
    displayNotification('PROJECT_INIT_FAILURE');
    history.push('/');
  };
  const handleProjectDetailsReception = (rsp: any) => {
    const project: FetchProjectDetailsByExId_project =
      rsp?.data?.project || rsp?.data?.createProject;
    const { exId: targetProjectExId, lastUploadedSchema } = project ?? {};
    if (!project || !targetProjectExId) {
      handleUploadSchemaFailure('missing projectExId in project-details fetching query');
      AllStores.projectStore.projectStatus = 'ERROR';
    } else {
      AllStores.projectStore.updateProjectDetails({
        projectExId: targetProjectExId,
        projectName: project.projectName || DefaultProjectName,
        collaboratorType: project.collaboratorType ?? undefined,
        debugScriptUrl: project.debugScriptUrl ?? undefined,
        projectConfig: project.projectConfig ?? undefined,
        schemaExId: lastUploadedSchema?.exId ?? undefined,
        managementConsoleUrl: project.managementConsoleUrl ?? undefined,
        customizedMcUrl: project.customizedMcUrl ?? undefined,
        customizedMcDefaultPassword: project.customizedMcDefaultPassword ?? undefined,
        mobileWebUrl: project.mobileWebUrl ?? undefined,
        schemaHistory: project.schemaHistory,
        hasBindCloudConfiguration: project.hasBindCloudConfiguration,
      });
      AllStores.smsTemplateStore.fetchTemplates();
    }
    const rehydratedCoreData = StoreRehydrate.toCoreStoreData(lastUploadedSchema?.appSchema);
    if (!rehydratedCoreData) {
      handleUploadSchemaFailure('failed to rehydrate core data');
    } else {
      displayNotification('PROJECT_FETCHING_SUCCESS');
      AllStores.coreStore.rehydrate(rehydratedCoreData);
      AllStores.editorStore.restoreEditorDataFromLocalStorage();
      buildTargetInitialization(AllStores.editorStore.editorPlatform);
    }
  };
  const handleQueriesForProjectDetails = (
    query: QueryOptions<FetchProjectDetailsByExIdVariables, FetchProjectDetailsByExId>
  ) => client.query(query).then(handleProjectDetailsReception).catch(handleUploadSchemaFailure);

  const updateProjectDetailsByExId = (targetProjectExId: string) =>
    handleQueriesForProjectDetails({
      query: GQL_FETCH_PROJECT_DETAILS_BY_EX_ID,
      variables: { projectExId: targetProjectExId },
    });

  if (!projectExId) {
    handleUploadSchemaFailure('no target project exid');
  } else {
    updateProjectDetailsByExId(projectExId);
  }
}

// update config
const updateBusinessLicenseImage = (
  businessLicenseImageExId: string,
  projectExId: string,
  setBusinessLicenseImage: MutationTuple<
    SetBusinessLicenseImage,
    SetBusinessLicenseImageVariables
  >[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  setBusinessLicenseImage({
    variables: {
      projectExId,
      businessLicenseImageExId,
    },
  })
    .then(({ data }) => {
      if (data?.setBusinessLicenseImage?.projectConfig) {
        projectStore.updateBusinessLicenseImage(
          data.setBusinessLicenseImage.projectConfig.businessLicenseImageExId
        );
      } else throw data;
      displayNotification('CONFIG_BUSINESS_LICENSE_SUCCESS');
    })
    .catch((reason) => {
      // eslint-disable-next-line no-console
      console.log(reason);
      displayNotification('CONFIG_BUSINESS_LICENSE_FAILURE');
    });
};
const updateProjectCloudConfiguration = (
  cloudConfigurationExId: string,
  projectExId: string,
  setProjectCloudConfiguration: MutationTuple<
    SetProjectCloudConfiguration,
    SetProjectCloudConfigurationVariables
  >[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  setProjectCloudConfiguration({
    variables: {
      projectExId,
      cloudConfigurationExId,
    },
  })
    .then(({ errors }) => {
      if (errors) {
        displayNotification('CONFIG_CLOUD_FAILURE');
        return;
      }
      displayNotification('CONFIG_CLOUD_SUCCESS');
      projectStore.updateProjectDetails({ hasBindCloudConfiguration: true });
    })
    .catch(() => {
      displayNotification('CONFIG_CLOUD_FAILURE');
    });
};

const updateEmailConfig = (
  emailConfig: EmailConfig,
  projectExId: string,
  setEmailConfig: MutationTuple<SetEmailConfig, SetEmailConfigVariables>[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  const { emailPassword, emailProvider, emailSender } = emailConfig;
  if (emailPassword && emailProvider && emailSender) {
    setEmailConfig({
      variables: {
        projectExId,
        emailConfig,
      },
    })
      .then(({ data }) => {
        if (data?.setEmailConfig?.projectConfig) {
          projectStore.updateEmailConfig(data.setEmailConfig.projectConfig.emailConfig);
        } else throw data;
        displayNotification('CONFIG_EMAIL_SUCCESS');
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        displayNotification('CONFIG_EMAIL_FAILURE');
      });
  } else displayNotification('CONFIG_EMAIL_FAILURE');
};

const updateWechatAppConfig = (
  wechatAppConfig: WechatAppConfig,
  projectExId: string,
  setWechatAppSettings: MutationTuple<SetWechatAppSettings, SetWechatAppSettingsVariables>[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  const { wechatAppId, wechatAppSecret } = wechatAppConfig;
  if (wechatAppId && wechatAppSecret) {
    setWechatAppSettings({
      variables: {
        projectExId,
        wechatAppId,
        wechatAppSecret,
      },
    })
      .then(({ data }) => {
        if (data?.setWechatAppSettings?.projectConfig) {
          projectStore.updateWechatAppConfig(
            data.setWechatAppSettings.projectConfig.wechatAppConfig
          );
        } else throw data;
        displayNotification('CONFIG_WECHAT_SUCCESS');
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        displayNotification('CONFIG_WECHAT_FAILURE');
      });
  } else displayNotification('CONFIG_WECHAT_FAILURE');
};

const updateWechatPaymentConfig = (
  wechatAppConfig: WechatAppConfig,
  projectExId: string,
  setWechatPaymentSettings: MutationTuple<
    SetWechatPaymentSettings,
    SetWechatPaymentSettingsVariables
  >[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  const { wechatPaymentMerchantId, wechatPaymentMerchantKey } = wechatAppConfig;
  if (wechatPaymentMerchantId && wechatPaymentMerchantKey) {
    setWechatPaymentSettings({
      variables: {
        projectExId,
        wechatPaymentMerchantId,
        wechatPaymentMerchantKey,
      },
    })
      .then(({ data }) => {
        if (data?.setWechatPaymentSettings?.projectConfig) {
          projectStore.updateWechatAppConfig(
            data.setWechatPaymentSettings.projectConfig.wechatAppConfig
          );
        } else throw data;
        displayNotification('CONFIG_WECHAT_SUCCESS');
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        displayNotification('CONFIG_WECHAT_FAILURE');
      });
  } else displayNotification('CONFIG_WECHAT_FAILURE');
};

const updateAliyunSmsConfig = (
  aliyunSmsConfig: AliyunSmsConfig,
  projectExId: string,
  setAliyunSmsConfig: MutationTuple<SetAliyunSms, SetAliyunSmsVariables>[0],
  setAliyunSmsAttorney: MutationTuple<SetAliyunSmsAttorney, SetAliyunSmsAttorneyVariables>[0],
  setAliyunSmsSignature: MutationTuple<SetAliyunSmsSignature, SetAliyunSmsSignatureVariables>[0],
  displayNotification: DisplayNotification,
  projectStore: ProjectStore
) => {
  const { powerOfAttorneyImageExId, signature } = aliyunSmsConfig;
  if (powerOfAttorneyImageExId && signature) {
    const { description, signSource, signature: smsSignature } = signature;
    if (description && signSource && smsSignature) {
      setAliyunSmsConfig({
        variables: {
          projectExId,
          powerOfAttorneyImageExId,
          signature,
        },
      })
        .then(({ data }) => {
          if (
            data?.setAliyunSmsCertifiedPowerOfAttorneyImage?.projectConfig?.aliyunSmsConfig &&
            data?.setAliyunSmsSignature?.projectConfig?.aliyunSmsConfig
          ) {
            projectStore.updateAliyunSmsConfig({
              powerOfAttorneyImageExId:
                data.setAliyunSmsCertifiedPowerOfAttorneyImage.projectConfig.aliyunSmsConfig
                  .powerOfAttorneyImageExId,
              signature: data.setAliyunSmsSignature.projectConfig.aliyunSmsConfig.signature,
            });
          } else throw data;
          displayNotification('CONFIG_SMS_SUCCESS');
        })
        .catch((reason) => {
          // eslint-disable-next-line no-console
          console.log(reason);
          displayNotification('CONFIG_SMS_FAILURE');
        });
    }
  } else if (powerOfAttorneyImageExId) {
    setAliyunSmsAttorney({
      variables: {
        projectExId,
        powerOfAttorneyImageExId,
      },
    })
      .then(({ data }) => {
        if (data?.setAliyunSmsCertifiedPowerOfAttorneyImage?.projectConfig?.aliyunSmsConfig) {
          projectStore.updateAliyunSmsConfig({
            powerOfAttorneyImageExId:
              data.setAliyunSmsCertifiedPowerOfAttorneyImage.projectConfig.aliyunSmsConfig
                .powerOfAttorneyImageExId,
          });
        } else throw data;
        displayNotification('CONFIG_SMS_SUCCESS');
      })
      .catch((reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        displayNotification('CONFIG_SMS_FAILURE');
      });
  } else if (signature) {
    const { description, signSource, signature: smsSignature } = signature;
    if (description && signSource && smsSignature) {
      setAliyunSmsSignature({
        variables: {
          projectExId,
          signature,
        },
      })
        .then(({ data }) => {
          if (data?.setAliyunSmsSignature?.projectConfig?.aliyunSmsConfig) {
            projectStore.updateAliyunSmsConfig({
              signature: data.setAliyunSmsSignature.projectConfig.aliyunSmsConfig.signature,
            });
          } else throw data;
          displayNotification('CONFIG_SMS_SUCCESS');
        })
        .catch((reason) => {
          // eslint-disable-next-line no-console
          console.log(reason);
          displayNotification('CONFIG_SMS_FAILURE');
        });
    }
  } else displayNotification('CONFIG_SMS_FAILURE');
};

export function replaceAllReferenceFromComponentModel(
  clone: BaseComponentModel
): BaseComponentModel {
  // TODO. 复制后 换成所有MRef引用，后续MRef重构后，替换掉这段逻辑
  const { editorStore } = AllStores;
  const { parentMRef } = clone;
  let jsonString = JSON.stringify(clone);
  Object.entries(editorStore.transientMRefMapCopy).forEach(([key, value]) => {
    jsonString = jsonString.replaceAll(key, value);
  });
  clone = JSON.parse(jsonString);
  // 避免 容器复制自己到自己当中, parentMRef被上述replaceAll替换
  clone.parentMRef = parentMRef;

  // 复制后 重新生成triggerId
  replaceTriggerId(clone);

  return toModel(clone);
}

function replaceTriggerId(node: any) {
  if (node instanceof Array) {
    node.forEach((item) => {
      replaceTriggerId(item);
    });
  } else if (node instanceof Object) {
    if (node.hasOwnProperty('triggers') && node.triggers instanceof Array) {
      node.triggers.forEach((trigger: any) => {
        trigger.id = uniqid.process();
      });
    } else {
      Object.values(node).forEach((value) => {
        replaceTriggerId(value);
      });
    }
  }
}

function buildTargetInitialization(platform: ZedSupportedPlatform) {
  const buildTarget: BuildTarget[] = ['MANAGEMENT_CONSOLE'];
  switch (platform) {
    case ZedSupportedPlatform.WECHAT:
      buildTarget.push('WECHAT_MINIPROGRAM');
      break;
    case ZedSupportedPlatform.MOBILE_WEB:
      buildTarget.push('MOBILE_WEB');
      break;
    default:
      break;
  }
  AllStores.coreStore.updateAppConfiguration({ buildTarget });
}

function joinProjectByShareToken(
  client: ApolloClient<any>,
  code: string,
  displayNotification: DisplayNotification,
  history: any,
  targetProjectExId: string
): void {
  const handleJoinProjectSucess = (rsp: any) => {
    const projectExId = rsp.data.joinProjectByShareToken.exId;
    if (projectExId) {
      displayNotification('JOIN_PROJECT_SUCCESS');
    } else {
      displayNotification('JOIN_PROJECT_FAILURE');
    }
    history.push(`/tool/${targetProjectExId}`);
  };
  const handleJoinProjectFailure = (error?: any) => {
    if (AllStores.persistedStore.isDeveloperMode) {
      console.error(JSON.stringify(error));
    }
    displayNotification('JOIN_PROJECT_FAILURE');
    history.push(`/tool/${targetProjectExId}`);
  };
  client
    .mutate({
      mutation: GQL_JOIN_PROJECT_BY_SHARE_TOKEN,
      variables: {
        code,
      },
    })
    .then((response) => handleJoinProjectSucess(response))
    .catch(handleJoinProjectFailure);
}
