import React from 'react';
import uniqid from 'uniqid';
import useLocale from '../../hooks/useLocale';
import {
  ARRAY_TYPE,
  ConstraintMetadata,
  TableMetadata,
  UniqueConstraint,
} from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import i18n from './TableConstraintEdit.i18n.json';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import { Button, Collapse, Divider, Empty, Form, ZInput, Modal, Select } from '../../zui';
import cssModule from './TableConstraintEdit.module.scss';

interface Props {
  table: TableMetadata;
  constraint: ConstraintMetadata[];
  onCancel: () => void;
  onSubmit: (form: any) => void;
}

enum ConstraintType {
  Unique = 'unique',
}

type TableConstraint = {
  name: string;
  compositeUniqueColumns: string[];
  type: ConstraintType;
  saved: boolean;
};

function isUniqueConstraint(constraint: ConstraintMetadata): constraint is UniqueConstraint {
  return (constraint as UniqueConstraint).compositeUniqueColumns !== undefined;
}

export function TableConstraintEdit(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { tableMetadata } = useDataModelMetadata();

  const uniqueConstraints: TableConstraint[] = props.constraint
    .filter<UniqueConstraint>(isUniqueConstraint)
    .map((value) => ({ ...value, type: ConstraintType.Unique, saved: true }));
  const constraints = { list: uniqueConstraints };

  const options = props.table.columnMetadata
    .filter((metadata) => !metadata.uiHidden)
    .map((metadata) => ({
      label: metadata.name,
      value: metadata.name,
    }));

  const constraintNames = tableMetadata
    .filter((table) => table.name !== props.table.name)
    .flatMap((table) => table.constraintMetadata)
    .map((constraint) => constraint.name);

  const [form] = Form.useForm();

  const getConstraintName = (type: ConstraintType, name: string) => {
    switch (type) {
      case ConstraintType.Unique:
        return `${content.label.unique} - ${name}`;
      default:
        throw Error('Unknown constraint');
    }
  };

  return (
    <Modal
      visible
      className={cssModule.mainContainer}
      title={content.title}
      onCancel={props.onCancel}
      onOk={() => form.submit()}
      okText={content.button.ok}
      cancelText={content.button.cancel}
    >
      <Form form={form} initialValues={constraints} onFinish={props.onSubmit}>
        <Form.List name="list">
          {(fields, { add }) => (
            <>
              {fields.length === 0 ? (
                <Empty description={content.label.empty} />
              ) : (
                <Collapse
                  bordered
                  setContentFontColorToOrangeBecauseHistoryIsCruel
                  key={fields.length}
                  defaultOpenIndex={fields.length - 1}
                  items={fields.map((field) => ({
                    title: getConstraintName(
                      form.getFieldValue(['list', field.name, 'type']),
                      form.getFieldValue(['list', field.name, 'name'])
                    ),
                    content: (
                      <>
                        <Form.Item
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...field}
                          key={`${field.key}-name`}
                          label={content.label.constraintName}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          required
                          rules={[
                            {
                              validator: (rule, value) => {
                                if (
                                  form
                                    .getFieldsValue()
                                    .list.map((v: any) => v.name)
                                    .concat(constraintNames)
                                    .filter((v: any) => v === value).length > 1
                                )
                                  return Promise.reject(rule.message);
                                return Promise.resolve();
                              },
                              message: content.message.nameNotUnique,
                            },
                            {
                              required: true,
                              message: content.message.nameEmpty,
                            },
                          ]}
                        >
                          <ZInput
                            disabled={uniqueConstraints[field.fieldKey]?.saved}
                            lightBackground
                          />
                        </Form.Item>
                        <Form.Item
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...field}
                          key={`${field.key}-columns`}
                          label={content.label.compositeUniqueColumns}
                          name={[field.name, 'compositeUniqueColumns']}
                          fieldKey={[field.fieldKey, 'compositeUniqueColumns']}
                          required
                          rules={[
                            {
                              type: ARRAY_TYPE,
                              required: true,
                              message: content.message.compositeUniqueColumns,
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            options={options}
                            disabled={uniqueConstraints[field.fieldKey]?.saved}
                          />
                        </Form.Item>
                      </>
                    ),
                  }))}
                />
              )}
              <Divider />
              <Form.Item>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    add({
                      name: uniqid(`${ConstraintType.Unique}_${props.table.name}_`),
                      compositeUniqueColumns: [],
                      type: ConstraintType.Unique,
                      saved: false,
                    })
                  }
                >
                  {content.button.add}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
