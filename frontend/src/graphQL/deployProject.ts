/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import StoreHelpers from '../mobx/StoreHelpers';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';
import GQL_UPLOAD_SCHEMA from './uploadSchema';
import { BuildTarget } from './__generated__/globalTypes';

const GQL_DEPLOY_PROJECT = gql`
  mutation DeployProject(
    $projectExId: String!
    $schemaExId: String!
    $buildTarget: [BuildTarget!]!
  ) {
    deployProject(projectExId: $projectExId, schemaExId: $schemaExId, buildTarget: $buildTarget) {
      exId
    }
  }
`;

export const deployProject = (
  client: ApolloClient<any>,
  projectExId: string,
  callback: (projectExId: string | null) => void
): void => {
  const { locale } = AllStores.persistedStore;
  const {
    appConfiguration: { buildTarget },
  } = AllStores.coreStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_UPLOAD_SCHEMA,
      variables: {
        projectExId,
        appSchema: StoreHelpers.getCoreData(),
        platforms: buildTarget.map((value) => BuildTarget[value]),
      },
    })
    .then((rsp: any) => {
      const schemaExId = rsp?.data?.uploadSchema.exId;
      if (!schemaExId) notif.send('PROJECT_UPLOAD_FAILURE');
      AllStores.projectStore.updateProjectDetails({ schemaExId });

      client
        .mutate({
          mutation: GQL_DEPLOY_PROJECT,
          variables: { projectExId, schemaExId, buildTarget },
        })
        .then((res: any) => {
          const resProjectExId = res?.data?.deployProject.exId;
          if (!resProjectExId) {
            notif.send('PROJECT_DEPLOYMENT_FAILURE');
            return;
          }

          notif.send('PROJECT_DEPLOYMENT_STARTED');
          callback(resProjectExId);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          notif.send('PROJECT_DEPLOYMENT_SUBMISSION_FAILURE');
          callback(null);
        });
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      notif.send('PROJECT_UPLOAD_FAILURE');
      callback(null);
    });
};

export default GQL_DEPLOY_PROJECT;
