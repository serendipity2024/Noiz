/* eslint-disable import/no-default-export */
import { gql, ApolloClient } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_DEVELOPER_MODE_VERIFICATION = gql`
  query DeveloperModeVerification($password: String!) {
    verifyDeveloperPassword(password: $password)
  }
`;

export default GQL_DEVELOPER_MODE_VERIFICATION;

export const verifyDeveloperPassword = (
  client: ApolloClient<any>,
  password: string,
  callback: () => void
): void => {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .query({
      query: GQL_DEVELOPER_MODE_VERIFICATION,
      variables: { password },
    })
    .then(({ data }) => {
      const response = data?.verifyDeveloperPassword;
      if (!response) {
        notif.send('DEVELOPER_MODE_VERIFICATION_FAILURE');
        return;
      }

      callback();
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      notif.send('DEVELOPER_MODE_VERIFICATION_SUBMISSION_FAILURE');
    });
};
