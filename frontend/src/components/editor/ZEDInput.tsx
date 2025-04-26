/* eslint-disable import/no-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import { InputProps, PasswordProps } from 'antd/lib/input';
import { TextAreaProps, TextAreaRef } from 'antd/lib/input/TextArea';
import React, { ReactElement } from 'react';
import '../../shared/SharedStyles.scss';
import { Input } from '../../zui';

const { TextArea } = Input;
type ThemeType = 'primary' | 'secondary';

interface ExtraProps {
  themeType?: ThemeType;
}

export const ZEDInput = React.forwardRef(
  (props: ExtraProps & InputProps, ref: React.Ref<Input>): ReactElement => {
    const { themeType, ...rest } = props;
    return <Input className={getClassName(themeType)} ref={ref} autoComplete="off" {...rest} />;
  }
);

export const ZEDInputTextArea = React.forwardRef(
  (props: ExtraProps & TextAreaProps, ref: React.Ref<TextAreaRef>): ReactElement => {
    const { themeType, ...rest } = props;
    return <TextArea className={getClassName(themeType)} ref={ref} {...rest} autoSize />;
  }
);

export const ZEDPasswordInput = React.forwardRef(
  (props: ExtraProps & PasswordProps, ref: React.Ref<Input>): ReactElement => {
    const { themeType, ...rest } = props;
    return (
      <Input.Password className={getClassName(themeType)} ref={ref} autoComplete="off" {...rest} />
    );
  }
);

export default ZEDInput;

function getClassName(type?: ThemeType): string {
  switch (type) {
    case 'secondary':
      return 'secondary-input';
    case 'primary':
    default:
      return 'primary-input';
  }
}
