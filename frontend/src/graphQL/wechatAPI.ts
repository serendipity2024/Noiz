import { ApolloClient, gql } from '@apollo/client';
import GQL_WECHAT_CONFIG_FRAGMENT from './fragments/wechatConfigFragment';
import GQL_WECHAT_AUDIT_FRAGMENT from './fragments/wechatAuditFragment';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

export const GQL_ON_WECHAT_PROGRAM_AUDIT_STATUS_UPDATE = gql`
  subscription OnWechatMiniProgramAuditStatusUpdate($projectExId: String!) {
    onWechatMiniProgramAuditStatusUpdate(projectExId: $projectExId) {
      ...WechatAuditFragment
    }
  }
  ${GQL_WECHAT_AUDIT_FRAGMENT}
`;

export const GQL_ON_WECHAT_CONFIG_UPDATE = gql`
  subscription OnWechatConfigUpdate($projectExId: String!) {
    onWechatConfigUpdate(projectExId: $projectExId) {
      ...WechatConfigFragment
    }
  }
  ${GQL_WECHAT_CONFIG_FRAGMENT}
`;

export const GQL_ADD_WECHAT_TESTER = gql`
  mutation BindTesterToWechatMiniProgram($projectExId: String!, $wechatId: String!) {
    bindTesterToWechatMiniProgram(projectExId: $projectExId, wechatId: $wechatId)
  }
`;

export const GQL_ADD_WEB_VIEW_DOMAIN = gql`
  mutation AddWechatWebViewDomain($projectExId: String!, $webViewDomainList: [String]) {
    addWechatWebViewDomain(projectExId: $projectExId, webViewDomainList: $webViewDomainList)
  }
`;

export const GQL_PUBLISH_WECHAT_PROGRAM = gql`
  mutation PublishWechatProgram($projectExId: String!) {
    publishSuccessfullyAuditedWechatMiniProgram(projectExId: $projectExId)
  }
`;

export function publishWechatProgram(client: ApolloClient<any>): void {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_PUBLISH_WECHAT_PROGRAM,
      variables: {
        projectExId: AllStores.projectStore.projectDetails?.projectExId,
      },
    })
    .then((isSuccess) => {
      if (isSuccess) notif.send('PROJECT_PUBLISH_SUCCESS');
      else notif.send('PROJECT_PUBLISH_FAILURE');
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
}
