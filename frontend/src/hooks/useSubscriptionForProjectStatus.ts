/* eslint-disable import/no-default-export */
import { useSubscription } from '@apollo/client';
import { ProjectProgressStep } from '../components/side-drawer-tabs/left-drawer/PublishProgressTab';
import GQL_ON_DEPLOYMENT_STATUS_CHANGE from '../graphQL/onDeploymentStatusChange';
import { DeploymentStatus } from '../graphQL/__generated__/globalTypes';
import {
  OnDeploymentStatusChanged,
  OnDeploymentStatusChangedVariables,
  OnDeploymentStatusChanged_onDeploymentStatusChanged,
} from '../graphQL/__generated__/OnDeploymentStatusChanged';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import useProjectDeploymentStatus from './useProjectDeploymentStatus';
import useProjectDetails from './useProjectDetails';
import i18n from '../utils/notifications/ZNotifications.i18n.json';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';

export default function useSubscriptionForProjectStatus(): void {
  const { projectExId } = useProjectDetails();
  const deploymentStatus = useProjectDeploymentStatus();
  const currentStep = deploymentStatus?.progressStep;
  useSubscription<OnDeploymentStatusChanged, OnDeploymentStatusChangedVariables>(
    GQL_ON_DEPLOYMENT_STATUS_CHANGE,
    {
      skip: !projectExId,
      variables: { projectExId },
      onSubscriptionData: ({ subscriptionData: { data } }) => {
        if (data?.onDeploymentStatusChanged) {
          processReceivedProjectStatusData(data.onDeploymentStatusChanged, currentStep, true);
        }
      },
    }
  );
}

export function processReceivedProjectStatusData(
  data: OnDeploymentStatusChanged_onDeploymentStatusChanged,
  currentStep?: ProjectProgressStep | null,
  notify?: boolean
): void {
  const status = data.deploymentStatus;
  const progressStep = mapGqlProjectStatusToProjectProgressStep(status);
  AllStores.projectStore.updateDeploymentStatus({ extraData: data, progressStep });

  if (progressStep === ProjectProgressStep.READY && currentStep !== ProjectProgressStep.READY)
    AllStores.editorStore.addAuditNotification();
  if (notify && progressStep && progressStep !== currentStep) {
    const { locale } = AllStores.persistedStore;
    const { editorPlatform } = AllStores.editorStore;
    const notif = new ZNotification(i18n[locale]);
    switch (editorPlatform) {
      case ZedSupportedPlatform.WECHAT:
        switch (progressStep) {
          case ProjectProgressStep.PENDING:
            notif.send('WECHAT_BUILD_PENDING');
            break;
          case ProjectProgressStep.GENERATING:
            notif.send('WECHAT_BUILD_COMMENCE');
            break;
          case ProjectProgressStep.PACKAGING:
            notif.send('WECHAT_PACKAGE_COMMENCE');
            break;
          case ProjectProgressStep.READY:
            notif.send('WECHAT_BUILD_SUCCESS');
            break;
          case ProjectProgressStep.FAILED:
            notif.send('WECHAT_BUILD_FAILURE');
            break;
          default:
        }
        break;
      case ZedSupportedPlatform.MOBILE_WEB:
        switch (progressStep) {
          case ProjectProgressStep.PENDING:
            notif.send('MOBILE_WEB_BUILD_PENDING');
            break;
          case ProjectProgressStep.GENERATING:
            notif.send('MOBILE_WEB_BUILD_COMMENCE');
            break;
          case ProjectProgressStep.PACKAGING:
            notif.send('MOBILE_WEB_PACKAGE_COMMENCE');
            break;
          case ProjectProgressStep.READY:
            notif.send('MOBILE_WEB_BUILD_SUCCESS');
            break;
          case ProjectProgressStep.FAILED:
            notif.send('MOBILE_WEB_BUILD_FAILURE');
            break;
          default:
        }
        break;
      default:
        break;
    }
  }
}

function mapGqlProjectStatusToProjectProgressStep(
  status: DeploymentStatus | null
): ProjectProgressStep | null {
  const { deploymentStatus } = AllStores.projectStore;
  const currentStep = deploymentStatus?.progressStep;
  switch (status) {
    case DeploymentStatus.INITIALIZING:
    case DeploymentStatus.DEPLOYING:
      return ProjectProgressStep.PENDING;
    case DeploymentStatus.GENERATING:
      return ProjectProgressStep.GENERATING;
    case DeploymentStatus.PACKAGING_WECHAT_MINIPROGRAM:
    case DeploymentStatus.PACKAGING_MOBILE_WEB:
      return ProjectProgressStep.PACKAGING;
    case DeploymentStatus.PACKAGE_WECHAT_MINIPROGRAM_COMPLETE:
    case DeploymentStatus.PACKAGE_ALL_COMPLETE:
    case DeploymentStatus.PACKAGING_MOBILE_WEB_COMPLETE:
      return ProjectProgressStep.READY;
    case DeploymentStatus.FAILED:
      return ProjectProgressStep.FAILED;
    case DeploymentStatus.PACKAGING_MANAGEMENT_CONSOLE:
    case DeploymentStatus.PACKAGE_MANAGEMENT_CONSOLE_COMPLETE:
    default:
      return currentStep ?? null;
  }
}
