import React, { ReactElement } from 'react';
import cx from 'classnames';
import { Select as AntdSelect } from 'antd';
import { SelectValue } from 'antd/lib/select';
import styles from './Select.module.scss';

export interface SelectOption {
  title: string;
  key: string;
  value: string;
}

export interface SelectProps {
  className?: string;
  value?: string;
  options: SelectOption[];
  onChange?: (result: SelectValue) => void;
}

export const Select = (props: SelectProps): ReactElement => {
  const { className = '', options, value } = props;

  return (
    <AntdSelect
      value={value}
      className={cx(styles.container, {
        [className]: className,
      })}
      onChange={(sv) => props.onChange && props.onChange(sv)}
    >
      {options.map((o) => (
        <AntdSelect.Option key={o.key} value={o.value}>
          {o.title}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  );
};
