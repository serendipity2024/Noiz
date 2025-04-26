/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Rule } from 'antd/lib/form';
import zh from 'antd/lib/locale/zh_CN';
import en from 'antd/lib/locale/en_US';
import useLocale, { I18nContent, Locale } from '../../hooks/useLocale';
import formI18n from './SchemaForm.i18n.json';
import { Form, Input, ZInput, Switch, Select, Modal, ConfigProvider } from '../../zui';
import cssModule from './SchemaForm.module.scss';

export interface TextItem {
  type: 'input';
}

export interface SelectItem {
  type: 'select';
  options: { label: string; value: any }[];
}

export interface CheckBoxItem {
  type: 'checkbox';
}

export interface TextAreaItem {
  type: 'textarea';
  rows?: number;
}

export type FormItem = (TextItem | SelectItem | CheckBoxItem | TextAreaItem) & {
  label?: string;
  required?: boolean;
  validator?: (rule: Rule, value: any) => Promise<any>;
  readonly?: boolean;
  placeholder?: string;
  name: string;
  defaultValue?: any;
  autoFocus?: boolean;
};

export interface FormSchema {
  name: string;
  items: FormItem[];
}

export interface FormProps<T> {
  title: string;
  onCancel: () => void;
  onSubmit: (data: T) => void;
  data?: T;
}

export function sqlKeywordValidator(rule: Rule, value: any) {
  return new Promise<void>((resolve, reject) => {
    if (
      [
        'add',
        'alter',
        'all',
        'and',
        'any',
        'as',
        'asc',
        'between',
        'case',
        'check',
        'column',
        'constraint',
        'create',
        'database',
        'default',
        'delete',
        'desc',
        'distinct',
        'drop',
        'exec',
        'from',
        'having',
        'in',
        'index',
        'item',
        'join',
        'like',
        'limit',
        'not',
        'or',
        'procedure',
        'rownum',
        'select',
        'set',
        'table',
        'top',
        'union',
        'unique',
        'update',
        'values',
        'values',
        'view',
        'where',
      ].includes(((value as string) ?? '').toLocaleLowerCase()) ||
      ((value as string) ?? '').startsWith('fz')
    ) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(<ErrorMessage />);
    } else resolve();
  });
}

export function ErrorMessage() {
  const { localizedContent: content } = useLocale(formI18n);
  return <>{content.error}</>;
}

export function createForm<T, U>(formSchema: FormSchema, i18n: I18nContent<U>) {
  const defaultValues = formSchema.items.reduce((o, item) => {
    // eslint-disable-next-line no-param-reassign
    o[item.name] = item.defaultValue;
    return o;
  }, {} as any);
  const InnerForm = (props: FormProps<T>) => {
    const { localizedContent: content, locale } = useLocale(i18n);
    const { localizedContent } = useLocale(formI18n);
    const initialValues = { ...defaultValues, ...props.data };
    const [form] = Form.useForm();
    const onSubmit = () => {
      form.submit();
    };
    return (
      <ConfigProvider locale={locale === Locale.EN ? en : zh}>
        <Modal
          className={cssModule.mainContainer}
          title={props.title}
          onOk={() => onSubmit()}
          visible
          onCancel={props.onCancel}
          okText={localizedContent.button.ok}
          cancelText={localizedContent.button.cancel}
        >
          <Form
            form={form}
            initialValues={initialValues}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            onFinish={props.onSubmit}
          >
            {formSchema.items.map((item) => {
              let ele!: JSX.Element;
              let valuePropName = 'value';
              const label = item.label ?? item.name;
              if (item.type === 'input') {
                ele = (
                  <ZInput
                    placeholder={item.placeholder ?? ''}
                    readOnly={item.readonly}
                    autoFocus={item.autoFocus}
                  />
                );
              } else if (item.type === 'select') {
                ele = (
                  <Select
                    placeholder={localizedContent.placeholder.select}
                    disabled={item.readonly}
                    autoFocus={item.autoFocus}
                  >
                    {item.options.map((o) => (
                      <Select.Option key={o.value} value={o.value}>
                        {(content as Record<string, any>)[o.label] ?? o.label}
                      </Select.Option>
                    ))}
                  </Select>
                );
              } else if (item.type === 'checkbox') {
                ele = <Switch autoFocus={item.autoFocus} />;
                valuePropName = 'checked';
              } else if (item.type === 'textarea') {
                ele = (
                  <Input.TextArea
                    className={cssModule.textArea}
                    rows={item.rows}
                    autoFocus={item.autoFocus}
                  />
                );
              } else {
                ele = <div>Unsupported</div>;
              }
              const rules = [] as Rule[];
              if (item.required) rules.push({ required: item.required });
              if (item.validator) rules.push({ validator: item.validator });
              return (
                <Form.Item
                  key={item.name}
                  label={(content as Record<string, any>)[label] ?? label}
                  name={item.name}
                  required={item.required}
                  valuePropName={valuePropName}
                  rules={rules}
                  style={{ marginBottom: '10px' }}
                >
                  {ele}
                </Form.Item>
              );
            })}
          </Form>
        </Modal>
      </ConfigProvider>
    );
  };
  return InnerForm;
}
