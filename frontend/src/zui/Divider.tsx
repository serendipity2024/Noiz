/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Divider.module.scss';
import { useConfig } from './ConfigProvider';

export interface DividerProps {
  /** 水平还是垂直类型 */
  type?: 'horizontal' | 'vertical';
  /** 分割线标题的位置 */
  orientation?: 'left' | 'right' | 'center';
  /** 是否虚线 */
  dashed?: boolean;
  /** 分割线内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export const Divider = (props: DividerProps): ReactElement => {
  const {
    type = 'horizontal',
    orientation = 'center',
    dashed = false,
    children,
    className,
    style,
    prefixCls: customizePrefixCls,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('divider', customizePrefixCls);

  // 根据方向和是否有文字，确定类名
  const orientationPrefix = orientation.length > 0 ? `-${orientation}` : orientation;
  const hasChildren = !!children;
  const classString = cx(
    styles.divider,
    {
      [styles.vertical]: type === 'vertical',
      [styles.horizontal]: type === 'horizontal',
      [styles.withText]: hasChildren && type === 'horizontal',
      [styles.withTextLeft]: hasChildren && type === 'horizontal' && orientation === 'left',
      [styles.withTextRight]: hasChildren && type === 'horizontal' && orientation === 'right',
      [styles.dashed]: !!dashed,
    },
    className
  );

  // 如果是垂直分割线，不能有内容
  if (type === 'vertical' && children) {
    console.warn('Warning: Divider with type "vertical" cannot have children.');
    return (
      <div className={cx(styles.divider, styles.vertical, className)} style={style} role="separator" />
    );
  }

  return (
    <div className={classString} style={style} role="separator">
      {children && <span className={styles.innerText}>{children}</span>}
    </div>
  );
};

export default Divider;