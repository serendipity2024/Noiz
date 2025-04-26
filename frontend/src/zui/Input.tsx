import React, { ReactElement } from 'react';
import cx from 'classnames';
import styles from './Input.module.scss';

export interface BaseProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  inputSize?: 'small' | 'large';
  readOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  bordered?: boolean;
  lightBackground?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface Managed extends BaseProps {
  value: string;
  onChange: (result: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Unmanaged extends BaseProps {
  value?: never;
  onChange?: never;
}

interface Disabled extends BaseProps {
  disabled: true;
  value: string;
}

interface ReadOnly extends BaseProps {
  readOnly: true;
  value: string;
}

type Props = Unmanaged | Managed | Disabled | ReadOnly;

export const Input = (props: Props): ReactElement => {
  const {
    className = '',
    type,
    placeholder,
    defaultValue,
    readOnly,
    inputSize = 'small',
    disabled,
    bordered = false,
    lightBackground,
    autoFocus,
  } = props;

  return (
    <div
      className={cx(styles.container, className, {
        [styles.lightBackground]: lightBackground,
        [styles.sizeLarge]: inputSize === 'large',
        [styles.disabled]: disabled,
        [styles.bordered]: bordered,
      })}
    >
      <input
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        value={
          // TODO: this will be changed after all antd.forms are killed
          // form passing empty string '' as undefined to component causing controller warnings.
          !props.disabled && !props.readOnly && props.onChange ? props.value ?? '' : props.value
        }
        onChange={!props.disabled && !props.readOnly ? props.onChange : undefined}
        readOnly={readOnly}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        disabled={disabled}
        onBlur={props.onBlur}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && props.onPressEnter) props.onPressEnter(e);
        }}
      />
    </div>
  );
};
