/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import uploadFile from '../../../../utils/uploadUtils';
import './UploadTabBarIcon.css';
import i18n from './UploadFile.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { UploadType } from './UploadFile';
import { ZThemedColors } from '../../../../utils/ZConst';
import { Button, Upload } from '../../../../zui';

interface Props {
  onFileUploaded: (exId: string) => void;
}

export default function UploadTabBarIcon(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  const { projectExId } = useProjectDetails();
  if (!projectExId) return null;

  async function customRequest(options: any) {
    if (options.file) {
      setLoading(true);
      const result = await uploadFile(client, options.file, projectExId, UploadType.IMAGE);
      setLoading(false);
      props.onFileUploaded(result.exId ?? '');
    }
  }

  return (
    <>
      <Upload
        accept="image/png"
        showUploadList={false}
        customRequest={customRequest}
        multiple={false}
        className="upload-tabbar-icon"
      >
        <Button
          block
          icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
          style={styles.button}
        >
          {content.label.uploadFromLocal}
        </Button>
      </Upload>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    background: ZThemedColors.PRIMARY,
    color: ZThemedColors.ACCENT,
    border: '0px',
    borderRadius: '6px',
  },
};
