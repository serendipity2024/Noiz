/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ApolloClient, MutationTuple } from '@apollo/client';
import { last } from 'lodash';
import {
  FILE_PRESIGNED_URL,
  IMAGE_PRESIGNED_URL,
  VIDEO_PRESIGNED_URL,
} from '../graphQL/uploadFile';
import {
  ImagePresignedUrl,
  ImagePresignedUrlVariables,
} from '../graphQL/__generated__/ImagePresignedUrl';
import {
  VideoPresignedUrl,
  VideoPresignedUrlVariables,
} from '../graphQL/__generated__/VideoPresignedUrl';
import {
  FilePresignedUrl,
  FilePresignedUrlVariables,
} from '../graphQL/__generated__/FilePresignedUrl';
import { MediaFormat } from '../graphQL/__generated__/globalTypes';
import { UploadType } from '../components/side-drawer-tabs/right-drawer/shared/UploadFile';
import { TinyMCEUploadHandler } from '../components/side-drawer-tabs/right-drawer/config-row/LiteralConfigRow';

const md5Base64 = require('md5-base64');
const { Buffer } = require('safe-buffer');

export enum FileType {
  JPG = 'image/jpg',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  JSON = 'application/json',
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  MOV = 'video/mov',
  MP4 = 'video/mp4',
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
}

export default async function uploadFile(
  client: ApolloClient<any>,
  file: File,
  projectExId: string,
  uploadType: UploadType
) {
  try {
    const fileMd5Base64: string = await parseFile(file);
    if (fileMd5Base64.length <= 0) return {};

    const fileSuffix =
      (Object.entries(FileType).find(([type, mime]) =>
        file.type ? file.type === mime : file.name.split('.').pop() === type.toLowerCase()
      )?.[0] as MediaFormat | undefined) ?? 'OTHER';

    let presignedData;
    if (uploadType === UploadType.VIDEO) {
      const result = await client.mutate<VideoPresignedUrl, VideoPresignedUrlVariables>({
        mutation: VIDEO_PRESIGNED_URL,
        variables: {
          videoMd5Base64: fileMd5Base64,
          videoFormat: MediaFormat[fileSuffix],
          projectExId,
        },
      });
      presignedData = {
        uploadUrl: result.data?.videoPresignedUrl?.uploadUrl,
        downloadUrl: result.data?.videoPresignedUrl?.downloadUrl,
        contentType: result.data?.videoPresignedUrl?.contentType,
        exId: result.data?.videoPresignedUrl?.videoExId,
        id: result.data?.videoPresignedUrl?.videoId as number,
      };
    } else if (uploadType === UploadType.IMAGE) {
      const result = await client.mutate<ImagePresignedUrl, ImagePresignedUrlVariables>({
        mutation: IMAGE_PRESIGNED_URL,
        variables: {
          imgMd5Base64: fileMd5Base64,
          imageSuffix: MediaFormat[fileSuffix],
          projectExId,
        },
      });
      presignedData = {
        uploadUrl: result.data?.imagePresignedUrl?.uploadUrl,
        downloadUrl: result.data?.imagePresignedUrl?.downloadUrl,
        contentType: result.data?.imagePresignedUrl?.contentType,
        exId: result.data?.imagePresignedUrl?.imageExId,
        id: result.data?.imagePresignedUrl?.imageId as number,
      };
    } else {
      const result = await client.mutate<FilePresignedUrl, FilePresignedUrlVariables>({
        mutation: FILE_PRESIGNED_URL,
        variables: {
          fileMd5Base64,
          fileFormat: MediaFormat[fileSuffix],
          projectExId,
          suffix: fileSuffix === 'OTHER' ? last(file.name.split('.')) : undefined,
        },
      });
      presignedData = {
        uploadUrl: result.data?.filePresignedUrl?.uploadUrl,
        downloadUrl: result.data?.filePresignedUrl?.downloadUrl,
        contentType: result.data?.filePresignedUrl?.contentType,
        exId: result.data?.filePresignedUrl?.fileExId,
        id: result.data?.filePresignedUrl?.fileId as number,
      };
    }
    if (!presignedData.uploadUrl || !presignedData.contentType) return {};
    const mediaResult = await fetch(presignedData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': presignedData.contentType,
        'Content-MD5': fileMd5Base64,
      },
    });
    return mediaResult.status === 200 ? presignedData : {};
  } catch (error) {
    return {};
  }
}

export async function uploadImageBlob(
  upload: MutationTuple<ImagePresignedUrl, ImagePresignedUrlVariables>[0],
  tinymceUploadHandler: TinyMCEUploadHandler,
  projectExId: string,
  addRecord: (pair: [string, string]) => void
): Promise<void> {
  const [blobInfo, success, failure] = tinymceUploadHandler;
  try {
    const fileMd5Base64: string = await parseFile(blobInfo.blob());
    if (fileMd5Base64.length <= 0) {
      failure('file length < 0');
      return;
    }
    if (
      !Object.values(MediaFormat).includes(
        (last(blobInfo.filename().split('.')) ?? '').toUpperCase() as MediaFormat
      )
    ) {
      failure('invalid suffix');
      return;
    }

    const result = await upload({
      variables: {
        imgMd5Base64: fileMd5Base64,
        imageSuffix: (last(blobInfo.filename().split('.')) ?? '').toUpperCase() as MediaFormat,
        projectExId,
      },
    });
    const presignedData = {
      uploadUrl: result.data?.imagePresignedUrl?.uploadUrl,
      downloadUrl: result.data?.imagePresignedUrl?.downloadUrl,
      contentType: result.data?.imagePresignedUrl?.contentType,
      exId: result.data?.imagePresignedUrl?.imageExId as string,
      id: result.data?.imagePresignedUrl?.imageId as number,
    };
    if (!presignedData.uploadUrl || !presignedData.contentType) {
      failure('upload failure');
      return;
    }
    const mediaResult = await fetch(presignedData.uploadUrl, {
      method: 'PUT',
      body: blobInfo.blob(),
      headers: {
        'Content-Type': presignedData.contentType,
        'Content-MD5': fileMd5Base64,
      },
    });
    if (mediaResult.status === 200 && presignedData.downloadUrl) {
      addRecord([presignedData.downloadUrl, presignedData.exId]);
      success(presignedData.downloadUrl);
    } else failure('');
  } catch (error) {
    failure(error);
  }
}

const parseFile = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      if (e?.target?.result) {
        const buf = Buffer.from(e?.target?.result);
        const hash: string = md5Base64(buf);
        resolve(hash);
      } else {
        reject('');
      }
    };
    reader.onerror = () => {
      reject('');
    };
    reader.readAsArrayBuffer(file);
  });
};
