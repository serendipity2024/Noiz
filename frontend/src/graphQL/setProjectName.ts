/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_SET_PROJECT_NAME = gql`
  mutation SetProjectName($projectExId: String!, $projectName: String!) {
    renameProject(projectExId: $projectExId, projectName: $projectName) {
      projectName
    }
  }
`;

export default GQL_SET_PROJECT_NAME;

export function setProjectName(
  client: ApolloClient<any>,
  projectName: string,
  projectExId: string,
  callback: () => void
): void {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_SET_PROJECT_NAME,
      variables: {
        projectName,
        projectExId,
      },
    })
    .then((rsp: any) => {
      const data = rsp?.data;
      const newProjectName = data.renameProject?.projectName;
      if (!data || !newProjectName) {
        notif.send('PROJECT_DETAILS_SAVE_FAILURE');
      } else {
        callback();
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      notif.send('PROJECT_DETAILS_SAVE_SUBMISSION_FAILURE');
    });
}
