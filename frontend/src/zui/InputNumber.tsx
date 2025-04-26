/* eslint-disable import/no-default-export */
import React, { ReactElement, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './InputNumber.module.scss';
import { useConfig } from './ConfigProvider';

export type SizeType = 'small' | 'default' | 'large';

export interface InputNumberProps {
  /** 自动获取焦点 */
  autoFocus?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 输入框默认值 */
  defaultValue?: number;
  /** 禁用 */
  disabled?: boolean;
  /** 是否启用键盘快捷键 */
  keyboard?: boolean;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
  /** 数值精度 */
  precision?: number;
  /** 输入框大小 */
  size?: SizeType;
  /** 每次改变步数，可以为小数 */
  step?: number;
  /** 当前值 */
  value?: number;
  /** 变化回调 */
  onChange?: (value: number | null) => void;
  /** 按下回车的回调 */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 失去焦点回调 */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 获取焦点回调 */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export const InputNumber = (props: InputNumberProps): ReactElement => {
  const {
    autoFocus = false,
    bordered = true,
    dark = false,
    defaultValue,
    disabled = false,
    keyboard = true,
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    precision,
    size = 'default',
    step = 1,
    value,
    onChange,
    onPressEnter,
    onBlur,
    onFocus,
    className,
    style,
    prefixCls: customizePrefixCls,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('input-number', customizePrefixCls);

  // 内部状态
  const [innerValue, setInnerValue] = useState<number | null>(
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : null
  );
  const [focused, setFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(innerValue !== null ? innerValue.toString() : '');
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
      setInputValue(value !== null ? value.toString() : '');
    }
  }, [value]);

  // 格式化数值
  const formatValue = (val: number | null): number | null => {
    if (val === null) {
      return null;
    }

    // 限制最大最小值
    let result = Math.max(min, Math.min(max, val));

    // 处理精度
    if (precision !== undefined) {
      result = parseFloat(result.toFixed(precision));
    }

    return result;
  };

  // 处理值变化
  const handleValueChange = (val: number | null) => {
    const formattedValue = formatValue(val);

    if (value === undefined) {
      setInnerValue(formattedValue);
    }

    if (onChange && formattedValue !== innerValue) {
      onChange(formattedValue);
    }
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.trim();
    setInputValue(inputVal);

    if (inputVal === '' || inputVal === '-') {
      handleValueChange(null);
      return;
    }

    const numVal = parseFloat(inputVal);
    if (!isNaN(numVal)) {
      handleValueChange(numVal);
    }
  };

  // 处理步进
  const handleStep = (isUp: boolean) => {
    if (disabled) {
      return;
    }

    const val = innerValue !== null ? innerValue : 0;
    const newVal = isUp ? val + step : val - step;
    handleValueChange(newVal);
    setInputValue(formatValue(newVal)?.toString() || '');
    inputRef.current?.focus();
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || !keyboard) {
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(false);
    } else if (e.key === 'Enter' && onPressEnter) {
      onPressEnter(e);
    }
  };

  // 处理失去焦点
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    // 当输入框为空或只有负号时，设置为null
    if (inputValue === '' || inputValue === '-') {
      setInputValue('');
      handleValueChange(null);
    } else {
      // 尝试解析数值
      const numVal = parseFloat(inputValue);
      if (!isNaN(numVal)) {
        const formattedValue = formatValue(numVal);
        setInputValue(formattedValue !== null ? formattedValue.toString() : '');
        handleValueChange(formattedValue);
      } else {
        // 如果无法解析，恢复到上一个有效值
        setInputValue(innerValue !== null ? innerValue.toString() : '');
      }
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  // 处理获取焦点
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  // 判断是否可以增加
  const upDisabled = disabled || (innerValue !== null && innerValue >= max);

  // 判断是否可以减少
  const downDisabled = disabled || (innerValue !== null && innerValue <= min);

  // 组件类名
  const inputNumberClass = cx(
    styles.inputNumber,
    {
      [styles.inputNumberFocused]: focused,
      [styles.inputNumberDisabled]: disabled,
      [styles.small]: size === 'small',
      [styles.large]: size === 'large',
      [styles.dark]: dark,
    },
    className
  );

  // 上箭头类名
  const upHandlerClass = cx(styles.inputNumberHandlerUp, {
    [styles.inputNumberHandlerUpDisabled]: upDisabled,
  });

  // 下箭头类名
  const downHandlerClass = cx(styles.inputNumberHandlerDown, {
    [styles.inputNumberHandlerDownDisabled]: downDisabled,
  });

  return (
    <div className={inputNumberClass} style={style}>
      <input
        ref={inputRef}
        className={styles.inputNumberInput}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <div className={styles.inputNumberHandler}>
        <span className={upHandlerClass} onClick={() => !upDisabled && handleStep(true)}>
          <span className={styles.inputNumberHandlerUpInner}>
            <svg
              viewBox="64 64 896 896"
              data-icon="up"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path>
            </svg>
          </span>
        </span>
        <span className={downHandlerClass} onClick={() => !downDisabled && handleStep(false)}>
          <span className={styles.inputNumberHandlerDownInner}>
            <svg
              viewBox="64 64 896 896"
              data-icon="down"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
};

export default InputNumber;