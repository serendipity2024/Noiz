/* eslint-disable import/no-default-export */
import React, { ReactNode } from 'react';
import Notification from 'rc-notification';
import styles from './message.module.scss';
import { useConfig } from './ConfigProvider';

// 默认配置
let defaultDuration = 3; // 默认显示时间（秒）
let defaultTop: number; // 默认顶部距离
let messageInstance: any; // 消息实例
let key = 1; // 消息唯一标识
let prefixCls = 'z-message'; // 类名前缀
let transitionName = 'move-up'; // 过渡动画名称
let getContainer: () => HTMLElement; // 获取容器函数
let maxCount: number; // 最大显示数量
let dark = false; // 是否使用暗色主题

// 消息类型
export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

// 消息配置
export interface MessageOptions {
  /** 消息内容 */
  content: ReactNode;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 显示时长（秒），默认3秒，设为0则不自动关闭 */
  duration?: number;
  /** 消息类型 */
  type?: NoticeType;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 是否使用暗色主题 */
  dark?: boolean;
}

// 全局配置
export interface MessageConfig {
  /** 消息距离顶部的位置 */
  top?: number;
  /** 默认显示时长（秒） */
  duration?: number;
  /** 最大显示数量 */
  maxCount?: number;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 获取容器的函数 */
  getContainer?: () => HTMLElement;
  /** 过渡动画名称 */
  transitionName?: string;
  /** 是否使用暗色主题 */
  dark?: boolean;
}

// 消息返回类型
export type MessageType = {
  (): void;
};

// 判断是否为消息配置对象
const isArgsProps = (content: ReactNode | MessageOptions): content is MessageOptions =>
  Object.prototype.toString.call(content) === '[object Object]' &&
  !!(content as MessageOptions).content;

// 获取消息实例
const getMessageInstance = (callback: (instance: any) => void) => {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }

  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop },
      getContainer,
      maxCount,
      className: dark ? styles.dark : '',
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    }
  );
};

// 创建消息
const notice = (args: MessageOptions): MessageType => {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  const iconType = args.type || 'info';
  const target = args.key || key++;
  const closePromise = new Promise<boolean>((resolve) => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      resolve(true);
    };

    getMessageInstance((instance) => {
      // 创建图标
      const iconNode = (
        <span className={styles.icon}>
          {args.icon || (
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon={iconType}
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              {iconType === 'info' && (
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              )}
              {iconType === 'info' && (
                <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
              )}
              {iconType === 'success' && (
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
              )}
              {iconType === 'error' && (
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
              )}
              {iconType === 'warning' && (
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path>
              )}
              {iconType === 'loading' && (
                <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
              )}
            </svg>
          )}
        </span>
      );

      // 创建消息内容
      instance.notice({
        key: target,
        duration,
        style: args.style || {},
        className: args.className,
        content: (
          <div
            className={`${styles.customContent} ${
              args.type ? styles[args.type] : ''
            }`}
          >
            {iconNode}
            <span className={styles.content}>{args.content}</span>
          </div>
        ),
        onClose: callback,
      });
    });
  });

  // 返回关闭函数
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };

  result.then = (filled: any, rejected: any) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
};

// 消息API
type MessageApi = {
  open: (args: MessageOptions) => MessageType;
  config: (options: MessageConfig) => void;
  destroy: () => void;
  useMessage: () => [MessageApi, React.ReactElement];
} & Record<NoticeType, (content: ReactNode | MessageOptions, duration?: number, onClose?: () => void) => MessageType>;

const api: MessageApi = {
  open: notice,
  config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null;
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null;
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
    if (options.dark !== undefined) {
      dark = options.dark;
      messageInstance = null;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
  useMessage() {
    return [api, <></>];
  },
} as MessageApi;

// 添加不同类型的消息方法
['success', 'info', 'warning', 'error', 'loading'].forEach((type) => {
  api[type as NoticeType] = (
    content: ReactNode | MessageOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (isArgsProps(content)) {
      return api.open({ ...content, type: type as NoticeType });
    }
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    return api.open({
      content,
      duration,
      type: type as NoticeType,
      onClose,
    });
  };
});

// 添加警告方法别名
api.warn = api.warning;

// 消息组件
export const message = api;

export default message;