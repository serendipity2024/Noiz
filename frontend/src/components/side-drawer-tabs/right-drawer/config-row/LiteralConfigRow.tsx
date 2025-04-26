/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import i18n from './LiteralConfigRow.json';
import useLocale, { Locale } from '../../../../hooks/useLocale';
import { uploadImageBlob } from '../../../../utils/uploadUtils';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import { IMAGE_PRESIGNED_URL } from '../../../../graphQL/uploadFile';
import {
  ImagePresignedUrl,
  ImagePresignedUrlVariables,
} from '../../../../graphQL/__generated__/ImagePresignedUrl';
import { TinyMCEApiKey } from '../../../../utils/ZConst';
import { Select, Input, InputNumber } from '../../../../zui';
import styles from './LiteralConfigRow.module.scss';

interface Props {
  value: any;
  onChange: (value: any) => void;
  addRecord: (pair: [string, string]) => void;
}

enum EditType {
  INTEGER = 'integer',
  TEXT = 'text',
  RICHTEXT = 'richText',
}

export default observer(function LiteralConfigRow(props: Props) {
  const { value, onChange, addRecord } = props;
  const [editType, setEditType] = useState(EditType.TEXT);
  const { localizedContent: content, locale } = useLocale(i18n);
  const { projectExId } = useProjectDetails();
  const [uploadFile] = useMutation<ImagePresignedUrl, ImagePresignedUrlVariables>(
    IMAGE_PRESIGNED_URL
  );
  return (
    <div className={styles.container}>
      <Select value={editType} onChange={setEditType} className={styles.selectIcon}>
        {Object.values(EditType).map((type) => (
          <Select.Option key={type} value={type}>
            {content.type[type]}
          </Select.Option>
        ))}
      </Select>
      {editType === EditType.INTEGER && (
        <div>
          <InputNumber value={value} onChange={onChange} />
        </div>
      )}
      {editType === EditType.TEXT && (
        <Input.TextArea value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {editType === EditType.RICHTEXT && (
        <Editor
          apiKey={TinyMCEApiKey}
          value={value}
          onEditorChange={onChange}
          init={{
            language: locale === Locale.ZH ? 'zh_CN' : locale,
            language_url: '/zh_CN.js',
            plugins: 'image',
            images_upload_handler: (blobInfo, success, failure) => {
              uploadImageBlob(uploadFile, [blobInfo, success, failure], projectExId, addRecord);
            },
          }}
        />
      )}
    </div>
  );
});

export type TinyMCEUploadHandler = Parameters<
  NonNullable<NonNullable<IAllProps['init']>['images_upload_handler']>
>;
