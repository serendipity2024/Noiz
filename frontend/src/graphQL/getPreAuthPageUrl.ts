/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import { ExId } from '../shared/type-definition/ZTypes';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_GET_WECHAT_AUTHORIZATION_PAGE_LINK = gql`
  query GetPreAuthPageUrl($projectExId: String!) {
    preAuthPageUrl(projectExId: $projectExId)
  }
`;

export default GQL_GET_WECHAT_AUTHORIZATION_PAGE_LINK;

export const getPreAuthPageUrl = (client: ApolloClient<any>, projectExId: ExId): void => {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);
  client
    .query({
      query: GQL_GET_WECHAT_AUTHORIZATION_PAGE_LINK,
      variables: { projectExId },
    })
    .then((rsp: any) => {
      const url = rsp?.data?.preAuthPageUrl;
      if (url) window.open(url);
    })
    .catch((e) => {
      window.console.error(e);
      notif.send('PROJECT_GET_PRE_AUTH_PATH_URL_FAILURE');
    });
};
