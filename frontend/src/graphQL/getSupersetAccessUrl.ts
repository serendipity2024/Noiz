/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import { ExId } from '../shared/type-definition/ZTypes';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_GET_SUPERSET_ACCESS_URL = gql`
  query GetSupersetAccessUrl($projectExId: String!) {
    supersetAccessUrl(projectExId: $projectExId)
  }
`;

export default GQL_GET_SUPERSET_ACCESS_URL;

export const getSupersetAccessUrl = (client: ApolloClient<any>, projectExId: ExId): void => {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);
  client
    .query({
      query: GQL_GET_SUPERSET_ACCESS_URL,
      variables: { projectExId },
    })
    .then((rsp: any) => {
      const url = rsp?.data?.supersetAccessUrl;
      if (url) window.open(url);
    })
    .catch(() => {
      notif.send('PROJECT_GET_SUPERSET_ACCESS_URL_FAILURE');
    });
};
