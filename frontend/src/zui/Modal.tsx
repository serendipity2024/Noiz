/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import styles from './Modal.module.scss';
import { useConfig } from './ConfigProvider';
import { Button } from './Button';

export type ModalSize = 'small' | 'normal' | 'large' | 'fullscreen';

export interface ModalProps {
  /** 对话框是否可见 */
  visible?: boolean;
  /** 标题 */
  title?: ReactNode;
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean;
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean;
  /** 是否显示蒙层 */
  mask?: boolean;
  /** 确认按钮文字 */
  okText?: ReactNode;
  /** 确认按钮类型 */
  okType?: 'primary' | 'default' | 'danger';
  /** 取消按钮文字 */
  cancelText?: ReactNode;
  /** 点击确定回调 */
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 点击遮罩层或右上角叉或取消按钮的回调 */
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 垂直居中展示 Modal */
  centered?: boolean;
  /** 宽度 */
  width?: string | number;
  /** 底部内容 */
  footer?: ReactNode;
  /** 确认按钮 loading */
  confirmLoading?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 对话框大小 */
  size?: ModalSize;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否支持键盘 esc 关闭 */
  keyboard?: boolean;
  /** 是否强制渲染 Modal */
  forceRender?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 对话框外层容器的类名 */
  wrapClassName?: string;
  /** 对话框外层容器的样式 */
  wrapStyle?: React.CSSProperties;
  /** 设置 Modal 的 z-index */
  zIndex?: number;
  /** 设置 Modal 的挂载点 */
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  /** 设置 Modal body 的样式 */
  bodyStyle?: React.CSSProperties;
  /** 设置 Modal header 的样式 */
  headerStyle?: React.CSSProperties;
  /** 设置 Modal footer 的样式 */
  footerStyle?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 销毁前的回调 */
  afterClose?: () => void;
}

export interface ModalFuncProps {
  /** 标题 */
  title?: ReactNode;
  /** 内容 */
  content?: ReactNode;
  /** 点击确定回调 */
  onOk?: (close: () => void) => void;
  /** 点击取消回调 */
  onCancel?: (close: () => void) => void;
  /** 确认按钮文字 */
  okText?: ReactNode;
  /** 确认按钮类型 */
  okType?: 'primary' | 'default' | 'danger';
  /** 取消按钮文字 */
  cancelText?: ReactNode;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 对话框大小 */
  size?: ModalSize;
  /** 垂直居中展示 Modal */
  centered?: boolean;
  /** 宽度 */
  width?: string | number;
  /** 是否支持键盘 esc 关闭 */
  keyboard?: boolean;
  /** 设置 Modal 的挂载点 */
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  /** 设置 Modal 的 z-index */
  zIndex?: number;
  /** 销毁前的回调 */
  afterClose?: () => void;
}

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
};

export interface ModalStaticFunctions {
  info: ModalFunc;
  success: ModalFunc;
  error: ModalFunc;
  warning: ModalFunc;
  confirm: ModalFunc;
}

export const Modal = (props: ModalProps): ReactElement => {
  const {
    visible = false,
    title,
    closable = true,
    maskClosable = true,
    mask = true,
    okText = '确定',
    okType = 'primary',
    cancelText = '取消',
    onOk,
    onCancel,
    centered = false,
    width,
    footer,
    confirmLoading = false,
    dark = false,
    size = 'normal',
    className,
    style,
    keyboard = true,
    forceRender = false,
    prefixCls: customizePrefixCls,
    wrapClassName,
    wrapStyle,
    zIndex,
    getContainer,
    bodyStyle,
    headerStyle,
    footerStyle,
    children,
    afterClose,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('modal', customizePrefixCls);

  // 内部状态
  const [animatedVisible, setAnimatedVisible] = useState<boolean>(visible);

  // 同步外部visible
  useEffect(() => {
    if (visible) {
      setAnimatedVisible(true);
    } else {
      const timer = setTimeout(() => {
        setAnimatedVisible(false);
        afterClose?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, afterClose]);

  // 处理确认
  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    onOk?.(e);
  };

  // 处理取消
  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel?.(e);
  };

  // 处理蒙层点击
  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable) {
      handleCancel(e);
    }
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyboard && e.key === 'Escape' && visible) {
        handleCancel(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboard, visible, handleCancel]);

  // 计算类名
  const modalClassName = cx(
    styles.modal,
    {
      [styles.centered]: centered,
      [styles.small]: size === 'small',
      [styles.normal]: size === 'normal',
      [styles.large]: size === 'large',
      [styles.fullscreen]: size === 'fullscreen',
      [styles.dark]: dark,
    },
    className
  );

  // 计算蒙层类名
  const maskClassName = cx(styles.mask, {
    [styles.maskHidden]: !mask,
  });

  // 计算内容类名
  const contentClassName = cx(styles.content);

  // 计算包装器类名
  const wrapperClassName = cx(styles.wrapper, wrapClassName);

  // 计算样式
  const modalStyle: React.CSSProperties = {
    ...style,
    zIndex,
  };

  // 计算内容样式
  const contentStyle: React.CSSProperties = {
    width,
  };

  // 渲染底部
  const renderFooter = () => {
    if (footer === null) {
      return null;
    }

    const defaultFooter = (
      <>
        <Button onClick={handleCancel}>{cancelText}</Button>
        <Button type={okType} loading={confirmLoading} onClick={handleOk}>
          {okText}
        </Button>
      </>
    );

    return <div className={styles.footer} style={footerStyle}>{footer || defaultFooter}</div>;
  };

  // 渲染对话框
  const renderModal = () => {
    if (!animatedVisible && !forceRender) {
      return null;
    }

    return (
      <div className={modalClassName} style={modalStyle}>
        {mask && <div className={maskClassName} onClick={handleMaskClick} />}
        <div className={wrapperClassName} style={wrapStyle}>
          <div className={contentClassName} style={contentStyle}>
            {closable && (
              <button className={styles.close} onClick={handleCancel}>
                <span className={styles.closeX}>×</span>
              </button>
            )}
            {title && (
              <div className={styles.header} style={headerStyle}>
                <div className={styles.title}>{title}</div>
              </div>
            )}
            <div className={styles.body} style={bodyStyle}>
              {children}
            </div>
            {renderFooter()}
          </div>
        </div>
      </div>
    );
  };

  // 渲染到容器
  if (typeof window !== 'undefined') {
    // 获取容器
    let container: HTMLElement | null = null;
    if (getContainer === false) {
      return renderModal();
    } else if (typeof getContainer === 'string') {
      container = document.querySelector(getContainer);
    } else if (typeof getContainer === 'function') {
      container = getContainer();
    } else if (getContainer instanceof HTMLElement) {
      container = getContainer;
    } else {
      container = document.body;
    }

    return ReactDOM.createPortal(renderModal(), container);
  }

  return null;
};

// 静态方法
const info: ModalFunc = (props) => {
  // 实现静态方法
  return {
    destroy: () => {},
    update: () => {},
  };
};

const success: ModalFunc = (props) => {
  // 实现静态方法
  return {
    destroy: () => {},
    update: () => {},
  };
};

const error: ModalFunc = (props) => {
  // 实现静态方法
  return {
    destroy: () => {},
    update: () => {},
  };
};

const warning: ModalFunc = (props) => {
  // 实现静态方法
  return {
    destroy: () => {},
    update: () => {},
  };
};

const confirm: ModalFunc = (props) => {
  // 实现静态方法
  return {
    destroy: () => {},
    update: () => {},
  };
};

// 添加静态方法
Modal.info = info;
Modal.success = success;
Modal.error = error;
Modal.warning = warning;
Modal.confirm = confirm;

export default Modal;