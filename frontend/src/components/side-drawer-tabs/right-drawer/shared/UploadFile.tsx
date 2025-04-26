import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/client';
import { observer } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import useLocale from '../../../../hooks/useLocale';
import { useMediaUrl } from '../../../../hooks/useMediaUrl';
import useNotificationDisplay from '../../../../hooks/useNotificationDisplay';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import uploadFile, { FileType } from '../../../../utils/uploadUtils';
import { ZThemedColors } from '../../../../utils/ZConst';
import { Upload } from '../../../../zui';
import './UploadFile.css';
import i18n from './UploadFile.i18n.json';

export enum UploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  JSON = 'JSON',
  FILE = 'FILE',
}

export interface FileModel {
  id: number;
  exId: string;
  fileUrl: string;
}

interface Props {
  uploadType: UploadType;
  fileExId?: string;
  uploadFileResult: (result: FileModel) => void;
}

export const UploadFile = observer((props: Props): ReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const [loading, setLoading] = useState(false);
  const [fileExId, setFileExId] = useState<string>(props.fileExId ?? '');
  const client = useApolloClient();
  const displayNotification = useNotificationDisplay();
  const { projectExId } = useProjectDetails();
  const umu = useMediaUrl();
  const fileUrl = umu(fileExId, props.uploadType);

  const ACCEPTED_FILE_MIME = [
    FileType.PDF,
    FileType.DOC,
    FileType.DOCX,
    FileType.XLS,
    FileType.XLSX,
    FileType.PPT,
    FileType.PPTX,
  ];

  const ACCEPTED_FILE_EXT = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']; // for Chrome

  function beforeUpload(file: File) {
    switch (props.uploadType) {
      case UploadType.VIDEO: {
        const isVideo = file.type === FileType.MP4;
        if (!isVideo) {
          displayNotification('UPLOAD_FILE_UNSUPPORTED');
        }
        return isVideo;
      }
      case UploadType.IMAGE: {
        const isImage =
          file.type === FileType.JPEG ||
          file.type === FileType.PNG ||
          file.type === FileType.JPG ||
          file.type === FileType.GIF;
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isImage) displayNotification('UPLOAD_FILE_UNSUPPORTED');
        if (!isLt20M) displayNotification('UPLOAD_PICTURE_EXCEEDING_MAX_SIZE');
        return isImage && isLt20M;
      }
      case UploadType.JSON: {
        const isJSON = file.type === FileType.JSON;
        if (!isJSON) {
          displayNotification('UPLOAD_FILE_UNSUPPORTED');
        }
        return isJSON;
      }
      case UploadType.FILE: {
        const isFile =
          ACCEPTED_FILE_MIME.includes(file.type as FileType) ||
          ACCEPTED_FILE_EXT.includes(file.name.split('.').pop() ?? '');
        const isLt10M = file.size / 1024 / 1024 < 20;
        if (!isFile) displayNotification('UPLOAD_FILE_UNSUPPORTED');
        if (!isLt10M) displayNotification('UPLOAD_FILE_EXCEEDING_MAX_SIZE');
        return isFile && isLt10M;
      }
      default:
        displayNotification('UPLOAD_FILE_UNSUPPORTED');
        return false;
    }
  }

  function customRequest(options: any) {
    if (options.file) {
      setLoading(true);
      uploadFile(client, options.file, projectExId, props.uploadType).then((result) => {
        setLoading(false);
        if (result.exId) setFileExId(result.exId);
        if (result.downloadUrl) {
          props.uploadFileResult({
            id: result.id,
            exId: result.exId ?? '',
            fileUrl: result.downloadUrl,
          });
        }
      });
    }
  }

  function renderPreviewFileComponent() {
    return props.uploadType === UploadType.IMAGE ? (
      <img src={fileUrl} alt="" style={styles.image} />
    ) : (
      <div>{content.label.uploaded}</div>
    );
  }

  const acceptFileType = () => {
    switch (props.uploadType) {
      case UploadType.IMAGE:
        return 'image/*';
      case UploadType.VIDEO:
        return 'video/*';
      case UploadType.JSON:
        return '.json';
      case UploadType.FILE:
        return ACCEPTED_FILE_MIME.map((filetype) => filetype.valueOf())
          .concat(ACCEPTED_FILE_EXT.map((ext) => `.${ext}`)) // possibly chrome's bug
          .join();
      default:
        return '*/*';
    }
  };

  return (
    <>
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        multiple={false}
        accept={acceptFileType()}
      >
        {fileExId ? (
          renderPreviewFileComponent()
        ) : (
          <div style={styles.upload}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">{content.label.upload}</div>
          </div>
        )}
      </Upload>
    </>
  );
});

// used antd form
export const UploadFileInput: React.FC<{
  value?: string;
  onChange?: (result: FileModel) => void;
}> = (props) => {
  return (
    <UploadFile
      uploadType={UploadType.IMAGE}
      fileExId={props.value ?? ''}
      uploadFileResult={(result) => {
        if (props.onChange) {
          props.onChange(result);
        }
      }}
    />
  );
};

export const UploadFileIdInput: React.FC<{
  value?: string;
  onChange?: (result: string) => void;
}> = (props) => {
  return (
    <UploadFile
      uploadType={UploadType.IMAGE}
      fileExId={props.value}
      uploadFileResult={(result) => {
        if (props.onChange) {
          props.onChange(result.exId);
        }
      }}
    />
  );
};

const styles: Record<string, React.CSSProperties> = {
  image: {
    width: '100%',
    minHeight: '20px',
    maxHeight: '100%',
  },
  upload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: ZThemedColors.ACCENT,
  },
};
