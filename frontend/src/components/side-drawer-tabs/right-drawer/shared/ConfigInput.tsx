/* eslint-disable import/no-default-export */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import ZEDInput from '../../../editor/ZEDInput';
import { Input } from '../../../../zui';

interface Props {
  value: string;
  onValueProcessing?: (value: string) => string;
  onValueChange?: (value: string) => void;
  onSaveValue?: (value: string) => void;

  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  blurOnSave?: boolean;
  disable?: boolean;
}

export default function ConfigInput(props: Props): ReactElement {
  const ref = useRef<Input | null>(null);
  const [tempValue, setTempValue] = useState(props.value);
  useEffect(() => setTempValue(props.value), [props.value]);

  const handleOnchange = (value: string) => {
    if (props.onValueChange) props.onValueChange(value);
    const v = props.onValueProcessing ? props.onValueProcessing(value) : value;
    setTempValue(v);
  };

  const handleOnSave = async (): Promise<void> => {
    if (props.blurOnSave && ref.current) ref.current.blur();
    if (!tempValue) {
      setTempValue(props.value);
    } else if (props.onSaveValue && props.value !== tempValue) {
      props.onSaveValue(tempValue);
    } else {
      // do nothing
    }
  };

  return (
    <ZEDInput
      ref={(newRef) => {
        ref.current = newRef;
      }}
      themeType="secondary"
      className={props.className}
      style={props.style ?? {}}
      value={tempValue}
      placeholder={props.placeholder ?? props.value}
      onChange={(e) => handleOnchange(e.target.value)}
      disabled={props.disable}
      onBlur={() => handleOnSave()}
      onPressEnter={() => handleOnSave()}
    />
  );
}
