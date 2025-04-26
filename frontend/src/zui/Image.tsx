/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './Image.module.scss';
import { useConfig } from './ConfigProvider';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface ImagePreviewType {
  /** 是否可见 */
  visible?: boolean;
  /** 预览图片的最小缩放比例 */
  minScale?: number;
  /** 预览图片的最大缩放比例 */
  maxScale?: number;
  /** 预览图片的可见性变化回调 */
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
  /** 预览图片的遮罩 */
  mask?: ReactNode;
  /** 预览图片的遮罩类名 */
  maskClassName?: string;
  /** 预览图片的工具栏渲染函数 */
  toolbarRender?: (originalNode: ReactElement, info: { scale: number; rotate: number }) => ReactNode;
}

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
  /** 图片地址 */
  src?: string;
  /** 容器类名 */
  wrapperClassName?: string;
  /** 容器样式 */
  wrapperStyle?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 预览前缀 */
  previewPrefixCls?: string;
  /** 加载占位图像 */
  placeholder?: ReactNode;
  /** 加载失败容错地址 */
  fallback?: string;
  /** 根元素类名 */
  rootClassName?: string;
  /** 预览参数 */
  preview?: boolean | ImagePreviewType;
  /** 图片填充模式 */
  fit?: ImageFit;
  /** 点击图片的回调 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 图片加载失败的回调 */
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const Image = (props: ImageProps): ReactElement => {
  const {
    src,
    alt,
    wrapperClassName,
    wrapperStyle,
    prefixCls: customizePrefixCls,
    previewPrefixCls: customizePreviewPrefixCls,
    placeholder,
    fallback,
    width,
    height,
    style,
    preview = true,
    fit,
    className,
    onClick,
    onError,
    rootClassName,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const previewPrefixCls = getPrefixCls('image-preview', customizePreviewPrefixCls);

  // 图片加载状态
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 预览配置
  const previewConfig = typeof preview === 'object' ? preview : {};
  const {
    visible: previewVisible,
    onVisibleChange: onPreviewVisibleChange,
    minScale = 1,
    maxScale = 5,
    mask,
    maskClassName,
    toolbarRender,
  } = previewConfig;

  // 同步外部预览状态
  useEffect(() => {
    if (previewVisible !== undefined) {
      setShowPreview(previewVisible);
    }
  }, [previewVisible]);

  // 处理预览状态变化
  const handlePreviewVisibleChange = (visible: boolean) => {
    setShowPreview(visible);
    onPreviewVisibleChange?.(visible, showPreview);
  };

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 处理图片加载错误
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
    onError?.(e);
  };

  // 处理图片点击
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preview && !isError) {
      handlePreviewVisibleChange(true);
    }
    onClick?.(e);
  };

  // 处理预览关闭
  const handleClose = () => {
    handlePreviewVisibleChange(false);
  };

  // 图片类名
  const imgClassName = cx(
    styles.img,
    {
      [styles.imgPlaceholder]: placeholder === true,
      [styles.loading]: !isLoaded && !isError,
      [styles.contain]: fit === 'contain',
      [styles.cover]: fit === 'cover',
      [styles.fill]: fit === 'fill',
      [styles.none]: fit === 'none',
      [styles.scaleDown]: fit === 'scale-down',
    },
    className
  );

  // 容器类名
  const wrapperClass = cx(styles.image, wrapperClassName);

  // 渲染预览
  const renderPreview = () => {
    if (!showPreview) {
      return null;
    }

    return (
      <div className={styles.preview}>
        <img
          src={src}
          alt={alt}
          className={styles.previewImg}
        />
        <div className={styles.previewToolbar}>
          <div className={styles.previewToolbarItem} onClick={() => handleClose()}>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="zoom-out" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
            </svg>
          </div>
          <div className={styles.previewToolbarItem} onClick={() => handleClose()}>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="zoom-in" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path>
            </svg>
          </div>
          <div className={styles.previewToolbarItem} onClick={() => handleClose()}>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="rotate-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z"></path>
              <path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z"></path>
            </svg>
          </div>
          <div className={styles.previewToolbarItem} onClick={() => handleClose()}>
            <svg viewBox="64 64 896 896" focusable="false" data-icon="rotate-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z"></path>
              <path d="M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z"></path>
            </svg>
          </div>
        </div>
        <div className={styles.previewClose} onClick={handleClose}>
          <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </div>
      </div>
    );
  };

  // 渲染遮罩
  const renderMask = () => {
    if (!preview || isError) {
      return null;
    }

    const maskNode = mask || (
      <div className={styles.maskIcon}>
        <svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
        </svg>
      </div>
    );

    return (
      <div className={cx(styles.mask, maskClassName)}>
        {maskNode}
      </div>
    );
  };

  return (
    <>
      <div
        className={wrapperClass}
        onClick={handleClick}
        style={{
          ...wrapperStyle,
          width,
          height,
        }}
        {...rest}
      >
        <img
          className={imgClassName}
          alt={alt}
          style={{
            height,
            ...style,
          }}
          ref={imgRef}
          {...(isError && fallback
            ? {
                src: fallback,
              }
            : {
                onLoad: handleLoad,
                src,
                onError: handleError,
              })}
        />
        {!isLoaded && !isError && placeholder}
        {renderMask()}
      </div>
      {renderPreview()}
    </>
  );
};

export default Image;