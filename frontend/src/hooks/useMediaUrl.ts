import { UploadType } from '../components/side-drawer-tabs/right-drawer/shared/UploadFile';
import useStores from './useStores';

export function useMediaUrl(): (exId: string, uploadType: UploadType) => string | undefined {
  const { fileStore } = useStores();

  return (exId: string, uploadType: UploadType): string | undefined => {
    const url = fileStore.fileRecord[exId];
    if (!url) {
      fileStore.uploadFile(exId, uploadType);
    }
    return url;
  };
}
