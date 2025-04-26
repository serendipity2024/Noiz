import React from 'react';
import { TableMetadata, RelationMetadata } from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { createForm } from './SchemaForm';

import i18n from './RelationForm.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export type EditingRelation = Pick<RelationMetadata, 'id' | 'nameInSource'>;

export interface Props {
  table: TableMetadata;
  relation: RelationMetadata;
  onSubmit(data: EditingRelation): void;
  onCancel(): void;
}

const RelationEditFormInner = createForm<EditingRelation, typeof i18n[Locale]>(
  {
    name: 'RelationEdit',
    items: [{ name: 'name', label: 'name', type: 'input' }],
  },
  i18n
);

export function RelationEditForm(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  return (
    <RelationEditFormInner
      title={content.editRelation}
      data={props.relation}
      onCancel={props.onCancel}
      onSubmit={(data) => {
        props.onSubmit({ ...{ id: props.relation.id }, ...data });
      }}
    />
  );
}
