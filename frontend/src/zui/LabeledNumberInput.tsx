import React, { ReactElement } from 'react';
import cx from 'classnames';
import styles from './LabeledNumberInput.module.scss';

export interface LabeledNumberInputProps {
  className?: string;
  value: number;
  min?: number;
  max?: number;
  label: string;
  disabled?: boolean;
  onChange: (newValue: number) => void;
}

const SHIFT_KEY_INCREMENT = 10;

export const LabeledNumberInput = (props: LabeledNumberInputProps): ReactElement => {
  const { className, label, value, onChange, max, min, disabled } = props;
  const rounded = Math.round(value);

  const handleKeyEvent = (isShift: boolean, key: string) => {
    if (!isShift) return;
    switch (key) {
      case 'ArrowUp':
        onChange(value + SHIFT_KEY_INCREMENT);
        break;
      case 'ArrowDown':
        onChange(value - SHIFT_KEY_INCREMENT);
        break;
      default:
    }
  };

  return (
    <div className={cx(className, styles.container, { [styles.disabledContainer]: disabled })}>
      <input
        className={styles.input}
        type="number"
        value={rounded}
        max={max}
        min={min}
        disabled={disabled}
        onKeyDown={(ev) => handleKeyEvent(ev.shiftKey, ev.key)}
        onChange={(e) => onChange(parseInt(e.target.value || '0', 10))}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
