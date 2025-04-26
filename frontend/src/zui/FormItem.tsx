/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode, useContext } from 'react';
import cx from 'classnames';
import { Field } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/lib/Field';
import { Meta } from 'rc-field-form/lib/interface';
import { Row } from './Row';
import { Col, ColProps } from './Col';
import styles from './Form.module.scss';
import FormContext from './FormContext';
import { useConfig } from './ConfigProvider';

export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';
export type FormLabelAlign = 'left' | 'right';

export interface FormItemProps extends Omit<FieldProps, 'children'> {
  /** 标签的文本 */
  label?: ReactNode;
  /** 标签标题区域布局样式 */
  labelCol?: ColProps;
  /** 控件区域布局样式 */
  wrapperCol?: ColProps;
  /** 配合 label 属性使用，表示是否显示 label 后面的冒号 */
  colon?: boolean;
  /** 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 */
  extra?: ReactNode;
  /** 提示信息，如不设置，则会根据校验规则自动生成 */
  help?: ReactNode;
  /** 校验状态，如不设置，则会根据校验规则自动生成 */
  validateStatus?: FormValidateStatus;
  /** 是否必填，如不设置，则会根据校验规则自动生成 */
  required?: boolean;
  /** 是否显示校验状态图标 */
  hasFeedback?: boolean;
  /** 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol */
  htmlFor?: string;
  /** 标签文本对齐方式 */
  labelAlign?: FormLabelAlign;
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义前缀 */
  prefixCls?: string;
}

export const FormItem = (props: FormItemProps): ReactElement => {
  const {
    label,
    labelCol,
    wrapperCol,
    colon,
    extra,
    help,
    validateStatus,
    required,
    hasFeedback = false,
    htmlFor,
    labelAlign,
    children,
    className,
    style,
    prefixCls: customizePrefixCls,
    ...restProps
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls('form-item', customizePrefixCls);

  const formContext = useContext(FormContext);
  const {
    layout = 'horizontal',
    labelAlign: contextLabelAlign,
    labelCol: contextLabelCol,
    wrapperCol: contextWrapperCol,
    colon: contextColon,
    requiredMark: contextRequiredMark,
  } = formContext;

  // 合并配置
  const mergedLabelCol = labelCol || contextLabelCol;
  const mergedWrapperCol = wrapperCol || contextWrapperCol;
  const mergedColon = colon !== undefined ? colon : contextColon;
  const mergedLabelAlign = labelAlign || contextLabelAlign;

  // 渲染标签
  const renderLabel = () => {
    if (!label) {
      return null;
    }

    const labelClassName = cx(styles.formItemLabel, {
      [styles.formItemLabelLeft]: mergedLabelAlign === 'left',
      [styles.formItemLabelRequired]: required,
    });

    let labelChildren = label;
    // 添加冒号
    if (mergedColon && typeof label === 'string' && label.trim() !== '') {
      labelChildren = `${label}:`;
    }

    return (
      <Col {...mergedLabelCol} className={labelClassName}>
        <label htmlFor={htmlFor} title={typeof label === 'string' ? label : ''}>
          {labelChildren}
        </label>
      </Col>
    );
  };

  // 渲染校验状态图标
  const renderFeedbackIcon = () => {
    if (!hasFeedback || !validateStatus) {
      return null;
    }

    const iconClassName = cx(styles.formItemFeedbackIcon, {
      [styles.formItemFeedbackIconSuccess]: validateStatus === 'success',
      [styles.formItemFeedbackIconError]: validateStatus === 'error',
      [styles.formItemFeedbackIconWarning]: validateStatus === 'warning',
      [styles.formItemFeedbackIconValidating]: validateStatus === 'validating',
    });

    let icon = null;
    if (validateStatus === 'success') {
      icon = '✓';
    } else if (validateStatus === 'error') {
      icon = '✗';
    } else if (validateStatus === 'warning') {
      icon = '⚠';
    } else if (validateStatus === 'validating') {
      icon = '⟳';
    }

    return <span className={iconClassName}>{icon}</span>;
  };

  // 渲染帮助信息
  const renderHelp = () => {
    if (!help) {
      return null;
    }

    return <div className={styles.formItemExplain}>{help}</div>;
  };

  // 渲染额外信息
  const renderExtra = () => {
    if (!extra) {
      return null;
    }

    return <div className={styles.formItemExtra}>{extra}</div>;
  };

  // 渲染控件
  const renderControl = () => {
    const controlClassName = cx(styles.formItemControl, {
      [styles.formItemHasError]: validateStatus === 'error',
      [styles.formItemHasWarning]: validateStatus === 'warning',
    });

    return (
      <Col {...mergedWrapperCol} className={controlClassName}>
        <div className={styles.formItemControlWrapper}>
          {children}
          {renderFeedbackIcon()}
        </div>
        {renderHelp()}
        {renderExtra()}
      </Col>
    );
  };

  const itemClassName = cx(styles.formItem, className);

  // 根据布局渲染表单项
  if (layout === 'horizontal') {
    return (
      <Row className={itemClassName} style={style}>
        {renderLabel()}
        {renderControl()}
      </Row>
    );
  }

  return (
    <div className={itemClassName} style={style}>
      {renderLabel()}
      {renderControl()}
    </div>
  );
};

const WrapperFormItem = (props: FormItemProps) => {
  const { name, ...restProps } = props;

  if (!name) {
    return <FormItem {...restProps} />;
  }

  return (
    <Field name={name} {...restProps}>
      {(control, meta, context) => {
        const { errors } = meta;
        const validateStatus: FormValidateStatus = errors && errors.length > 0 ? 'error' : '';
        const help = errors && errors.length > 0 ? errors[0] : undefined;

        return (
          <FormItem
            {...restProps}
            validateStatus={validateStatus}
            help={help}
          >
            {React.cloneElement(props.children as ReactElement, { ...control })}
          </FormItem>
        );
      }}
    </Field>
  );
};

export default WrapperFormItem;