import { action, observable } from 'mobx';
import { UploadType } from '../../components/side-drawer-tabs/right-drawer/shared/UploadFile';
import {
  GQL_GET_IMAGE_BY_EX_ID,
  GQL_GET_FILE_BY_EX_ID,
  GQL_GET_VIDEO_BY_EX_ID,
} from '../../graphQL/getResourceMedia';
import { AllStores } from '../StoreContexts';

export class FileStore {
  @observable
  public fileRecord: Record<string, string> = {};

  @action
  public uploadFile(exId: string, uploadType: UploadType): void {
    if (!exId || exId.length <= 0) return;
    const { projectStore, sessionStore } = AllStores;
    const projectExId = projectStore.projectDetails?.projectExId;
    switch (uploadType) {
      case UploadType.IMAGE: {
        sessionStore.clientForSession
          .query({
            query: GQL_GET_IMAGE_BY_EX_ID,
            variables: { projectExId, imageExId: exId },
          })
          .then((response) => {
            this.fileRecord[exId] = response.data.getImageByExId.url;
          })
          .catch((error) => {
            window.console.log(error);
          });
        break;
      }
      case UploadType.VIDEO: {
        sessionStore.clientForSession
          .query({
            query: GQL_GET_VIDEO_BY_EX_ID,
            variables: { projectExId, videoExId: exId },
          })
          .then((response) => {
            this.fileRecord[exId] = response.data.getVideoByExId.url;
          })
          .catch((error) => {
            window.console.log(error);
          });
        break;
      }
      case UploadType.FILE:
      case UploadType.JSON: {
        sessionStore.clientForSession
          .query({
            query: GQL_GET_FILE_BY_EX_ID,
            variables: { projectExId, fileExId: exId },
          })
          .then((response) => {
            this.fileRecord[exId] = response.data.getFileByExId.url;
          })
          .catch((error) => {
            window.console.log(error);
          });
        break;
      }
      default:
        break;
    }
  }
}
