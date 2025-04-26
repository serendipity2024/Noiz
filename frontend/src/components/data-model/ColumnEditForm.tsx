import React from 'react';
import { TableMetadata, ColumnMetadata } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { createForm } from './SchemaForm';
import i18n from './ColumnForm.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export type EditingAtrrs = Pick<ColumnMetadata, 'id' | 'name' | 'unique' | 'required'>;

export interface Props {
  table: TableMetadata;
  column: ColumnMetadata;
  onSubmit(data: EditingAtrrs): void;
  onCancel(): void;
}

const ColumnEditFormInner = createForm<EditingAtrrs, typeof i18n[Locale]>(
  {
    name: 'ColumnEdit',
    items: [
      { name: 'name', label: 'name', type: 'input' },
      { name: 'required', label: 'required', type: 'checkbox' },
      { name: 'unique', label: 'unique', type: 'checkbox' },
    ],
  },
  i18n
);

export function ColumnEditForm(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  return (
    <ColumnEditFormInner
      title={content.editColumn}
      data={props.column}
      onCancel={props.onCancel}
      onSubmit={(data) => {
        props.onSubmit({ ...{ id: props.column.id }, ...data });
      }}
    />
  );
}
