/* eslint-disable import/no-default-export */
import React, { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import cx from 'classnames';
import styles from './Card.module.scss';

export type CardSize = 'default' | 'small';

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
  hoverable?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = (props) => {
  const { className, hoverable = true, ...others } = props;
  const classString = cx(styles.grid, className, {
    [styles.gridHoverable]: hoverable,
  });
  return <div {...others} className={classString} />;
};

export interface CardMetaProps {
  className?: string;
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  style?: CSSProperties;
}

export const CardMeta: React.FC<CardMetaProps> = (props) => {
  const { className, avatar, title, description, ...others } = props;
  const classString = cx(styles.meta, className);

  return (
    <div {...others} className={classString}>
      {avatar && <div className={styles.avatar}>{avatar}</div>}
      {(title || description) && (
        <div className={styles.metaDetail}>
          {title && <div className={styles.metaTitle}>{title}</div>}
          {description && <div className={styles.metaDescription}>{description}</div>}
        </div>
      )}
    </div>
  );
};

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 卡片标题 */
  title?: ReactNode;
  /** 卡片右上角的操作区域 */
  extra?: ReactNode;
  /** 卡片封面 */
  cover?: ReactNode;
  /** 卡片操作组，位置在卡片底部 */
  actions?: ReactNode[];
  /** 是否有边框 */
  bordered?: boolean;
  /** 卡片主体内容 */
  children?: ReactNode;
  /** 卡片容器类名 */
  className?: string;
  /** 当卡片内容还在加载中时，可以用 loading 展示一个占位 */
  loading?: boolean;
  /** 鼠标移过时可浮起 */
  hoverable?: boolean;
  /** 卡片头部样式 */
  headStyle?: CSSProperties;
  /** 卡片内容样式 */
  bodyStyle?: CSSProperties;
  /** 卡片尺寸 */
  size?: CardSize;
  /** 卡片容器样式 */
  style?: CSSProperties;
}

export const Card: React.FC<CardProps> = (props) => {
  const {
    className,
    extra,
    headStyle = {},
    bodyStyle = {},
    title,
    loading,
    bordered = true,
    size = 'default',
    cover,
    actions,
    hoverable,
    children,
    ...others
  } = props;

  const classString = cx(styles.card, className, {
    [styles.bordered]: bordered,
    [styles.hoverable]: hoverable,
    [styles.small]: size === 'small',
    [styles.loading]: loading,
  });

  const loadingBlock = (
    <div className={styles.loadingBlock}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingRow} style={{ width: '94%' }} />
        <div className={styles.loadingRow} style={{ width: '28%' }} />
        <div className={styles.loadingRow} style={{ width: '62%' }} />
        <div className={styles.loadingRow} style={{ width: '33%' }} />
        <div className={styles.loadingRow} style={{ width: '66%' }} />
        <div className={styles.loadingRow} style={{ width: '46%' }} />
        <div className={styles.loadingRow} style={{ width: '39%' }} />
        <div className={styles.loadingRow} style={{ width: '54%' }} />
      </div>
    </div>
  );

  const hasActiveTabKey = false;
  const head = title || extra ? (
    <div className={styles.head} style={headStyle}>
      {title && <div className={styles.title}>{title}</div>}
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  ) : null;

  const coverDom = cover ? <div className={styles.cover}>{cover}</div> : null;

  const body = (
    <div className={styles.body} style={bodyStyle}>
      {loading ? loadingBlock : children}
    </div>
  );

  const actionDom =
    actions && actions.length ? (
      <ul className={styles.actions}>
        {actions.map((action, index) => (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div {...others} className={classString}>
      {head}
      {coverDom}
      {body}
      {actionDom}
    </div>
  );
};

Card.Grid = CardGrid;
Card.Meta = CardMeta;

export default Card;