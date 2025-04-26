/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, FormEvent, useContext } from 'react';
import cx from 'classnames';
import { Form as RcForm, FormProps as RcFormProps, useForm as useRcForm, FormInstance } from 'rc-field-form';
import { FormProvider } from 'rc-field-form';
import { ColProps } from './Col';
import { RowProps } from './Row';
import styles from './Form.module.scss';
import { useConfig } from './ConfigProvider';
import FormItem, { FormItemProps } from './FormItem';
import FormContext from './FormContext';

export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormLabelAlign = 'left' | 'right';
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';

export interface FormProps extends Omit<RcFormProps, 'form'> {
  /** 表单布局 */
  layout?: FormLayout;
  /** label 标签的文本对齐方式 */
  labelAlign?: FormLabelAlign;
  /** label 标签布局，同 <Col> 组件，设置 span offset 值 */
  labelCol?: ColProps;
  /** 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol */
  wrapperCol?: ColProps;
  /** 是否显示 label 前的必选标记 */
  hideRequiredMark?: boolean;
  /** 统一设置字段校验规则 */
  validateMessages?: Record<string, any>;
  /** 配合 label 属性使用，表示是否显示 label 后面的冒号 */
  colon?: boolean;
  /** 设置表单域内字段 id 的前缀 */
  name?: string;
  /** 经 Form.useForm() 创建的 form 控制实例，不提供时会自动创建 */
  form?: FormInstance;
  /** 提交表单且数据验证成功后回调事件 */
  onFinish?: (values: any) => void;
  /** 提交表单且数据验证失败后回调事件 */
  onFinishFailed?: (errorInfo: any) => void;
  /** 设置字段校验的时机 */
  validateTrigger?: string | string[];
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export interface FormContextProps {
  layout?: FormLayout;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  colon?: boolean;
  requiredMark?: boolean;
  itemRef: (name: (string | number)[]) => (node: ReactElement) => void;
}

export const Form = (props: FormProps): ReactElement => {
  const {
    layout = 'horizontal',
    labelAlign,
    labelCol,
    wrapperCol,
    hideRequiredMark,
    colon = true,
    name,
    validateMessages,
    onFinish,
    onFinishFailed,
    form,
    children,
    className,
    style,
    prefixCls: customizePrefixCls,
    ...restProps
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('form', customizePrefixCls);

  const formClassName = cx(
    styles.form,
    {
      [styles.horizontal]: layout === 'horizontal',
      [styles.vertical]: layout === 'vertical',
      [styles.inline]: layout === 'inline',
    },
    className
  );

  const formContextValue = React.useMemo(
    () => ({
      layout,
      labelAlign,
      labelCol,
      wrapperCol,
      colon,
      requiredMark: hideRequiredMark ? false : true,
      itemRef: (name: (string | number)[]) => (node: ReactElement) => {},
    }),
    [layout, labelAlign, labelCol, wrapperCol, colon, hideRequiredMark]
  );

  const handleFinish = (values: any) => {
    if (onFinish) {
      onFinish(values);
    }
  };

  const handleFinishFailed = (errorInfo: any) => {
    if (onFinishFailed) {
      onFinishFailed(errorInfo);
    }
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <RcForm
        id={name}
        name={name}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        form={form}
        validateMessages={validateMessages}
        className={formClassName}
        style={style}
        {...restProps}
      >
        {children}
      </RcForm>
    </FormContext.Provider>
  );
};

Form.Item = FormItem;

export const useForm = useRcForm;

export default Form;