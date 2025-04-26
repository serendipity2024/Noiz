/* eslint-disable import/no-default-export */
import React, { ReactElement, ChangeEvent, ReactNode, useContext, createContext } from 'react';
import cx from 'classnames';
import styles from './Radio.module.scss';
import { useConfig } from './ConfigProvider';

export interface RadioProps {
  /** 是否选中 */
  checked?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 变化时的回调函数 */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 名称 */
  name?: string;
  /** 值 */
  value?: any;
  /** 自动获取焦点 */
  autoFocus?: boolean;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
}

export interface RadioChangeEvent {
  target: {
    checked: boolean;
    name?: string;
    value?: any;
  };
}

export interface RadioGroupProps {
  /** 默认选中的值 */
  defaultValue?: any;
  /** 指定选中的值 */
  value?: any;
  /** 变化时的回调函数 */
  onChange?: (value: any) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 整组失效 */
  options?: Array<{
    label: ReactNode;
    value: any;
    disabled?: boolean;
    style?: React.CSSProperties;
  }>;
  /** 用于设置 Radio button 样式 */
  buttonStyle?: 'outline' | 'solid';
  /** 大小，只对按钮样式生效 */
  size?: 'large' | 'default' | 'small';
  /** 设置 Radio 的 name 属性 */
  name?: string;
  /** 是否使用暗色主题 */
  dark?: boolean;
  /** 自定义前缀 */
  prefixCls?: string;
  /** 是否使用按钮样式 */
  optionType?: 'default' | 'button';
}

export interface RadioGroupContext {
  value: any;
  disabled?: boolean;
  name?: string;
  onChange?: (e: RadioChangeEvent) => void;
}

export interface RadioButtonProps extends RadioProps {
  /** 按钮大小 */
  size?: 'large' | 'default' | 'small';
}

const RadioGroupContext = createContext<RadioGroupContext | null>(null);

export const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const {
    defaultValue,
    value,
    onChange,
    options = [],
    className,
    style,
    children,
    disabled,
    buttonStyle = 'outline',
    size = 'default',
    name,
    dark = false,
    prefixCls: customizePrefixCls,
    optionType = 'default',
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('radio', customizePrefixCls);

  const [innerValue, setInnerValue] = React.useState<any>(value !== undefined ? value : defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  const handleChange = (e: RadioChangeEvent) => {
    if (value === undefined) {
      setInnerValue(e.target.value);
    }

    if (onChange) {
      onChange(e.target.value);
    }
  };

  const renderGroup = () => {
    if (options && options.length > 0) {
      return options.map((option) => {
        if (optionType === 'button') {
          return (
            <RadioButton
              key={option.value}
              disabled={disabled || option.disabled}
              checked={innerValue === option.value}
              value={option.value}
              onChange={(e) => handleChange({ target: { checked: true, value: option.value } })}
              className={styles.radio}
              style={option.style}
              size={size}
              dark={dark}
            >
              {option.label}
            </RadioButton>
          );
        }
        return (
          <Radio
            key={option.value}
            disabled={disabled || option.disabled}
            checked={innerValue === option.value}
            value={option.value}
            onChange={(e) => handleChange({ target: { checked: true, value: option.value } })}
            className={styles.radio}
            style={option.style}
            dark={dark}
          >
            {option.label}
          </Radio>
        );
      });
    }

    return children;
  };

  const groupContext = {
    value: innerValue,
    disabled,
    name,
    onChange: handleChange,
  };

  const groupClassName = cx(
    styles.group,
    {
      [styles.buttonGroup]: optionType === 'button',
    },
    className
  );

  return (
    <RadioGroupContext.Provider value={groupContext}>
      <div className={groupClassName} style={style}>
        {renderGroup()}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioButton = (props: RadioButtonProps): ReactElement => {
  const {
    checked,
    defaultChecked,
    disabled,
    onChange,
    className,
    style,
    children,
    name,
    value,
    autoFocus,
    size = 'default',
    dark = false,
    prefixCls: customizePrefixCls,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('radio-button', customizePrefixCls);

  const radioGroupContext = useContext(RadioGroupContext);

  const [innerChecked, setInnerChecked] = React.useState<boolean>(
    radioGroupContext
      ? radioGroupContext.value === value
      : checked !== undefined
      ? checked
      : defaultChecked || false
  );

  React.useEffect(() => {
    if (radioGroupContext) {
      setInnerChecked(radioGroupContext.value === value);
    } else if (checked !== undefined) {
      setInnerChecked(checked);
    }
  }, [checked, radioGroupContext, value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (!radioGroupContext && checked === undefined) {
      setInnerChecked(e.target.checked);
    }

    if (onChange) {
      onChange(e);
    }

    if (radioGroupContext && radioGroupContext.onChange) {
      radioGroupContext.onChange({
        target: {
          checked: true,
          value,
        },
      });
    }
  };

  const isDisabled = radioGroupContext ? radioGroupContext.disabled || disabled : disabled;
  const radioName = radioGroupContext ? radioGroupContext.name : name;

  const buttonClassName = cx(
    styles.button,
    {
      [styles.checked]: innerChecked,
      [styles.disabled]: isDisabled,
      [styles.small]: size === 'small',
      [styles.large]: size === 'large',
      [styles.dark]: dark,
    },
    className
  );

  return (
    <label className={buttonClassName} style={style}>
      <input
        name={radioName}
        type="radio"
        className={styles.input}
        checked={innerChecked}
        disabled={isDisabled}
        onChange={handleChange}
        value={value}
        autoFocus={autoFocus}
        {...rest}
      />
      {children}
    </label>
  );
};

export const Radio = (props: RadioProps): ReactElement => {
  const {
    checked,
    defaultChecked,
    disabled,
    onChange,
    className,
    style,
    children,
    name,
    value,
    autoFocus,
    dark = false,
    prefixCls: customizePrefixCls,
    ...rest
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('radio', customizePrefixCls);

  const radioGroupContext = useContext(RadioGroupContext);

  const [innerChecked, setInnerChecked] = React.useState<boolean>(
    radioGroupContext
      ? radioGroupContext.value === value
      : checked !== undefined
      ? checked
      : defaultChecked || false
  );

  React.useEffect(() => {
    if (radioGroupContext) {
      setInnerChecked(radioGroupContext.value === value);
    } else if (checked !== undefined) {
      setInnerChecked(checked);
    }
  }, [checked, radioGroupContext, value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (!radioGroupContext && checked === undefined) {
      setInnerChecked(e.target.checked);
    }

    if (onChange) {
      onChange(e);
    }

    if (radioGroupContext && radioGroupContext.onChange) {
      radioGroupContext.onChange({
        target: {
          checked: true,
          value,
        },
      });
    }
  };

  const isDisabled = radioGroupContext ? radioGroupContext.disabled || disabled : disabled;
  const radioName = radioGroupContext ? radioGroupContext.name : name;

  const radioClassName = cx(
    styles.radio,
    {
      [styles.checked]: innerChecked,
      [styles.disabled]: isDisabled,
      [styles.dark]: dark,
    },
    className
  );

  return (
    <label className={cx(styles.wrapper, className)} style={style}>
      <span className={radioClassName}>
        <input
          name={radioName}
          type="radio"
          className={styles.input}
          checked={innerChecked}
          disabled={isDisabled}
          onChange={handleChange}
          value={value}
          autoFocus={autoFocus}
          {...rest}
        />
        <span className={styles.inner} />
      </span>
      {children !== undefined && <span className={styles.label}>{children}</span>}
    </label>
  );
};

Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export default Radio;