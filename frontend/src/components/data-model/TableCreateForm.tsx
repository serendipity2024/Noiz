import React from 'react';
import { TableCreation } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { createForm, sqlKeywordValidator } from './SchemaForm';
import i18n from './TableCreateForm.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export interface Props {
  data?: Partial<TableCreation>;
  onSubmit(data: TableCreation): void;
  onCancel(): void;
}

const TableCreateFormInner = createForm<TableCreation, typeof i18n[Locale]>(
  {
    name: 'TableCreate',
    items: [
      {
        name: 'displayName',
        label: 'name',
        type: 'input',
        required: true,
        validator: sqlKeywordValidator,
      },
      { name: 'description', label: 'description', type: 'textarea' },
      {
        name: 'createdAt',
        label: 'createdAt',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        name: 'updatedAt',
        label: 'updatedAt',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },
  i18n
);

export function TableCreateForm(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  return (
    <TableCreateFormInner
      title={content.title}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    />
  );
}
