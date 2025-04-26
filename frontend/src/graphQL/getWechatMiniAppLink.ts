/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_GET_WECHAT_MINI_APP_LINK = gql`
  query GetWechatMiniAppLink($projectExId: String!) {
    project(projectExId: $projectExId) {
      wechatMiniAppLink
    }
  }
`;

export default GQL_GET_WECHAT_MINI_APP_LINK;

export const getWechatMiniAppLink = (client: ApolloClient<any>): void => {
  const { locale } = AllStores.persistedStore;
  const projectExId = AllStores.projectStore.projectDetails?.projectExId;
  const notif = new ZNotification(i18n[locale]);
  client
    .query({
      query: GQL_GET_WECHAT_MINI_APP_LINK,
      variables: {
        projectExId,
      },
    })
    .then((rsp: any) => {
      const url = rsp.data.project;
      if (url) window.open(url.wechatMiniAppLink);
    })
    .catch(() => {
      notif.send('PROJECT_GET_PRE_AUTH_PATH_URL_FAILURE');
    });
};
