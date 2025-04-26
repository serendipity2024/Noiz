import React from 'react';
import { createForm, sqlKeywordValidator } from './SchemaForm';
import { ColumnTypes, ColumnMetadata } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import i18n from './ColumnForm.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export type ColumnCreation = Omit<ColumnMetadata, 'id'>;

export interface Props {
  onSubmit(data: ColumnCreation): void;
  onCancel(): void;
}

const typeOptions = ColumnTypes.map((t) => ({ label: t, value: t }));

const ColumnCreateFormInner = createForm<ColumnCreation, typeof i18n[Locale]>(
  {
    name: 'ColumnCreate',
    items: [
      {
        name: 'name',
        label: 'name',
        type: 'input',
        autoFocus: true,
        required: true,
        validator: sqlKeywordValidator,
      },
      { name: 'type', label: 'type', type: 'select', options: typeOptions, required: true },
      { name: 'required', label: 'required', type: 'checkbox' },
      { name: 'unique', label: 'unique', type: 'checkbox' },
    ],
  },
  i18n
);

export function ColumnCreateForm(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  return (
    <ColumnCreateFormInner
      title={content.addColumn}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    />
  );
}
