/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import { ExId } from '../shared/type-definition/ZTypes';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_DELETE_PROJECT = gql`
  mutation DeleteProject($projectExId: String!) {
    deleteProject(projectExId: $projectExId)
  }
`;

export default GQL_DELETE_PROJECT;

export const deleteProject = (
  client: ApolloClient<any>,
  projectExId: ExId,
  callback?: () => void
): void => {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_DELETE_PROJECT,
      variables: { projectExId },
    })
    .then(({ data }) => {
      const response = data?.deleteProject;
      if (!response) {
        notif.send('PROJECT_DELETION_FAILURE');
        return;
      }

      if (callback) callback();
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      notif.send('PROJECT_RESET_SUBMISSION_FAILURE');
    });
};
