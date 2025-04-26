import { useInput, useLocale, useTranslate } from "ra-core";
import React, { useState } from "react";
import Switch from '@material-ui/core/Switch';
import { TextInput, Labeled } from 'react-admin';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { MediaFormat } from "../data-provider/uploadUtils";
import { gql, MutationTuple, useMutation } from "@apollo/client";

const md5Base64 = require('md5-base64');
const { Buffer } = require('safe-buffer');

const RichTextInput = (props: any) => {
  const {
    input: { name, onChange, value },
  } = useInput(props);

  const translate = useTranslate();
  const locale = useLocale();
  const [uploadFile] = useMutation(gql`
    mutation ImagePresignedUrl($imgMd5Base64: String!, $imageSuffix: MediaFormat!) {
        imagePresignedUrl(imageSuffix: $imageSuffix, imgMd5Base64: $imgMd5Base64) {
          imageId
          downloadUrl
          uploadUrl
          contentType
        }
      }
    `)

  const [isRichTextInput, setIsRichTextInput] = useState(false);

  return (<>
    {isRichTextInput ? <Labeled label={name}>
      <Editor apiKey="231zaahuc82s8ndgbhy6p4banb8wamroepb7cry6l68jzhpi"
      value={value} onEditorChange={onChange}
      init={{
        language: locale === 'zh' ? 'zh_CN' : locale,
        plugins: 'image',
        file_picker_types: 'image',
        images_upload_handler: (blobInfo, success, failure) => uploadImage(uploadFile, [blobInfo, success, failure])
      }}
    /></Labeled> : <TextInput {...props} />}
    <label>{translate('fz.input.richText.isRichText')}</label>
    <Switch checked={isRichTextInput} onChange={(event) => { setIsRichTextInput(event.target.checked) }}></Switch>
  </>);
}

export default RichTextInput;

async function uploadImage(
  uploadImage: MutationTuple<any, any>[0],
  uploadHandlerParameter: Parameters<NonNullable<NonNullable<IAllProps['init']>['images_upload_handler']>>,
) {
  const [blobInfo, success, failure] = uploadHandlerParameter;
  try {
    const photoMd5Base64: string = await parseFile(blobInfo.blob());
    if (photoMd5Base64.length <= 0) return '';

    let imageSuffix = '';
    if (blobInfo.filename().toUpperCase().endsWith(MediaFormat.PNG)) {
      imageSuffix = 'PNG';
    } else if (blobInfo.filename().toUpperCase().endsWith(MediaFormat.GIF)) {
      imageSuffix = 'GIF';
    } else if (blobInfo.filename().toUpperCase().endsWith(MediaFormat.JPEG) || blobInfo.filename().toUpperCase().endsWith(MediaFormat.JPG)){
      imageSuffix = 'JPG'
    } else {
      failure('Unsupported file format ' + blobInfo.filename());
    }
    const result = await uploadImage({
      variables: {
        imgMd5Base64: photoMd5Base64,
        imageSuffix,
      },
    });
    const { imagePresignedUrl } = result.data;
    const imageResult = await fetch(imagePresignedUrl.uploadUrl, {
      method: 'PUT',
      body: blobInfo.blob(),
      headers: {
        'Content-Type': imagePresignedUrl.contentType,
        'Content-MD5': photoMd5Base64,
      },
    });
    if (imageResult.status === 200) {
      success(imagePresignedUrl.downloadUrl);
    } else {
      failure('bad response code ' + JSON.stringify(imageResult));
    }
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
