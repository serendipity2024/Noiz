/* eslint-disable import/no-default-export */
import { QueryOptions } from '@apollo/client';
import { isUndefined } from 'lodash';
import { action, observable } from 'mobx';
import { ProjectProgressStep } from '../../components/side-drawer-tabs/left-drawer/PublishProgressTab';
import { GQL_FETCH_PROJECT_ACCOUNTS } from '../../graphQL/fetchProjectAccounts';
import { GQL_REMOVE_ACCOUNT_FROM_PROJECT } from '../../graphQL/removeAccountFromtProject';
import { EmailConfigFragment } from '../../graphQL/__generated__/EmailConfigFragment';
import {
  FetchProjectAccounts,
  FetchProjectAccountsVariables,
  FetchProjectAccounts_projectAccounts_edges_node,
} from '../../graphQL/__generated__/FetchProjectAccounts';
import { FetchProjectDetailsByExId_project_schemaHistory } from '../../graphQL/__generated__/FetchProjectDetailsByExId';
import { AuditStatus, CollaboratorType } from '../../graphQL/__generated__/globalTypes';
import { HasuraConfigFragment } from '../../graphQL/__generated__/HasuraConfigFragment';
import { OnDeploymentStatusChanged_onDeploymentStatusChanged } from '../../graphQL/__generated__/OnDeploymentStatusChanged';
import {
  RemoveAccountFromProject,
  RemoveAccountFromProjectVariables,
} from '../../graphQL/__generated__/RemoveAccountFromProject';
import { SmsConfigFragment_signature } from '../../graphQL/__generated__/SmsConfigFragment';
import { WechatConfigFragment } from '../../graphQL/__generated__/WechatConfigFragment';
import { ShortId } from '../../shared/type-definition/ZTypes';
import ZNotification from '../../utils/notifications/ZNotifications';
import { AllStores } from '../StoreContexts';

type ProjectStoreExtraDataType = OnDeploymentStatusChanged_onDeploymentStatusChanged | null;

export interface ProjectDeploymentStatus {
  progressStep: ProjectProgressStep | null;
  isUploading: boolean;
  extraData: ProjectStoreExtraDataType;
}

export const DefaultProjectName = 'Project_ZERO';

export type WechatAppConfig = Omit<WechatConfigFragment, '__typename'>;
export type HasuraConfig = Omit<HasuraConfigFragment, '__typename'>;
export type AliyunSmsSignatureConfig = Omit<SmsConfigFragment_signature, '__typename'>;
export type AliyunSmsConfig = {
  powerOfAttorneyImageExId: string | null;
  signature: AliyunSmsSignatureConfig | null;
};
export type EmailConfig = Omit<EmailConfigFragment, '__typename'>;
export type ProjectSchemaVersion = Omit<
  FetchProjectDetailsByExId_project_schemaHistory,
  '__typename'
>;

export interface ProjectConfig {
  wechatAppConfig: WechatAppConfig | null;
  hasuraConfig: HasuraConfig | null;
  aliyunSmsConfig: AliyunSmsConfig | null;
  emailConfig: EmailConfig | null;
  registerToken: string | null;
  businessLicenseImageExId: string | null;
  cloudConfigurationExId?: string | null;
}

export interface ProjectDetails {
  projectExId: ShortId;
  projectName: string;
  collaboratorType: CollaboratorType;
  projectConfig: ProjectConfig | null;
  managementConsoleUrl: string;
  customizedMcUrl: string;
  customizedMcDefaultPassword: string;
  schemaExId: ShortId;
  debugScriptUrl: string;
  mobileWebUrl: string;
  schemaHistory: ProjectSchemaVersion[];
  hasBindCloudConfiguration: boolean;
}

export interface ProjectAuditDetails {
  auditId: string;
  auditStatus: AuditStatus;
  reason: string | null;
  createdAt: string;
  published: boolean;
}

export default class ProjectStore {
  /*
   * =======================
   * || Observable Fields ||
   * =======================
   */
  @observable
  public deploymentStatus: ProjectDeploymentStatus | null = null;

  @observable
  public auditDetails: ProjectAuditDetails | null = null;

  @observable
  public projectDetails: ProjectDetails | null = null;

  @observable
  public projectStatus: 'LOADING' | 'LOADED' | 'ERROR' = 'LOADING';

  @observable
  public projectAccount: FetchProjectAccounts_projectAccounts_edges_node[] = [];

  constructor() {
    this.reset();
  }

  /*
   * =============
   * || Actions ||
   * =============
   */
  @action
  public updateDeploymentStatus(newStatus: Partial<ProjectDeploymentStatus>): void {
    this.deploymentStatus = { ...this.deploymentStatus, ...newStatus } as ProjectDeploymentStatus;
  }

  @action
  public updateAuditDetails(newDetails: ProjectAuditDetails | null): void {
    if (
      this.auditDetails?.auditId !== newDetails?.auditId ||
      this.auditDetails?.auditStatus !== newDetails?.auditStatus
    ) {
      AllStores.editorStore.addAuditNotification();
    }
    this.auditDetails = newDetails;
  }

  @action
  public updateProjectDetails(newDetails: Partial<ProjectDetails>): void {
    this.projectDetails = { ...this.projectDetails, ...newDetails } as ProjectDetails;
  }

  @action
  public updateWechatAppConfig(newConfig: WechatAppConfig | null): void {
    if (this.projectDetails) {
      if (!this.projectDetails.projectConfig) {
        this.projectDetails.projectConfig = {
          emailConfig: null,
          hasuraConfig: null,
          aliyunSmsConfig: null,
          wechatAppConfig: null,
          registerToken: null,
          businessLicenseImageExId: null,
        };
      }
      this.projectDetails.projectConfig.wechatAppConfig = newConfig;
    }
  }

  @action
  public updateEmailConfig(newConfig: EmailConfig | null): void {
    if (this.projectDetails) {
      if (!this.projectDetails.projectConfig) {
        this.projectDetails.projectConfig = {
          emailConfig: null,
          hasuraConfig: null,
          aliyunSmsConfig: null,
          wechatAppConfig: null,
          registerToken: null,
          businessLicenseImageExId: null,
        };
      }
      this.projectDetails.projectConfig.emailConfig = newConfig;
    }
  }

  @action
  public updateBusinessLicenseImage(newImage: string | null): void {
    if (this.projectDetails) {
      if (!this.projectDetails.projectConfig) {
        this.projectDetails.projectConfig = {
          emailConfig: null,
          hasuraConfig: null,
          aliyunSmsConfig: null,
          wechatAppConfig: null,
          registerToken: null,
          businessLicenseImageExId: null,
        };
      }
      this.projectDetails.projectConfig.businessLicenseImageExId = newImage;
    }
  }

  @action
  public updateAliyunSmsConfig(newConfig: Partial<AliyunSmsConfig>): void {
    if (this.projectDetails) {
      if (!this.projectDetails.projectConfig) {
        this.projectDetails.projectConfig = {
          emailConfig: null,
          hasuraConfig: null,
          aliyunSmsConfig: null,
          wechatAppConfig: null,
          registerToken: null,
          businessLicenseImageExId: null,
        };
      }
      if (!isUndefined(newConfig.powerOfAttorneyImageExId)) {
        this.projectDetails.projectConfig.aliyunSmsConfig = {
          signature: null,
          ...this.projectDetails.projectConfig.aliyunSmsConfig,
          powerOfAttorneyImageExId: newConfig.powerOfAttorneyImageExId,
        };
      }
      if (!isUndefined(newConfig.signature)) {
        this.projectDetails.projectConfig.aliyunSmsConfig = {
          powerOfAttorneyImageExId: null,
          ...this.projectDetails.projectConfig.aliyunSmsConfig,
          signature: newConfig.signature,
        };
      }
    }
  }

  @action
  public verifyUserCollaboratorType(collaboratorType: CollaboratorType): boolean {
    return this.projectDetails?.collaboratorType === collaboratorType;
  }

  @action
  private setProjectAccount(
    projectAccounts: FetchProjectAccounts_projectAccounts_edges_node[]
  ): void {
    this.projectAccount = projectAccounts;
  }

  @action
  public fetchProjectAccount(): void {
    const { sessionStore } = AllStores;
    const projectExId = this.projectDetails?.projectExId;
    if (!projectExId) throw new Error('Project Id Not Found.');

    const query: QueryOptions<FetchProjectAccountsVariables, FetchProjectAccounts> = {
      query: GQL_FETCH_PROJECT_ACCOUNTS,
      variables: { projectExId },
    };

    sessionStore.clientForSession
      .query(query)
      .then((response) => {
        this.setProjectAccount(
          (response.data.projectAccounts?.edges ?? [])
            .map((edge: any) => edge.node)
            .filter((e) => e.projectCollaboratorType !== CollaboratorType.OWNER)
        );
      })
      .catch((e) => {
        const noti = new ZNotification(e);
        noti.sendTextNotification(e.message, 'error');
      });
  }

  @action
  public removeProjectAccount(accountExId: string): void {
    const { sessionStore } = AllStores;
    const projectExId = this.projectDetails?.projectExId;
    if (!projectExId) throw new Error('Project Id Not Found.');

    const query: QueryOptions<RemoveAccountFromProjectVariables, RemoveAccountFromProject> = {
      query: GQL_REMOVE_ACCOUNT_FROM_PROJECT,
      variables: {
        collaboratorExId: accountExId,
        projectExId,
      },
    };

    sessionStore.clientForSession
      .query(query)
      .then(() => this.fetchProjectAccount())
      .catch((e) => {
        const noti = new ZNotification(e);
        noti.sendTextNotification(e.message, 'error');
      });
  }

  @action
  public reset(): void {
    this.deploymentStatus = null;
    this.auditDetails = null;
    this.projectDetails = null;
    this.projectStatus = 'LOADING';
  }
}
