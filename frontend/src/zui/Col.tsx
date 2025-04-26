/* eslint-disable import/no-default-export */
import React, { ReactElement, HTMLAttributes, useContext } from 'react';
import cx from 'classnames';
import styles from './Col.module.scss';
import RowContext from './RowContext';

type ColSpanType = number | string;

export interface ColSize {
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
}

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** 栅格占位格数，为 0 时相当于 display: none */
  span?: ColSpanType;
  /** 栅格顺序 */
  order?: ColSpanType;
  /** 栅格左侧的间隔格数，间隔内不可以有栅格 */
  offset?: ColSpanType;
  /** 栅格向右移动格数 */
  push?: ColSpanType;
  /** 栅格向左移动格数 */
  pull?: ColSpanType;
  /** <576px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  xs?: ColSpanType | ColSize;
  /** ≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  sm?: ColSpanType | ColSize;
  /** ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  md?: ColSpanType | ColSize;
  /** ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  lg?: ColSpanType | ColSize;
  /** ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  xl?: ColSpanType | ColSize;
  /** ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  xxl?: ColSpanType | ColSize;
  /** 子元素 */
  children?: React.ReactNode;
}

// 将 xs、sm、md、lg、xl、xxl 属性转换为对应的类名
const getSizeClassName = (
  size: ColSpanType | ColSize | undefined,
  prefix: string
): string[] => {
  if (size === undefined) {
    return [];
  }

  if (typeof size === 'number') {
    return [`${prefix}-${size}`];
  }

  if (typeof size === 'object') {
    const classes: string[] = [];
    const { span, order, offset, push, pull } = size;

    if (span !== undefined) {
      classes.push(`${prefix}-${span}`);
    }

    if (order !== undefined) {
      classes.push(`${prefix}-order-${order}`);
    }

    if (offset !== undefined) {
      classes.push(`${prefix}-offset-${offset}`);
    }

    if (push !== undefined) {
      classes.push(`${prefix}-push-${push}`);
    }

    if (pull !== undefined) {
      classes.push(`${prefix}-pull-${pull}`);
    }

    return classes;
  }

  return [`${prefix}-${size}`];
};

export const Col = (props: ColProps): ReactElement => {
  const {
    span,
    order,
    offset,
    push,
    pull,
    className,
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    ...others
  } = props;

  const { gutter } = useContext(RowContext);

  // 计算 style
  let style: React.CSSProperties = { ...props.style };
  if (gutter && gutter > 0) {
    style = {
      ...style,
      paddingLeft: gutter / 2,
      paddingRight: gutter / 2,
    };
  }

  // 计算 class
  const classes = cx(
    styles.col,
    {
      [styles[`span-${span}`]]: span !== undefined,
      [styles[`order-${order}`]]: order !== undefined,
      [styles[`offset-${offset}`]]: offset !== undefined,
      [styles[`push-${push}`]]: push !== undefined,
      [styles[`pull-${pull}`]]: pull !== undefined,
    },
    getSizeClassName(xs, styles.xs).map((cls) => styles[cls]),
    getSizeClassName(sm, styles.sm).map((cls) => styles[cls]),
    getSizeClassName(md, styles.md).map((cls) => styles[cls]),
    getSizeClassName(lg, styles.lg).map((cls) => styles[cls]),
    getSizeClassName(xl, styles.xl).map((cls) => styles[cls]),
    getSizeClassName(xxl, styles.xxl).map((cls) => styles[cls]),
    className
  );

  return (
    <div {...others} style={style} className={classes}>
      {children}
    </div>
  );
};

export default Col;