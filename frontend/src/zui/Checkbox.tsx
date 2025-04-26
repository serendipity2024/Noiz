/* eslint-disable import/no-default-export */
import React, { ReactElement, ChangeEvent, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Checkbox.module.scss';

export interface CheckboxProps {
  /** 是否选中 */
  checked?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 设置 indeterminate 状态，只负责样式控制 */
  indeterminate?: boolean;
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
}

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
    name?: string;
    value?: any;
  };
}

export interface CheckboxGroupProps {
  /** 默认选中的选项 */
  defaultValue?: string[];
  /** 指定选中的选项 */
  value?: string[];
  /** 变化时的回调函数 */
  onChange?: (checkedValues: string[]) => void;
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
    value: string;
    disabled?: boolean;
  }>;
}

export interface CheckboxGroupContext {
  value: string[];
  disabled?: boolean;
  toggleOption?: (option: { label: ReactNode; value: string }) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  const {
    defaultValue,
    value,
    onChange,
    options = [],
    className,
    style,
    children,
    disabled,
  } = props;

  const [checkedValues, setCheckedValues] = React.useState<string[]>(value || defaultValue || []);

  React.useEffect(() => {
    if (value !== undefined) {
      setCheckedValues(value);
    }
  }, [value]);

  const toggleOption = (option: { label: ReactNode; value: string }) => {
    const optionIndex = checkedValues.indexOf(option.value);
    const newCheckedValues = [...checkedValues];

    if (optionIndex === -1) {
      newCheckedValues.push(option.value);
    } else {
      newCheckedValues.splice(optionIndex, 1);
    }

    if (value === undefined) {
      setCheckedValues(newCheckedValues);
    }

    if (onChange) {
      onChange(newCheckedValues);
    }
  };

  const renderGroup = () => {
    if (options && options.length > 0) {
      return options.map((option) => (
        <Checkbox
          key={option.value}
          disabled={disabled || option.disabled}
          checked={checkedValues.indexOf(option.value) !== -1}
          onChange={() => toggleOption(option)}
          className={styles.checkbox}
        >
          {option.label}
        </Checkbox>
      ));
    }

    return children;
  };

  return (
    <div className={cx(styles.group, className)} style={style}>
      {renderGroup()}
    </div>
  );
};

export const Checkbox = (props: CheckboxProps): ReactElement => {
  const {
    checked,
    defaultChecked,
    disabled,
    indeterminate,
    onChange,
    className,
    style,
    children,
    name,
    value,
    autoFocus,
    ...rest
  } = props;

  const [innerChecked, setInnerChecked] = React.useState<boolean>(
    checked !== undefined ? checked : defaultChecked || false
  );

  React.useEffect(() => {
    if (checked !== undefined) {
      setInnerChecked(checked);
    }
  }, [checked]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (checked === undefined) {
      setInnerChecked(e.target.checked);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const classNames = cx(
    styles.checkbox,
    {
      [styles.checked]: innerChecked,
      [styles.disabled]: disabled,
      [styles.indeterminate]: indeterminate,
    },
    className
  );

  return (
    <label className={cx(styles.wrapper, className)} style={style}>
      <span className={classNames}>
        <input
          name={name}
          type="checkbox"
          className={styles.input}
          checked={innerChecked}
          disabled={disabled}
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

Checkbox.Group = CheckboxGroup;

export default Checkbox;