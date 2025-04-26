import { action, observable } from 'mobx';
import { QueryOptions } from '@apollo/client';
import {
  FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus,
  FetchAliyunSmsTemplatesStatus,
  FetchAliyunSmsTemplatesStatusVariables,
} from '../../graphQL/__generated__/FetchAliyunSmsTemplatesStatus';
import {
  SetAliyunSmsTemplates,
  SetAliyunSmsTemplatesVariables,
} from '../../graphQL/__generated__/SetAliyunSmsTemplates';
import { AllStores } from '../StoreContexts';
import {
  GQL_FETCH_SMS_NOTIFICATION_TEMPLATE,
  GQL_SET_SMS_NOTIFICATION_TEMPLATE,
} from '../../graphQL/fetchAliyunSmsTemplate';
import ZNotification from '../../utils/notifications/ZNotifications';
import { AliyunSmsTemplateParamsInput } from '../../graphQL/__generated__/globalTypes';

export const newTemplateCode = 'newTemplate';

export class SmsTemplateStore {
  @observable
  public smsTemplatesList: FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus[] = [];

  @action
  private setTemplates(templates: FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus[]): void {
    templates.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    this.smsTemplatesList = templates;
  }

  @action
  public fetchTemplates(): void {
    const { sessionStore, projectStore } = AllStores;

    const projectExId = projectStore.projectDetails?.projectExId;
    if (!projectExId) throw new Error('Project Id Not Found.');
    const handleQueriesForFetchSmsTemplate = (
      query: QueryOptions<FetchAliyunSmsTemplatesStatusVariables, FetchAliyunSmsTemplatesStatus>
    ) =>
      sessionStore.clientForSession
        .query(query)
        .then((response) => {
          this.setTemplates(response.data.aliyunSmsTemplatesStatus);
        })
        .catch((e) => {
          const noti = new ZNotification(e);
          noti.sendTextNotification(e.message, 'error');
        });
    const updateSmsTemplates = (targetProjectExId: string) =>
      handleQueriesForFetchSmsTemplate({
        query: GQL_FETCH_SMS_NOTIFICATION_TEMPLATE,
        variables: { projectExId: targetProjectExId },
      });
    updateSmsTemplates(projectExId);
  }

  @action
  public uploadTemplate(
    targetTemplate: AliyunSmsTemplateParamsInput,
    targetTemplateCode?: string
  ): void {
    const { sessionStore, projectStore } = AllStores;
    const projectExId = projectStore.projectDetails?.projectExId;
    if (!projectExId) throw new Error('Project Id Not Found.');
    let newTemplate: AliyunSmsTemplateParamsInput;
    if (targetTemplateCode && targetTemplateCode !== newTemplateCode) {
      newTemplate = { templateCode: targetTemplateCode, ...targetTemplate };
    } else {
      newTemplate = targetTemplate;
    }
    if (!newTemplate) return;

    const handleQueriesForSetSmsTemplate = (
      query: QueryOptions<SetAliyunSmsTemplatesVariables, SetAliyunSmsTemplates>
    ) => {
      sessionStore.clientForSession
        .query(query)
        .then(() => this.fetchTemplates())
        .catch((e) => {
          const noti = new ZNotification(e);
          noti.sendTextNotification(e.message, 'error');
        });
    };
    const updateSmsTemplates = (
      newTemplateInput: AliyunSmsTemplateParamsInput[],
      targetProjectExId: string
    ) =>
      handleQueriesForSetSmsTemplate({
        query: GQL_SET_SMS_NOTIFICATION_TEMPLATE,
        variables: { templates: newTemplateInput, projectExId: targetProjectExId },
      });
    updateSmsTemplates([newTemplate], projectExId);
  }

  @action
  public deleteTemplate(targetTemplateCode: string): void {
    // TODO
  }
}
