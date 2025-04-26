/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Empty.module.scss';
import { useConfig } from './ConfigProvider';

export interface EmptyProps {
  /** 自定义图片 */
  image?: ReactNode;
  /** 自定义图片样式 */
  imageStyle?: React.CSSProperties;
  /** 自定义描述内容 */
  description?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 底部内容 */
  children?: ReactNode;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 是否使用小号空状态 */
  small?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
}

// 默认的空状态图片
const DefaultEmptyImg = (): ReactElement => (
  <svg
    width="64"
    height="41"
    viewBox="0 0 64 41"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(0 1)" fill="none" fillRule="evenodd">
      <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
      <g fillRule="nonzero" stroke="#D9D9D9">
        <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
        <path
          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
          fill="#FAFAFA"
        />
      </g>
    </g>
  </svg>
);

// 简单的空状态图片
const SimpleEmptyImg = (): ReactElement => (
  <svg
    width="64"
    height="41"
    viewBox="0 0 64 41"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(0 1)" fill="none" fillRule="evenodd">
      <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7" />
      <g fillRule="nonzero" stroke="#D9D9D9">
        <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
        <path
          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
          fill="#FAFAFA"
        />
      </g>
    </g>
  </svg>
);

export const Empty = (props: EmptyProps): ReactElement => {
  const {
    image = <DefaultEmptyImg />,
    imageStyle,
    description = '暂无数据',
    className,
    style,
    children,
    prefixCls: customizePrefixCls,
    small = false,
    dark = false,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('empty', customizePrefixCls);

  // 根据尺寸和主题确定类名
  const classString = cx(
    styles.empty,
    {
      [styles.normal]: !small,
      [styles.small]: small,
      [styles.dark]: dark,
    },
    className
  );

  // 渲染图片
  const imageNode = typeof image === 'string' ? <img src={image} alt="empty" /> : image;

  return (
    <div className={classString} style={style}>
      <div className={styles.image} style={imageStyle}>
        {imageNode}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.footer}>{children}</div>}
    </div>
  );
};

// 导出预设图片
Empty.PRESENTED_IMAGE_DEFAULT = <DefaultEmptyImg />;
Empty.PRESENTED_IMAGE_SIMPLE = <SimpleEmptyImg />;

export default Empty;