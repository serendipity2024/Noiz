/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_UPLOAD_SCHEMA = gql`
  mutation UploadSchema($projectExId: String!, $appSchema: Json!) {
    uploadSchema(projectExId: $projectExId, appSchema: $appSchema) {
      exId
      projectExId
    }
  }
`;

export default GQL_UPLOAD_SCHEMA;

export function saveProject(
  client: ApolloClient<any>,
  callback: (schemaExId: string | null) => void
): void {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_UPLOAD_SCHEMA,
      variables: {
        projectExId: AllStores.projectStore.projectDetails?.projectExId,
        appSchema: AllStores.coreStore,
      },
    })
    .then((rsp: any) => {
      const schemaExId = rsp?.data?.uploadSchema.exId;
      if (!schemaExId || schemaExId.length < 1) notif.send('PROJECT_SAVE_FAILURE');

      callback(schemaExId);
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      callback(null);
    });
}
