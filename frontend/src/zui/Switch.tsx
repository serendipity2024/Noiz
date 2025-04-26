/* eslint-disable import/no-default-export */
import React, { ReactElement, ChangeEvent } from 'react';
import cx from 'classnames';
import styles from './Switch.module.scss';
import { useConfig } from './ConfigProvider';

export interface SwitchProps {
  /** 是否选中 */
  checked?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载中状态 */
  loading?: boolean;
  /** 变化时的回调函数 */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** 点击时的回调函数 */
  onClick?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 选中时的内容 */
  checkedChildren?: React.ReactNode;
  /** 非选中时的内容 */
  unCheckedChildren?: React.ReactNode;
  /** 开关大小 */
  size?: 'default' | 'small';
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 自动获取焦点 */
  autoFocus?: boolean;
  /** 设置 Switch 的 id */
  id?: string;
}

export interface SwitchChangeEventHandler {
  (checked: boolean, event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void;
}

export const Switch = (props: SwitchProps): ReactElement => {
  const {
    checked,
    defaultChecked = false,
    disabled = false,
    loading = false,
    onChange,
    onClick,
    className,
    style,
    checkedChildren,
    unCheckedChildren,
    size = 'default',
    dark = false,
    prefixCls: customizePrefixCls,
    autoFocus = false,
    id,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('switch', customizePrefixCls);

  // 内部状态
  const [innerChecked, setInnerChecked] = React.useState<boolean>(
    checked !== undefined ? checked : defaultChecked
  );

  // 同步外部checked
  React.useEffect(() => {
    if (checked !== undefined) {
      setInnerChecked(checked);
    }
  }, [checked]);

  // 处理变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) {
      return;
    }

    const newChecked = !innerChecked;
    if (checked === undefined) {
      setInnerChecked(newChecked);
    }

    onChange?.(newChecked, e);
  };

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      return;
    }

    const newChecked = !innerChecked;
    if (checked === undefined) {
      setInnerChecked(newChecked);
    }

    onClick?.(newChecked, e);
    onChange?.(newChecked, e as any);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      handleClick(e as any);
    }
  };

  // 计算类名
  const switchClassName = cx(
    styles.switch,
    {
      [styles.checked]: innerChecked,
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.small]: size === 'small',
      [styles.dark]: dark,
    },
    className
  );

  // 渲染加载图标
  const loadingIcon = loading ? (
    <div className={styles.loadingIcon}>
      <svg viewBox="0 0 1024 1024" focusable="false" className="anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
      </svg>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={innerChecked}
        disabled={disabled || loading}
        className={switchClassName}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        autoFocus={autoFocus}
        id={id}
      >
        <div className={styles.switchInner} data-checked={checkedChildren} data-unchecked={unCheckedChildren} />
        <div className={styles.switchHandle}>
          {loadingIcon}
        </div>
      </button>
      <input
        type="checkbox"
        checked={innerChecked}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
        id={id ? `${id}-input` : undefined}
      />
    </>
  );
};

export default Switch;