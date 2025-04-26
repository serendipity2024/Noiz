/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './Spin.module.scss';
import { useConfig } from './ConfigProvider';

export type SpinSize = 'small' | 'default' | 'large';

export interface SpinProps {
  /** 是否为加载中状态 */
  spinning?: boolean;
  /** 延迟显示加载效果的时间（防止闪烁） */
  delay?: number;
  /** 自定义描述文案 */
  tip?: ReactNode;
  /** 组件大小 */
  size?: SpinSize;
  /** 包装器的类名 */
  wrapperClassName?: string;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义指示符 */
  indicator?: ReactNode;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 子元素 */
  children?: ReactNode;
}

export const Spin = (props: SpinProps): ReactElement => {
  const {
    spinning = true,
    delay = 0,
    tip,
    size = 'default',
    wrapperClassName,
    dark = false,
    className,
    style,
    indicator,
    prefixCls: customizePrefixCls,
    children,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('spin', customizePrefixCls);

  // 延迟显示加载状态
  const [shouldBeVisible, setShouldBeVisible] = useState(spinning && !delay);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (spinning) {
      if (delay) {
        timeout = setTimeout(() => {
          setShouldBeVisible(true);
        }, delay);
      } else {
        setShouldBeVisible(true);
      }
    } else {
      setShouldBeVisible(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [spinning, delay]);

  // 默认指示符
  const defaultIndicator = (
    <span className={styles.spinner}>
      <i className={styles.dot} />
      <i className={styles.dot} />
      <i className={styles.dot} />
      <i className={styles.dot} />
    </span>
  );

  // 渲染指示符
  const spinIndicator = indicator || defaultIndicator;

  // 计算类名
  const spinClassName = cx(
    styles.spin,
    {
      [styles.spinning]: shouldBeVisible,
      [styles.small]: size === 'small',
      [styles.large]: size === 'large',
      [styles.dark]: dark,
    },
    className
  );

  // 如果没有子元素，直接渲染加载指示符
  if (!children) {
    return (
      <div className={spinClassName} style={style}>
        <div className={styles.spinnerContainer}>
          {spinIndicator}
          {tip && <div className={styles.text}>{tip}</div>}
        </div>
      </div>
    );
  }

  // 如果有子元素，渲染带有容器的加载指示符
  const containerClassName = cx(styles.container, wrapperClassName);
  const contentClassName = cx({
    [styles.blur]: shouldBeVisible,
  });

  return (
    <div className={containerClassName}>
      {shouldBeVisible && (
        <div className={styles.spinnerContainer}>
          {spinIndicator}
          {tip && <div className={styles.text}>{tip}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default Spin;
