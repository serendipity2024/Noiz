/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import cx from 'classnames';
import styles from './Space.module.scss';
import { useConfig } from './ConfigProvider';

export type SizeType = 'small' | 'middle' | 'large' | number;
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
export type SpaceDirection = 'horizontal' | 'vertical';

export interface SpaceProps {
  /** 对齐方式 */
  align?: SpaceAlign;
  /** 间距方向 */
  direction?: SpaceDirection;
  /** 间距大小 */
  size?: SizeType | [SizeType, SizeType];
  /** 是否自动换行，仅在 horizontal 时有效 */
  wrap?: boolean;
  /** 分隔符 */
  split?: ReactNode;
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export const Space = (props: SpaceProps): ReactElement => {
  const {
    align,
    direction = 'horizontal',
    size = 'small',
    wrap = false,
    split,
    children,
    className,
    style,
    dark = false,
    prefixCls: customizePrefixCls,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('space', customizePrefixCls);

  // 计算间距大小
  const getSize = (size: SizeType): number => {
    if (typeof size === 'string') {
      return spaceSize[size] || 0;
    }
    return size || 0;
  };

  const [horizontalSize, verticalSize] = React.useMemo(() => {
    return Array.isArray(size) ? size.map(getSize) : [getSize(size), getSize(size)];
  }, [size]);

  // 计算样式
  const mergedStyle: CSSProperties = {
    ...style,
  };

  if (direction === 'horizontal') {
    mergedStyle.columnGap = horizontalSize;
    mergedStyle.rowGap = verticalSize;
  } else {
    mergedStyle.columnGap = verticalSize;
    mergedStyle.rowGap = horizontalSize;
  }

  // 计算类名
  const spaceClassName = cx(
    styles.space,
    {
      [styles.spaceVertical]: direction === 'vertical',
      [styles.spaceHorizontal]: direction === 'horizontal',
      [styles[`spaceAlign${align ? align.charAt(0).toUpperCase() + align.slice(1) : ''}`]]: align,
      [styles.spaceWrap]: wrap,
      [styles.spaceNoWrap]: !wrap,
      [styles.dark]: dark,
    },
    className
  );

  // 过滤空子元素
  const childNodes = React.Children.toArray(children).filter((child) => child !== null && child !== undefined);

  // 渲染子元素
  const nodes = childNodes.map((child, i) => {
    const key = (child as React.ReactElement)?.key || `space-item-${i}`;

    if (split && i > 0) {
      return (
        <React.Fragment key={key}>
          <div className={styles.spaceItemSplit}>{split}</div>
          <div className={styles.spaceItem}>{child}</div>
        </React.Fragment>
      );
    }

    return (
      <div key={key} className={styles.spaceItem}>
        {child}
      </div>
    );
  });

  return (
    <div className={spaceClassName} style={mergedStyle}>
      {nodes}
    </div>
  );
};

export default Space;