import React, { ReactElement } from 'react';
import { ColProps } from './Col';

export interface FormContextProps {
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelAlign?: 'left' | 'right';
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  colon?: boolean;
  requiredMark?: boolean;
  itemRef: (name: (string | number)[]) => (node: ReactElement) => void;
}

const FormContext = React.createContext<FormContextProps>({
  layout: 'horizontal',
  labelAlign: 'right',
  colon: true,
  requiredMark: true,
  itemRef: () => () => {},
});

export default FormContext;