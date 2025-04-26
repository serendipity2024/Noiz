/* eslint-disable import/no-default-export */
import React, { ReactNode } from 'react';
import Notification from 'rc-notification';
import styles from './notification.module.scss';
import { useConfig } from './ConfigProvider';
import { Button } from './Button';

// 默认配置
let defaultDuration = 4.5; // 默认显示时间（秒）
let defaultTop = 24; // 默认顶部距离
let defaultBottom = 24; // 默认底部距离
let defaultPlacement: NotificationPlacement = 'topRight'; // 默认弹出位置
let notificationInstance: Record<NotificationPlacement, any> = {} as any; // 通知实例
let key = 1; // 通知唯一标识
let prefixCls = 'z-notification'; // 类名前缀
let transitionName = 'move-right'; // 过渡动画名称
let getContainer: () => HTMLElement; // 获取容器函数
let maxCount: number; // 最大显示数量
let dark = false; // 是否使用暗色主题

// 通知类型
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

// 通知位置
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

// 通知配置
export interface NotificationOptions {
  /** 通知提醒标题 */
  message: ReactNode;
  /** 通知提醒内容 */
  description?: ReactNode;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 自定义按钮 */
  btn?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 显示时长（秒），默认4.5秒，设为0则不自动关闭 */
  duration?: number;
  /** 点击通知时触发的回调函数 */
  onClick?: () => void;
  /** 关闭时触发的回调函数 */
  onClose?: () => void;
  /** 通知类型 */
  type?: NotificationType;
  /** 弹出位置 */
  placement?: NotificationPlacement;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义关闭按钮 */
  closeIcon?: ReactNode;
  /** 通知唯一标识 */
  key?: string | number;
}

// 全局配置
export interface NotificationConfig {
  /** 弹出位置 */
  placement?: NotificationPlacement;
  /** 距离顶部的位置 */
  top?: number;
  /** 距离底部的位置 */
  bottom?: number;
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

// 获取通知实例
const getNotificationInstance = (
  args: NotificationOptions,
  callback: (instance: any) => void
) => {
  const { placement = defaultPlacement, dark: darkProp = dark } = args;
  const outerPrefixCls = prefixCls;

  const prefixClsIconNode = `${prefixCls}-notice-icon`;

  const iconNode = (
    <span className={`${prefixClsIconNode} ${styles.noticeIcon}`}>
      {args.icon || (
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon={args.type}
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          {args.type === 'success' && (
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
          )}
          {args.type === 'info' && (
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
          )}
          {args.type === 'warning' && (
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
          )}
          {args.type === 'error' && (
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
          )}
        </svg>
      )}
    </span>
  );

  // 获取通知位置样式
  const getPlacementStyle = (placement: NotificationPlacement) => {
    let style: React.CSSProperties;
    switch (placement) {
      case 'topLeft':
        style = {
          left: 0,
          top: defaultTop,
          bottom: 'auto',
        };
        break;
      case 'topRight':
        style = {
          right: 0,
          top: defaultTop,
          bottom: 'auto',
        };
        break;
      case 'bottomLeft':
        style = {
          left: 0,
          top: 'auto',
          bottom: defaultBottom,
        };
        break;
      default:
        style = {
          right: 0,
          top: 'auto',
          bottom: defaultBottom,
        };
        break;
    }
    return style;
  };

  // 获取过渡动画名称
  const getTransitionName = () => {
    switch (placement) {
      case 'topLeft':
        return 'slide-left';
      case 'topRight':
        return 'slide-right';
      case 'bottomLeft':
        return 'slide-left';
      default:
        return 'slide-right';
    }
  };

  // 如果已经存在实例，直接返回
  if (notificationInstance[placement]) {
    callback(notificationInstance[placement]);
    return;
  }

  // 创建新实例
  Notification.newInstance(
    {
      prefixCls: outerPrefixCls,
      className: `${styles.notification} ${styles[placement]} ${darkProp ? styles.dark : ''}`,
      style: getPlacementStyle(placement),
      getContainer,
      maxCount,
      transitionName: transitionName || getTransitionName(),
    },
    (instance: any) => {
      notificationInstance[placement] = instance;
      callback(instance);
    }
  );
};

// 创建通知
const notice = (args: NotificationOptions) => {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  const iconType = args.type || 'info';
  const target = args.key || key++;

  // 获取通知实例
  getNotificationInstance(args, (instance) => {
    // 创建通知内容
    instance.notice({
      key: target,
      duration,
      style: args.style || {},
      className: `${args.icon ? styles.noticeWithIcon : ''} ${args.className || ''}`,
      content: (
        <div>
          {args.icon && (
            <span
              className={`${styles.noticeIcon} ${
                styles[`noticeIcon${iconType.charAt(0).toUpperCase() + iconType.slice(1)}`]
              }`}
            >
              {args.icon}
            </span>
          )}
          <div className={styles.noticeMessage}>{args.message}</div>
          <div className={styles.noticeDescription}>{args.description}</div>
          {args.btn && <span className={styles.noticeBtn}>{args.btn}</span>}
        </div>
      ),
      onClose: args.onClose,
      onClick: args.onClick,
      closeIcon: args.closeIcon || (
        <span className={styles.noticeClose}>×</span>
      ),
    });
  });

  // 返回关闭函数
  return () => {
    if (notificationInstance[args.placement || defaultPlacement]) {
      notificationInstance[args.placement || defaultPlacement].removeNotice(target);
    }
  };
};

// 通知API
type NotificationApi = {
  open: (args: NotificationOptions) => () => void;
  close: (key: string | number) => void;
  config: (options: NotificationConfig) => void;
  destroy: () => void;
  useNotification: () => [NotificationApi, React.ReactElement];
} & Record<NotificationType, (args: NotificationOptions) => () => void>;

const api: NotificationApi = {
  open: notice,
  close(key) {
    Object.keys(notificationInstance).forEach((placement) => {
      notificationInstance[placement as NotificationPlacement]?.removeNotice(key);
    });
  },
  config(options) {
    if (options.placement !== undefined) {
      defaultPlacement = options.placement;
    }
    if (options.top !== undefined) {
      defaultTop = options.top;
    }
    if (options.bottom !== undefined) {
      defaultBottom = options.bottom;
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
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
    }
    if (options.dark !== undefined) {
      dark = options.dark;
    }
  },
  destroy() {
    Object.keys(notificationInstance).forEach((placement) => {
      notificationInstance[placement as NotificationPlacement]?.destroy();
      delete notificationInstance[placement as NotificationPlacement];
    });
  },
  useNotification() {
    return [api, <></>];
  },
} as NotificationApi;

// 添加不同类型的通知方法
['success', 'info', 'warning', 'error'].forEach((type) => {
  api[type as NotificationType] = (args: NotificationOptions) => {
    return api.open({
      ...args,
      type: type as NotificationType,
    });
  };
});

// 通知组件
export const notification = api;

export default notification;