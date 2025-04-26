/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';

const GQL_SUBMIT_TO_REVIEW = gql`
  mutation SubmitToReview($projectExId: String!, $schemaExId: String!) {
    submitTemplateToReview(projectExId: $projectExId, schemaExId: $schemaExId) {
      auditId
      errmsg
    }
  }
`;

export default GQL_SUBMIT_TO_REVIEW;

export function submitToReview(client: ApolloClient<any>): void {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  client
    .mutate({
      mutation: GQL_SUBMIT_TO_REVIEW,
      variables: {
        projectExId: AllStores.projectStore.projectDetails?.projectExId,
        schemaExId: AllStores.projectStore.projectDetails?.schemaExId,
      },
    })
    .then((rsp: any) => {
      const auditId = rsp?.data?.submitTemplateToReview?.auditId;
      if (!auditId) notif.send('PROJECT_SUBMIT_AUDIT_FAILURE');
      else notif.send('PROJECT_SUBMIT_AUDIT_SUCCESS');
    })
    .catch((e) => {
      window.console.error(e);
      notif.send(e.message);
    });
}
