/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Badge.module.scss';

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';

export interface BadgeProps {
  /** 徽标的数字 */
  count?: ReactNode;
  /** 当数值为 0 时，是否展示徽标 */
  showZero?: boolean;
  /** 封顶的数字值 */
  overflowCount?: number;
  /** 不展示数字，只有一个小红点 */
  dot?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 设置状态点的颜色 */
  color?: string;
  /** 状态点 */
  status?: BadgeStatus;
  /** 状态点的文本 */
  text?: ReactNode;
  /** 设置状态点的位置偏移 */
  offset?: [number | string, number | string];
  /** 鼠标悬停时显示的文字 */
  title?: string;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: ReactNode;
}

export const Badge = (props: BadgeProps): ReactElement => {
  const {
    count,
    showZero = false,
    overflowCount = 99,
    dot = false,
    style,
    status,
    color,
    text,
    offset,
    title,
    className,
    children,
  } = props;

  // 计算显示的数字
  const getDisplayCount = () => {
    const displayCount =
      count > overflowCount ? `${overflowCount}+` : count;

    return displayCount;
  };

  // 是否隐藏徽标
  const isHidden = () => {
    const isEmpty = count === null || count === undefined || count === '';
    return (isEmpty || (count === 0 && !showZero)) && !dot;
  };

  // 渲染状态点
  const renderStatusBadge = () => {
    const statusCls = cx(styles.status, {
      [styles.success]: status === 'success',
      [styles.processing]: status === 'processing',
      [styles.default]: status === 'default',
      [styles.error]: status === 'error',
      [styles.warning]: status === 'warning',
    });

    const statusStyle: React.CSSProperties = {};
    if (color && !['success', 'processing', 'default', 'error', 'warning'].includes(color)) {
      statusStyle.backgroundColor = color;
    }

    return (
      <>
        <span className={statusCls} style={statusStyle} />
        {text && <span className={styles.statusText}>{text}</span>}
      </>
    );
  };

  // 渲染徽标
  const renderBadge = () => {
    // 如果只有状态点，没有子元素
    if (status && !children) {
      return renderStatusBadge();
    }

    // 计算徽标的样式
    const badgeStyle: React.CSSProperties = { ...style };
    if (offset) {
      const [offsetRight, offsetTop] = offset;
      badgeStyle.right = parseFloat(offsetRight as string);
      badgeStyle.marginTop = parseFloat(offsetTop as string);
    }

    // 渲染徽标内容
    const badgeContent = () => {
      if (isHidden()) {
        return null;
      }

      if (dot) {
        return <span className={styles.dot} style={badgeStyle} />;
      }

      return (
        <span className={styles.count} style={badgeStyle} title={title || `${count}`}>
          {getDisplayCount()}
        </span>
      );
    };

    return (
      <span className={cx(styles.badge, className)}>
        {children && <span className={styles.content}>{children}</span>}
        {badgeContent()}
      </span>
    );
  };

  return renderBadge();
};

export default Badge;