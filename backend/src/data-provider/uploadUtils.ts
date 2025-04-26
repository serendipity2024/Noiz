/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ApolloClient, gql } from '@apollo/client';
import { last, valuesIn } from 'lodash';

const md5Base64 = require('md5-base64');
const { Buffer } = require('safe-buffer');

export enum ImageFileType {
  JPG = 'image/jpg',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
}

export enum VideoFileType {
  MOV = "video/mov",
  MP4 = 'video/mp4'
}

export enum FileType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export enum MediaFormat {
  CSS = "CSS",
  DOC = "DOC",
  DOCX = "DOCX",
  GIF = "GIF",
  HTML = "HTML",
  JPEG = "JPEG",
  JPG = "JPG",
  JSON = "JSON",
  MOV = "MOV",
  MP3 = "MP3",
  MP4 = "MP4",
  OTHER = "OTHER",
  PDF = "PDF",
  PNG = "PNG",
  PPT = "PPT",
  PPTX = "PPTX",
  TXT = "TXT",
  WAV = "WAV",
  XLS = "XLS",
  XLSX = "XLSX",
  XML = "XML",
}

export default async function uploadImage(
  client: ApolloClient<object>,
  file: File
) {
  try {
    const photoMd5Base64: string = await parseFile(file);
    if (photoMd5Base64.length <= 0) return '';

    let imageSuffix = 'JPG';
    if (file.type === ImageFileType.PNG) {
      imageSuffix = 'PNG';
    } else if (file.type === ImageFileType.JPG || file.type === ImageFileType.JPEG) {
      imageSuffix = 'JPG';
    } else if (file.type == ImageFileType.GIF) {
      imageSuffix = 'GIF';
    }
    const result = await client.mutate({
      mutation: gql`
      mutation ImagePresignedUrl($imgMd5Base64: String!, $imageSuffix: MediaFormat!) {
        imagePresignedUrl(imageSuffix: $imageSuffix, imgMd5Base64: $imgMd5Base64) {
          imageId
          downloadUrl
          uploadUrl
          contentType
        }
      }
    `,
      variables: {
        imgMd5Base64: photoMd5Base64,
        imageSuffix,
      },
    });
    const { imagePresignedUrl } = result.data;
    const imageResult = await fetch(imagePresignedUrl.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': imagePresignedUrl.contentType,
        'Content-MD5': photoMd5Base64,
      },
    });
    if (imageResult.status === 200) {
      return { downloadUrl: imagePresignedUrl.downloadUrl, id: imagePresignedUrl.imageId };
    } else {
      throw new Error('bad response code ' + JSON.stringify(imageResult));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadImages(
  client: ApolloClient<object>,
  files: File[]
) {
  try {
    const variables = await Promise.all(files.map(async file => {
      const photoMd5Base64: string = await parseFile(file);
      if (photoMd5Base64.length <= 0) return '';

      let imageSuffix = 'JPG';
      switch (file.type) {
        case ImageFileType.GIF:
          imageSuffix = 'GIF';
          break;
        case ImageFileType.JPEG:
        case ImageFileType.JPG:
          imageSuffix = 'JPG';
          break;
        case ImageFileType.PNG:
          imageSuffix = 'PNG';
          break;
      }

      return {
        imgMd5Base64: photoMd5Base64,
        imageSuffix
      }
    }));
    if (variables.find(variable => variable === '')) return '';
    const result = await client.mutate({
      mutation: gql`
      mutation ImageListPresignedUrls($inputs: [ImagePresignedInputInput]!) {
        presignedImageList(inputs: $inputs) {
          imageId
          downloadUrl
          uploadUrl
          contentType
        }
      }
      `, variables: { inputs: variables }
    });
    const { presignedImageList }: { presignedImageList: any[] } = result.data;
    presignedImageList.forEach(async (imagePresignedUrl: any, index: number) => {
      const imageResult = await fetch(imagePresignedUrl.uploadUrl, {
        method: 'PUT',
        body: files[index],
        headers: {
          'Content-Type': imagePresignedUrl.contentType,
          'Content-Md5': (variables[index] as { imgMd5Base64: string, imageSuffix: string }).imgMd5Base64
        }
      })
      if (imageResult.status !== 200) throw new Error('bad response code ' + JSON.stringify(imageResult));
      return imageResult.status === 200;
    });
    return presignedImageList.map((imagePresignedUrl: any) => ({
      'downloadUrl': imagePresignedUrl.downloadUrl,
      'id': imagePresignedUrl.imageId
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadVideo(
  client: ApolloClient<object>,
  file: File
) {
  try {
    const videoMd5Base64: string = await parseFile(file);
    if (videoMd5Base64.length <= 0) return '';

    let videoFormat;
    switch (file.type) {
      case VideoFileType.MOV:
        videoFormat = "MOV";
        break;
      case VideoFileType.MP4:
        videoFormat = "MP4";
        break;
      default:
        throw new Error(`Unsupported video type ${file.type}`);
    }

    const result = await client.mutate({
      mutation: gql`
      mutation VideoPresignedUrl($videoMd5Base64: String!, $videoFormat: MediaFormat!) {
        videoPresignedUrl(videoFormat: $videoFormat, videoMd5Base64: $videoMd5Base64) {
          videoId
          downloadUrl
          uploadUrl
          contentType
        }
      }
    `,
      variables: {
        videoMd5Base64: videoMd5Base64,
        videoFormat,
      },
    });
    const { videoPresignedUrl } = result.data;
    const videoResult = await fetch(videoPresignedUrl.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': videoPresignedUrl.contentType,
        'Content-MD5': videoMd5Base64,
      },
    });
    if (videoResult.status === 200) {
      return { downloadUrl: videoPresignedUrl.downloadUrl, id: videoPresignedUrl.videoId };
    } else {
      throw new Error('bad response code ' + JSON.stringify(videoResult));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadFile(
  client: ApolloClient<object>,
  file: File
) {
  try {
    const fileMd5Base64: string = await parseFile(file);
    if (fileMd5Base64.length <= 0) return '';

    const fileFormat =
      (Object.entries(FileType).find(([type, mime]) =>
        file.type ? file.type === mime : file.name.split('.').pop() === type.toLowerCase()
      )?.[0] as MediaFormat | undefined) ?? 'OTHER';

    const result = await client.mutate({
      mutation: gql`
      mutation FilePresignedUrl(
        $fileMd5Base64: String!,
        $fileFormat: MediaFormat!,
        $suffix: String,
        $name: String,
        $sizeBytes: Int
      ) {
        filePresignedUrl(format: $fileFormat, md5Base64: $fileMd5Base64, suffix: $suffix, name: $name, sizeBytes: $sizeBytes) {
          fileId
          downloadUrl
          uploadUrl
          contentType
        }
      }
    `,
      variables: {
        fileMd5Base64: fileMd5Base64,
        fileFormat: MediaFormat[fileFormat],
        suffix: last(file.name.split('.')),
        name: file.name,
        sizeBytes: file.size
      },
    });
    const { filePresignedUrl } = result.data;
    const fileResult = await fetch(filePresignedUrl.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': filePresignedUrl.contentType,
        'Content-MD5': fileMd5Base64,
      },
    });
    if (fileResult.status === 200) {
      return { downloadUrl: filePresignedUrl.downloadUrl, id: filePresignedUrl.fileId };
    } else {
      throw new Error('bad response code ' + JSON.stringify(fileResult));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const parseFile = (file: File): Promise<string> => {
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
