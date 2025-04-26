/* eslint-disable import/no-default-export */
import { ApolloClient, gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import ZNotification from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';
import { SetProjectDetails } from './__generated__/SetProjectDetails';

const GQL_SET_PROJECT_DETAILS = gql`
  mutation SetProjectDetails(
    $projectExId: String!
    $projectName: String!
    $wechatAppId: String!
    $wechatAppSecret: String!
  ) {
    renameProject(projectExId: $projectExId, projectName: $projectName) {
      projectName
    }
    setWechatAppSettings(
      projectExId: $projectExId
      wechatAppId: $wechatAppId
      wechatAppSecret: $wechatAppSecret
    ) {
      projectConfig {
        wechatAppConfig {
          wechatAppId
          wechatAppSecret
        }
      }
    }
  }
`;

export default GQL_SET_PROJECT_DETAILS;

export function setProjectDetails(
  client: ApolloClient<any>,
  projectName: string,
  projectExId: string,
  wechatAppId: string | null | undefined,
  wechatAppSecret: string | null | undefined,
  callback: () => void
): void {
  const { locale } = AllStores.persistedStore;
  const notif = new ZNotification(i18n[locale]);

  if (!wechatAppId || !wechatAppSecret) {
    notif.send('PROJECT_DETAILS_SAVE_FAILURE');
    return;
  }

  client
    .mutate({
      mutation: GQL_SET_PROJECT_DETAILS,
      variables: {
        projectName,
        projectExId,
        wechatAppId,
        wechatAppSecret,
      },
    })
    .then((rsp: any) => {
      const data = rsp?.data as SetProjectDetails;
      const newProjectName = data.renameProject?.projectName;
      const newWechatAppConfig = data.setWechatAppSettings?.projectConfig?.wechatAppConfig;
      if (!data || !newProjectName || !newWechatAppConfig) {
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
