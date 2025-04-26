/* eslint-disable import/no-default-export */
import React, { ReactElement, HTMLAttributes, useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './Row.module.scss';
import RowContext from './RowContext';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type BreakpointMap = Partial<Record<Breakpoint, boolean>>;

export type Gutter = number | Partial<Record<Breakpoint, number>>;
type Align = 'top' | 'middle' | 'bottom' | 'stretch';
type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  /** 栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24} */
  gutter?: Gutter | [Gutter, Gutter];
  /** flex 布局下的水平排列方式 */
  justify?: Justify;
  /** flex 布局下的垂直对齐方式 */
  align?: Align;
  /** 是否使用 flex 布局 */
  type?: 'flex';
  /** 子元素 */
  children?: React.ReactNode;
}

// 响应式断点
const responsiveMap: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

// 获取媒体查询的匹配状态
const getResponsiveMap = (): BreakpointMap => {
  const screens: BreakpointMap = {};

  if (typeof window !== 'undefined') {
    // xs: < 576px
    screens.xs = window.innerWidth < 576;
    // sm: >= 576px
    screens.sm = window.innerWidth >= 576;
    // md: >= 768px
    screens.md = window.innerWidth >= 768;
    // lg: >= 992px
    screens.lg = window.innerWidth >= 992;
    // xl: >= 1200px
    screens.xl = window.innerWidth >= 1200;
    // xxl: >= 1600px
    screens.xxl = window.innerWidth >= 1600;
  }

  return screens;
};

export const Row = (props: RowProps): ReactElement => {
  const {
    gutter = 0,
    type,
    justify,
    align,
    className,
    style,
    children,
    ...others
  } = props;

  const [screens, setScreens] = useState<BreakpointMap>(getResponsiveMap());

  // 监听窗口大小变化，更新响应式状态
  useEffect(() => {
    const handleResize = () => {
      setScreens(getResponsiveMap());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 计算 gutter
  const getGutter = (): number => {
    if (typeof gutter === 'object' && gutter !== null) {
      for (let i = 0; i < responsiveMap.length; i++) {
        const breakpoint: Breakpoint = responsiveMap[i];
        if (screens[breakpoint] && gutter[breakpoint] !== undefined) {
          return gutter[breakpoint] as number;
        }
      }
    }
    return gutter as number;
  };

  const gutterValue = getGutter();

  // 计算 style
  const rowStyle: React.CSSProperties = { ...style };
  if (gutterValue > 0) {
    rowStyle.marginLeft = gutterValue / -2;
    rowStyle.marginRight = gutterValue / -2;
  }

  // 计算 class
  const classes = cx(
    type === 'flex' ? styles.rowFlex : styles.row,
    {
      [styles.start]: type === 'flex' && justify === 'start',
      [styles.center]: type === 'flex' && justify === 'center',
      [styles.end]: type === 'flex' && justify === 'end',
      [styles.spaceBetween]: type === 'flex' && justify === 'space-between',
      [styles.spaceAround]: type === 'flex' && justify === 'space-around',
      [styles.top]: type === 'flex' && align === 'top',
      [styles.middle]: type === 'flex' && align === 'middle',
      [styles.bottom]: type === 'flex' && align === 'bottom',
      [styles.stretch]: type === 'flex' && align === 'stretch',
    },
    className
  );

  return (
    <RowContext.Provider value={{ gutter: gutterValue }}>
      <div {...others} className={classes} style={rowStyle}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

export default Row;