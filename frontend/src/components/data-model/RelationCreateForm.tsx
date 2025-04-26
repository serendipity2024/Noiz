/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { createForm, sqlKeywordValidator } from './SchemaForm';
import {
  RelationTypes,
  RelationMetadata,
  RelationType,
} from '../../shared/type-definition/DataModel';
import i18n from './RelationForm.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export type RelationCreation = Omit<RelationMetadata, 'id'>;

export interface Props {
  schemaNames: string[];
  onSubmit(data: RelationCreation): void;
  onCancel(): void;
}

const typeOptions = RelationTypes.filter((t) => t !== RelationType.MANY_TO_MANY).map((t) => ({
  label: t,
  value: t,
}));

function createInnerForm(schemaNames: string[]) {
  return createForm<RelationCreation, typeof i18n[Locale]>(
    {
      name: 'RelationCreate',
      items: [
        {
          name: 'nameInSource',
          label: 'nameInSource',
          type: 'input',
          required: true,
          validator: sqlKeywordValidator,
        },
        { name: 'type', label: 'type', type: 'select', options: typeOptions, required: true },
        {
          name: 'nameInTarget',
          label: 'nameInTarget',
          type: 'input',
          required: true,
          validator: sqlKeywordValidator,
        },
        {
          name: 'targetTable',
          label: 'targetTable',
          type: 'select',
          options: schemaNames.map((t) => ({ label: t, value: t })),
          required: true,
        },
      ],
    },
    i18n
  );
}

export function RelationCreateForm(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const RelationCreateFormInner = createInnerForm(props.schemaNames);
  return (
    <RelationCreateFormInner
      title={content.addRelation}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    />
  );
}
