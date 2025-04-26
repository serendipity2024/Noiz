/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './ZInput.module.scss';
import { useConfig } from './ConfigProvider';

export type SizeType = 'small' | 'default' | 'large';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'onChange'> {
  /** 带标签的 input，设置前置标签 */
  addonBefore?: ReactNode;
  /** 带标签的 input，设置后置标签 */
  addonAfter?: ReactNode;
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 输入框默认内容 */
  defaultValue?: string;
  /** 是否禁用状态 */
  disabled?: boolean;
  /** 输入框内容为空时，是否展示清除按钮 */
  allowClear?: boolean;
  /** 输入框的 id */
  id?: string;
  /** 最大长度 */
  maxLength?: number;
  /** 带有前缀图标的 input */
  prefix?: ReactNode;
  /** 带有后缀图标的 input */
  suffix?: ReactNode;
  /** 输入框大小 */
  size?: SizeType;
  /** 输入框类型 */
  type?: string;
  /** 输入框内容 */
  value?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 输入框状态改变时的回调 */
  onChange?: (value: string) => void;
  /** 按下回车的回调 */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 输入框默认内容 */
  defaultValue?: string;
  /** 是否禁用状态 */
  disabled?: boolean;
  /** 输入框的 id */
  id?: string;
  /** 最大长度 */
  maxLength?: number;
  /** 输入框内容 */
  value?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 自适应内容高度 */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** 输入框状态改变时的回调 */
  onChange?: (value: string) => void;
  /** 按下回车的回调 */
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export interface SearchProps extends InputProps {
  /** 点击搜索图标、清除图标，或按下回车键时的回调 */
  onSearch?: (value: string, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  /** 搜索框默认值 */
  defaultValue?: string;
  /** 搜索框的值 */
  value?: string;
  /** 是否加载中 */
  loading?: boolean;
  /** 搜索框内容变化时的回调 */
  onChange?: (value: string) => void;
}

export interface PasswordProps extends InputProps {
  /** 是否显示切换按钮 */
  visibilityToggle?: boolean;
  /** 初始是否显示密码 */
  defaultVisible?: boolean;
  /** 当前是否显示密码 */
  visible?: boolean;
  /** 切换密码可见状态的回调 */
  onVisibleChange?: (visible: boolean) => void;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | null;
}

export interface TextAreaRef {
  focus: () => void;
  blur: () => void;
  textarea: HTMLTextAreaElement | null;
}

export const Input = React.forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    addonBefore,
    addonAfter,
    bordered = true,
    dark = false,
    defaultValue,
    disabled = false,
    allowClear = false,
    id,
    maxLength,
    prefix,
    suffix,
    size = 'default',
    type = 'text',
    value,
    placeholder,
    onChange,
    onPressEnter,
    className,
    style,
    prefixCls: customizePrefixCls,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('input', customizePrefixCls);

  // 内部状态
  const [innerValue, setInnerValue] = useState<string>(value !== undefined ? value : defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  // 暴露方法
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    input: inputRef.current,
  }));

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    if (value === undefined) {
      setInnerValue(newValue);
    }
    onChange?.(newValue);
  };

  // 处理回车按下
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPressEnter) {
      onPressEnter(e);
    }
    rest.onKeyDown?.(e);
  };

  // 处理清除
  const handleClear = () => {
    if (disabled) return;

    if (value === undefined) {
      setInnerValue('');
    }
    onChange?.('');
    inputRef.current?.focus();
  };

  // 渲染清除按钮
  const renderClearIcon = () => {
    if (!allowClear || disabled || innerValue === '') return null;

    return (
      <span className={styles.inputClear} onClick={handleClear}>
        ✕
      </span>
    );
  };

  // 渲染前缀
  const renderPrefix = () => {
    if (!prefix) return null;

    return <span className={styles.inputPrefix}>{prefix}</span>;
  };

  // 渲染后缀
  const renderSuffix = () => {
    if (!suffix && !renderClearIcon()) return null;

    return (
      <span className={styles.inputSuffix}>
        {renderClearIcon()}
        {suffix}
      </span>
    );
  };

  // 渲染输入框
  const renderInput = () => {
    const inputClassName = cx(styles.inputControl, {
      [styles.inputControlDisabled]: disabled,
      [styles.inputLarge]: size === 'large',
      [styles.inputSmall]: size === 'small',
      [styles.inputWithAddonBefore]: addonBefore,
      [styles.inputWithAddonAfter]: addonAfter,
    });

    // 如果有前缀或后缀
    if (prefix || suffix || renderClearIcon()) {
      return (
        <span className={styles.inputAffix}>
          {renderPrefix()}
          <input
            ref={inputRef}
            type={type}
            className={inputClassName}
            value={innerValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            id={id}
            onKeyDown={handleKeyDown}
            {...rest}
          />
          {renderSuffix()}
        </span>
      );
    }

    // 如果没有前缀或后缀
    return (
      <input
        ref={inputRef}
        type={type}
        className={inputClassName}
        value={innerValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        id={id}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  };

  // 渲染带标签的输入框
  const renderWithAddon = () => {
    if (!addonBefore && !addonAfter) {
      return renderInput();
    }

    return (
      <span className={styles.inputGroup}>
        {addonBefore && (
          <span className={cx(styles.inputGroupAddon, styles.inputGroupAddonBefore)}>
            {addonBefore}
          </span>
        )}
        {renderInput()}
        {addonAfter && (
          <span className={cx(styles.inputGroupAddon, styles.inputGroupAddonAfter)}>
            {addonAfter}
          </span>
        )}
      </span>
    );
  };

  // 计算类名
  const inputWrapperClassName = cx(
    styles.input,
    {
      [styles.dark]: dark,
    },
    className
  );

  return (
    <div className={inputWrapperClassName} style={style}>
      <div className={styles.inputWrapper}>
        {renderWithAddon()}
      </div>
    </div>
  );
});

export const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const {
    bordered = true,
    dark = false,
    defaultValue,
    disabled = false,
    id,
    maxLength,
    value,
    placeholder,
    autoSize,
    onChange,
    onPressEnter,
    className,
    style,
    prefixCls: customizePrefixCls,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('textarea', customizePrefixCls);

  // 内部状态
  const [innerValue, setInnerValue] = useState<string>(value !== undefined ? value : defaultValue || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  // 暴露方法
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    },
    blur: () => {
      textareaRef.current?.blur();
    },
    textarea: textareaRef.current,
  }));

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    if (value === undefined) {
      setInnerValue(newValue);
    }
    onChange?.(newValue);
  };

  // 处理回车按下
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && onPressEnter) {
      onPressEnter(e);
    }
    rest.onKeyDown?.(e);
  };

  // 处理自适应高度
  useEffect(() => {
    if (!autoSize || !textareaRef.current) return;

    const textareaEl = textareaRef.current;
    textareaEl.style.height = 'auto';
    let height = textareaEl.scrollHeight;

    if (typeof autoSize === 'object') {
      const { minRows, maxRows } = autoSize;
      const lineHeight = parseInt(getComputedStyle(textareaEl).lineHeight, 10);

      if (minRows) {
        const minHeight = minRows * lineHeight;
        height = Math.max(height, minHeight);
      }

      if (maxRows) {
        const maxHeight = maxRows * lineHeight;
        height = Math.min(height, maxHeight);
      }
    }

    textareaEl.style.height = `${height}px`;
  }, [innerValue, autoSize]);

  // 计算类名
  const textareaClassName = cx(
    styles.inputControl,
    styles.inputTextarea,
    {
      [styles.inputControlDisabled]: disabled,
      [styles.dark]: dark,
    },
    className
  );

  return (
    <textarea
      ref={textareaRef}
      className={textareaClassName}
      value={innerValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={maxLength}
      id={id}
      onKeyDown={handleKeyDown}
      style={style}
      {...rest}
    />
  );
});

export const Search = React.forwardRef<InputRef, SearchProps>((props, ref) => {
  const {
    onSearch,
    loading = false,
    ...restProps
  } = props;

  // 处理搜索
  const handleSearch = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const inputRef = (ref as React.RefObject<InputRef>)?.current;
    const value = inputRef?.input?.value || '';
    onSearch?.(value, e);
  };

  // 处理回车
  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleSearch(e);
    restProps.onPressEnter?.(e);
  };

  // 渲染搜索图标
  const searchIcon = (
    <span className={styles.inputSearchButton} onClick={(e) => handleSearch(e)}>
      🔍
    </span>
  );

  return (
    <Input
      ref={ref}
      {...restProps}
      className={cx(styles.inputSearch, restProps.className)}
      onPressEnter={handlePressEnter}
      suffix={searchIcon}
    />
  );
});

export const Password = React.forwardRef<InputRef, PasswordProps>((props, ref) => {
  const {
    visibilityToggle = true,
    defaultVisible = false,
    visible,
    onVisibleChange,
    ...restProps
  } = props;

  // 内部状态
  const [innerVisible, setInnerVisible] = useState<boolean>(visible !== undefined ? visible : defaultVisible);

  // 同步外部visible
  useEffect(() => {
    if (visible !== undefined) {
      setInnerVisible(visible);
    }
  }, [visible]);

  // 处理可见性切换
  const handleVisibleChange = () => {
    const newVisible = !innerVisible;
    if (visible === undefined) {
      setInnerVisible(newVisible);
    }
    onVisibleChange?.(newVisible);
  };

  // 渲染密码图标
  const passwordIcon = visibilityToggle && (
    <span className={styles.inputPasswordIcon} onClick={handleVisibleChange}>
      {innerVisible ? '👁️' : '👁️‍🗨️'}
    </span>
  );

  return (
    <Input
      ref={ref}
      {...restProps}
      type={innerVisible ? 'text' : 'password'}
      className={cx(styles.inputPassword, restProps.className)}
      suffix={passwordIcon}
    />
  );
});

Input.TextArea = TextArea;
Input.Search = Search;
Input.Password = Password;

export default Input;