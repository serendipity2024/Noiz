/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './Upload.module.scss';
import { useConfig } from './ConfigProvider';
import { Progress } from './Progress';

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card';
export type UploadMethod = 'POST' | 'PUT' | 'PATCH';

export interface RcFile extends File {
  uid: string;
}

export interface UploadFile {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: RcFile;
  response?: any;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: XMLHttpRequest;
  preview?: string;
}

export interface UploadChangeParam<T extends object = UploadFile> {
  file: T;
  fileList: T[];
  event?: { percent: number };
}

export interface ShowUploadListInterface {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
  removeIcon?: ReactNode | ((file: UploadFile) => ReactNode);
  downloadIcon?: ReactNode | ((file: UploadFile) => ReactNode);
}

export interface UploadProps {
  /** 接受上传的文件类型 */
  accept?: string;
  /** 上传的地址 */
  action?: string;
  /** 上传请求的 http method */
  method?: UploadMethod;
  /** 上传所需额外参数或返回上传额外参数的方法 */
  data?: object | ((file: UploadFile) => object);
  /** 设置上传的请求头部 */
  headers?: object;
  /** 是否展示文件列表 */
  showUploadList?: boolean | ShowUploadListInterface;
  /** 是否支持多选文件 */
  multiple?: boolean;
  /** 默认已经上传的文件列表 */
  defaultFileList?: UploadFile[];
  /** 已经上传的文件列表 */
  fileList?: UploadFile[];
  /** 自定义上传列表项 */
  itemRender?: (originNode: ReactNode, file: UploadFile, fileList: UploadFile[]) => ReactNode;
  /** 上传列表的内建样式 */
  listType?: UploadListType;
  /** 点击文件链接或预览图标时的回调 */
  onPreview?: (file: UploadFile) => void;
  /** 点击下载文件时的回调 */
  onDownload?: (file: UploadFile) => void;
  /** 点击移除文件时的回调 */
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  /** 上传文件改变时的状态 */
  onChange?: (info: UploadChangeParam) => void;
  /** 上传文件之前的钩子 */
  beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<void | Blob | File>;
  /** 自定义上传行为 */
  customRequest?: (options: any) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否支持拖拽上传 */
  drag?: boolean;
  /** 拖拽区域的样式类名 */
  dragClassName?: string;
  /** 拖拽区域的样式 */
  dragStyle?: React.CSSProperties;
  /** 拖拽区域的文字 */
  dragText?: ReactNode;
  /** 拖拽区域的提示文字 */
  dragHint?: ReactNode;
  /** 拖拽区域的图标 */
  dragIcon?: ReactNode;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 上传按钮的属性 */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** 上传按钮的文字 */
  buttonText?: ReactNode;
  /** 上传按钮的图标 */
  buttonIcon?: ReactNode;
  /** 是否支持文件夹上传 */
  directory?: boolean;
  /** 是否开启点击上传区域时选择文件 */
  openFileDialogOnClick?: boolean;
  /** 上传请求时是否携带 cookie */
  withCredentials?: boolean;
  /** 上传组件类型 */
  type?: UploadType;
  /** 文件名称 */
  name?: string;
}

export interface DraggerProps extends UploadProps {
  height?: number;
}

export const Upload = (props: UploadProps): ReactElement => {
  const {
    accept,
    action,
    method = 'POST',
    data = {},
    headers = {},
    showUploadList = true,
    multiple = false,
    defaultFileList = [],
    fileList,
    itemRender,
    listType = 'text',
    onPreview,
    onDownload,
    onRemove,
    onChange,
    beforeUpload,
    customRequest,
    disabled = false,
    drag = false,
    dragClassName,
    dragStyle,
    dragText = '点击或拖拽文件到此区域上传',
    dragHint = '支持单个或批量上传',
    dragIcon,
    dark = false,
    className,
    style,
    children,
    prefixCls: customizePrefixCls,
    buttonProps,
    buttonText = '上传',
    buttonIcon,
    directory = false,
    openFileDialogOnClick = true,
    withCredentials = false,
    type = 'select',
    name = 'file',
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('upload', customizePrefixCls);

  // 内部状态
  const [innerFileList, setInnerFileList] = useState<UploadFile[]>(fileList || defaultFileList);
  const [dragState, setDragState] = useState<string>('drop');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 同步外部fileList
  useEffect(() => {
    if (fileList) {
      setInnerFileList(fileList);
    }
  }, [fileList]);

  // 处理文件上传
  const handleUpload = (files: FileList | null) => {
    if (!files) return;

    const fileList = Array.from(files);
    const uploadedFiles: UploadFile[] = fileList.map((file) => {
      const uid = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return {
        uid,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified),
        originFileObj: Object.assign(file, { uid }),
        status: 'uploading',
        percent: 0,
      };
    });

    // 处理beforeUpload
    if (beforeUpload) {
      const result = beforeUpload(uploadedFiles[0].originFileObj as RcFile, uploadedFiles.map((f) => f.originFileObj) as RcFile[]);
      if (result === false) return;

      if (result instanceof Promise) {
        result.then((processedFile) => {
          if (processedFile instanceof Blob || processedFile instanceof File) {
            const newFile = processedFile as File;
            const uid = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const uploadedFile: UploadFile = {
              uid,
              name: newFile.name || uploadedFiles[0].name,
              size: newFile.size,
              type: newFile.type,
              lastModified: newFile.lastModified,
              lastModifiedDate: new Date(newFile.lastModified),
              originFileObj: Object.assign(newFile, { uid }),
              status: 'uploading',
              percent: 0,
            };
            uploadFiles([uploadedFile]);
          } else {
            uploadFiles(uploadedFiles);
          }
        });
        return;
      }
    }

    uploadFiles(uploadedFiles);
  };

  // 上传文件
  const uploadFiles = (files: UploadFile[]) => {
    const newFileList = [...innerFileList, ...files];
    setInnerFileList(newFileList);
    onChange?.({ file: files[0], fileList: newFileList });

    files.forEach((file) => {
      if (customRequest) {
        customRequest({
          file: file.originFileObj,
          filename: name,
          data,
          headers,
          withCredentials,
          action,
          method,
          onProgress: (e: { percent: number }) => {
            updateFileList(file.uid, { percent: e.percent, status: 'uploading' });
          },
          onSuccess: (response: any, xhr: XMLHttpRequest) => {
            updateFileList(file.uid, { status: 'done', response, xhr });
          },
          onError: (error: any, response: any, xhr: XMLHttpRequest) => {
            updateFileList(file.uid, { status: 'error', error, response, xhr });
          },
        });
      } else {
        const formData = new FormData();
        formData.append(name, file.originFileObj as RcFile);

        if (data) {
          const dataObj = typeof data === 'function' ? data(file) : data;
          Object.keys(dataObj).forEach((key) => {
            formData.append(key, dataObj[key]);
          });
        }

        const xhr = new XMLHttpRequest();
        xhr.open(method, action || '', true);
        xhr.withCredentials = withCredentials;

        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });

        xhr.upload.onprogress = (e) => {
          if (e.total > 0) {
            const percent = Math.round((e.loaded / e.total) * 100);
            updateFileList(file.uid, { percent, status: 'uploading' });
          }
        };

        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            updateFileList(file.uid, { status: 'error', response: xhr.response, xhr });
          } else {
            updateFileList(file.uid, { status: 'done', response: xhr.response, xhr });
          }
        };

        xhr.onerror = () => {
          updateFileList(file.uid, { status: 'error', response: xhr.response, xhr });
        };

        xhr.send(formData);
        updateFileList(file.uid, { xhr });
      }
    });
  };

  // 更新文件列表
  const updateFileList = (uid: string, update: Partial<UploadFile>) => {
    const newFileList = innerFileList.map((file) => {
      if (file.uid === uid) {
        const newFile = { ...file, ...update };
        onChange?.({ file: newFile, fileList: [...innerFileList] });
        return newFile;
      }
      return file;
    });
    setInnerFileList(newFileList);
  };

  // 处理点击
  const handleClick = () => {
    if (disabled || !openFileDialogOnClick) return;
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleUpload(files);
    // 重置input，以便于同一个文件能够多次上传
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理拖拽进入
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('dragover');
  };

  // 处理拖拽离开
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('drop');
  };

  // 处理拖拽悬停
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('dragover');
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState('drop');
    handleUpload(e.dataTransfer.files);
  };

  // 处理预览
  const handlePreview = (file: UploadFile) => {
    onPreview?.(file);
  };

  // 处理下载
  const handleDownload = (file: UploadFile) => {
    onDownload?.(file);
  };

  // 处理删除
  const handleRemove = async (file: UploadFile) => {
    const onRemoveResult = onRemove?.(file);

    // 如果返回 false 或者 Promise.resolve(false)，不删除
    if (onRemoveResult === false) {
      return;
    }

    if (onRemoveResult && typeof onRemoveResult === 'object' && 'then' in onRemoveResult) {
      const resolveResult = await onRemoveResult;
      if (resolveResult === false) {
        return;
      }
    }

    const newFileList = innerFileList.filter((item) => item.uid !== file.uid);
    setInnerFileList(newFileList);
    onChange?.({ file: { ...file, status: 'removed' }, fileList: newFileList });
  };

  // 渲染上传列表
  const renderUploadList = () => {
    if (!showUploadList || innerFileList.length === 0) return null;

    const listClassName = cx(styles.uploadList, {
      [styles.uploadListPicture]: listType === 'picture',
      [styles.uploadListPictureCard]: listType === 'picture-card',
    });

    return (
      <div className={listClassName}>
        {innerFileList.map((file) => {
          const { uid, name, status, percent, url, thumbUrl } = file;
          const isImg = (file.type && file.type.indexOf('image/') === 0) || (thumbUrl !== undefined);

          const itemClassName = cx(styles.uploadListItem, {
            [styles.uploadListItemError]: status === 'error',
          });

          const icon = isImg ? (
            <div className={styles.uploadListItemThumbnail}>
              <img src={thumbUrl || url} alt={name} />
            </div>
          ) : null;

          const preview = (
            <a
              className={styles.uploadListItemName}
              onClick={() => handlePreview(file)}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
          );

          const actions = (
            <span className={styles.uploadListItemActions}>
              {showUploadList && typeof showUploadList === 'object' && showUploadList.showPreviewIcon && (
                <span
                  className={styles.uploadListItemAction}
                  onClick={() => handlePreview(file)}
                  title="预览文件"
                >
                  👁️
                </span>
              )}
              {showUploadList && typeof showUploadList === 'object' && showUploadList.showDownloadIcon && (
                <span
                  className={styles.uploadListItemAction}
                  onClick={() => handleDownload(file)}
                  title="下载文件"
                >
                  ⬇️
                </span>
              )}
              {showUploadList && (typeof showUploadList !== 'object' || showUploadList.showRemoveIcon !== false) && (
                <span
                  className={styles.uploadListItemAction}
                  onClick={() => handleRemove(file)}
                  title="删除文件"
                >
                  ❌
                </span>
              )}
            </span>
          );

          const progress =
            status === 'uploading' ? (
              <div className={styles.uploadListItemProgress}>
                <Progress percent={percent} size="small" />
              </div>
            ) : null;

          const itemNode = (
            <div className={itemClassName} key={uid}>
              <div className={styles.uploadListItemInfo}>
                {icon}
                {preview}
                {actions}
              </div>
              {progress}
            </div>
          );

          return itemRender ? itemRender(itemNode, file, innerFileList) : itemNode;
        })}
      </div>
    );
  };

  // 渲染上传按钮
  const renderUploadButton = () => {
    if (drag || type === 'drag') {
      const dragContainerClassName = cx(
        styles.uploadDrag,
        {
          [styles.uploadDragHover]: dragState === 'dragover',
          [styles.dark]: dark,
        },
        dragClassName
      );

      return (
        <div
          className={dragContainerClassName}
          style={dragStyle}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className={styles.uploadDragContainer}>
            {dragIcon && <div className={styles.uploadDragIcon}>{dragIcon}</div>}
            <p className={styles.uploadDragText}>{dragText}</p>
            <p className={styles.uploadDragHint}>{dragHint}</p>
          </div>
        </div>
      );
    }

    if (listType === 'picture-card') {
      return (
        <div className={styles.uploadPictureCard} onClick={handleClick}>
          {buttonIcon || <i>+</i>}
          <div className={styles.uploadText}>{buttonText}</div>
        </div>
      );
    }

    return (
      <button
        className={styles.uploadBtn}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        {...buttonProps}
      >
        {buttonIcon}
        {buttonText}
      </button>
    );
  };

  // 计算类名
  const uploadClassName = cx(
    styles.upload,
    {
      [styles.uploadSelect]: type === 'select',
      [styles.uploadDisabled]: disabled,
      [styles.dark]: dark,
    },
    className
  );

  return (
    <div className={uploadClassName} style={style}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        directory={directory ? '' : undefined}
        webkitdirectory={directory ? '' : undefined}
      />
      {children || renderUploadButton()}
      {renderUploadList()}
    </div>
  );
};

export const Dragger = (props: DraggerProps): ReactElement => {
  const { height, style, ...restProps } = props;
  const draggerStyle = { ...style, height };
  return <Upload {...restProps} type="drag" style={draggerStyle} />;
};

Upload.Dragger = Dragger;

export default Upload;