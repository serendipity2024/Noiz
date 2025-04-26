/* eslint-disable import/no-default-export */
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Button.module.scss';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'danger' | 'link' | 'text';
export type ButtonSize = 'large' | 'default' | 'small';
export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮类型 */
  type?: ButtonType;
  /** 按钮大小 */
  size?: ButtonSize;
  /** 按钮原生类型 */
  htmlType?: ButtonHTMLType;
  /** 按钮失效状态 */
  disabled?: boolean;
  /** 设置按钮载入状态 */
  loading?: boolean;
  /** 将按钮宽度调整为其父宽度的选项 */
  block?: boolean;
  /** 按钮图标 */
  icon?: ReactNode;
  /** 点击按钮时的回调 */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export const Button = (props: ButtonProps): React.ReactElement => {
  const {
    type = 'default',
    size = 'default',
    htmlType = 'button',
    disabled = false,
    loading = false,
    block = false,
    icon,
    onClick,
    children,
    className,
    style,
    ...rest
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const classes = cx(
    styles.button,
    {
      [styles.primary]: type === 'primary',
      [styles.default]: type === 'default',
      [styles.dashed]: type === 'dashed',
      [styles.danger]: type === 'danger',
      [styles.link]: type === 'link',
      [styles.text]: type === 'text',
      [styles.large]: size === 'large',
      [styles.small]: size === 'small',
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.block]: block,
    },
    className
  );

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      style={style}
      {...rest}
    >
      {loading && (
        <span className={styles.loadingIcon}>
          <svg viewBox="0 0 1024 1024" focusable="false" className="anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
          </svg>
        </span>
      )}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;