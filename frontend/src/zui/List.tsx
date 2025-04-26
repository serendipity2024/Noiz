/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode } from 'react';
import cx from 'classnames';
import styles from './List.module.scss';
import { useConfig } from './ConfigProvider';
import { Spin } from './Spin';
import { Empty } from './Empty';

export type ListSize = 'small' | 'default' | 'large';
export type ListItemLayout = 'horizontal' | 'vertical';
export type ListGridType = {
  gutter?: number;
  column?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
};

export interface ListProps<T = any> {
  /** 列表头部 */
  header?: ReactNode;
  /** 列表底部 */
  footer?: ReactNode;
  /** 列表数据源 */
  dataSource?: T[];
  /** 是否展示边框 */
  bordered?: boolean;
  /** 列表大小 */
  size?: ListSize;
  /** 是否展示分割线 */
  split?: boolean;
  /** 是否加载中 */
  loading?: boolean | { spinning: boolean; delay?: number };
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 对应的 `renderItem` 会作为 `children` 传递给 `List.Item` */
  renderItem?: (item: T, index: number) => ReactNode;
  /** 列表元素的 key 的获取方法 */
  rowKey?: ((item: T) => string) | string;
  /** 列表布局，支持水平和垂直 */
  itemLayout?: ListItemLayout;
  /** 列表栅格配置 */
  grid?: ListGridType;
  /** 列表分页配置 */
  pagination?: boolean | object;
  /** 空数据时的展示内容 */
  locale?: {
    emptyText: ReactNode;
  };
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 子元素 */
  children?: ReactNode;
}

export interface ListItemProps {
  /** 列表元素的额外内容，通常用在 itemLayout 为 horizontal 的情况下，展示右侧内容 */
  extra?: ReactNode;
  /** 列表元素的操作项 */
  actions?: ReactNode[];
  /** 列表元素的主要内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export interface ListItemMetaProps {
  /** 列表元素的图标 */
  avatar?: ReactNode;
  /** 列表元素的标题 */
  title?: ReactNode;
  /** 列表元素的描述内容 */
  description?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export const ListItemMeta = (props: ListItemMetaProps): ReactElement => {
  const { avatar, title, description, className, style } = props;

  const classString = cx(styles.itemMeta, className);

  return (
    <div className={classString} style={style}>
      {avatar && <div className={styles.itemMetaAvatar}>{avatar}</div>}
      {(title || description) && (
        <div className={styles.itemMetaContent}>
          {title && <h4 className={styles.itemMetaTitle}>{title}</h4>}
          {description && <div className={styles.itemMetaDescription}>{description}</div>}
        </div>
      )}
    </div>
  );
};

export const ListItem = (props: ListItemProps): ReactElement => {
  const { extra, actions, children, className, style } = props;

  const classString = cx(styles.item, className);

  // 渲染操作项
  const actionsNode = actions && actions.length > 0 && (
    <ul className={styles.itemAction}>
      {actions.map((action, index) => (
        <li key={`action-${index}`} className={styles.itemActionItem}>
          {action}
          {index !== actions.length - 1 && <em className={styles.itemActionItemDivider} />}
        </li>
      ))}
    </ul>
  );

  // 渲染主要内容
  const mainContent = (
    <div className={styles.itemMain}>
      {children}
      {actionsNode}
    </div>
  );

  // 渲染额外内容
  const extraContent = extra && <div className={styles.itemExtra}>{extra}</div>;

  return (
    <div className={classString} style={style}>
      {mainContent}
      {extraContent}
    </div>
  );
};

export const List = <T extends any>(props: ListProps<T>): ReactElement => {
  const {
    header,
    footer,
    dataSource = [],
    bordered = false,
    size = 'default',
    split = true,
    loading = false,
    dark = false,
    renderItem,
    rowKey,
    itemLayout = 'horizontal',
    grid,
    pagination,
    locale = { emptyText: '暂无数据' },
    className,
    style,
    prefixCls: customizePrefixCls,
    children,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('list', customizePrefixCls);

  // 计算类名
  const classString = cx(
    styles.list,
    {
      [styles.bordered]: bordered,
      [styles.split]: split,
      [styles.loading]: loading,
      [styles.small]: size === 'small',
      [styles.large]: size === 'large',
      [styles.vertical]: itemLayout === 'vertical',
      [styles.dark]: dark,
    },
    className
  );

  // 渲染加载状态
  const loadingProp = loading === true ? { spinning: true } : loading;
  const isLoading = loadingProp && loadingProp.spinning;

  // 渲染列表项
  const renderListItem = (item: T, index: number) => {
    if (renderItem) {
      const key = rowKey ? (typeof rowKey === 'function' ? rowKey(item) : item[rowKey]) : index;
      return <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>;
    }
    return null;
  };

  // 渲染列表内容
  const renderList = () => {
    // 如果没有数据源且没有子元素，显示空状态
    if (dataSource.length === 0 && !children) {
      return <div className={styles.empty}>{locale.emptyText || <Empty />}</div>;
    }

    // 如果有数据源，渲染数据源
    if (dataSource.length > 0) {
      return dataSource.map((item, index) => renderListItem(item, index));
    }

    // 如果有子元素，直接渲染子元素
    return children;
  };

  // 渲染列表
  const listContent = (
    <>
      {header && <div className={styles.header}>{header}</div>}
      <div className={cx({ [styles.loadingContent]: isLoading })}>
        {renderList()}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
      {pagination && <div className={styles.pagination}>{pagination}</div>}
    </>
  );

  return (
    <div className={classString} style={style}>
      {isLoading ? <Spin>{listContent}</Spin> : listContent}
    </div>
  );
};

List.Item = ListItem;
List.Item.Meta = ListItemMeta;

export default List;