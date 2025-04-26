import React, { useMemo, useState } from 'react';
import * as _ from 'lodash/fp';
import { isBasicType } from '../../shared/type-definition/DataBinding';
import {
  ApiDefinition,
  DELETE,
  INSERT,
  SELECT,
  TableMetadata,
  UPDATE,
} from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { TablePermissionEdit } from './TablePermissionEdit';
import { TableFilterExp } from '../../shared/type-definition/TableFilterExp';
import { Collapse, Modal, message } from '../../zui';
import styles from './TableEditForm.module.scss';
import i18n from './SideDataModelDesigner.i18n.json';
import useLocale from '../../hooks/useLocale';

export type EditingAttrs = Pick<TableMetadata, 'apiDefinitions'>;

export interface Props {
  table: TableMetadata;
  onSubmit(data: EditingAttrs): void;
  onCancel(): void;
}

export function TableEditForm(props: Props): NullableReactElement {
  const { table, onCancel, onSubmit } = props;
  const { localizedContent: content } = useLocale(i18n);

  const { constantColumnPermissions, allOptions } = useMemo(() => {
    const tempOptions = table.columnMetadata
      .filter((column) => !column.uiHidden && isBasicType(column.type))
      .map((column) => {
        return column.name;
      });
    const tempColumnPermission: Record<
      string,
      Record<string, Record<string, string>>
    > = Object.fromEntries(
      (table.apiDefinitions ?? []).map((definition) => [
        definition.role,
        {
          [INSERT]: Object.fromEntries(
            (definition.insert?.columns === '*'
              ? tempOptions
              : definition.insert?.columns ?? []
            ).map((column) => [column, column])
          ),
          [SELECT]: Object.fromEntries(
            (definition.select?.columns === '*'
              ? tempOptions
              : definition.select?.columns ?? []
            ).map((column) => [column, column])
          ),
          [UPDATE]: Object.fromEntries(
            (definition.update?.columns === '*'
              ? tempOptions
              : definition.update?.columns ?? []
            ).map((column) => [column, column])
          ),
        },
      ])
    );
    return { constantColumnPermissions: tempColumnPermission, allOptions: tempOptions };
  }, [table]);

  const [apiDefinitions, setApiDefinitions] = useState<ApiDefinition[]>(
    _.cloneDeep(table.apiDefinitions) ?? []
  );

  function onOk() {
    table.apiDefinitions = apiDefinitions;
    onSubmit(table);
    message.success('successfully changed table apiDefinitions!');
  }

  function onColumnChange(newValue: string[], operation: string, role: string) {
    setApiDefinitions(
      apiDefinitions.map((e) => {
        switch (operation) {
          case INSERT: {
            if (e.insert && e.role === role) {
              e.insert.columns = newValue as string[];
            }
            break;
          }
          case SELECT: {
            if (e.select && e.role === role) {
              e.select.columns = newValue as string[];
            }
            break;
          }
          case UPDATE: {
            if (e.update && e.role === role) {
              e.update.columns = newValue as string[];
            }
            break;
          }
          default:
            break;
        }
        return e;
      })
    );
  }

  function onFilterChange(newFilter: TableFilterExp[], operation: string, role: string) {
    setApiDefinitions(
      apiDefinitions.map((e) => {
        switch (operation) {
          case SELECT: {
            if (e.select && e.role === role) {
              e.select.filter = { _and: newFilter };
            }
            break;
          }
          case UPDATE: {
            if (e.update && e.role === role) {
              e.update.filter = { _and: newFilter };
            }
            break;
          }
          case DELETE: {
            if (e.delete && e.role === role) {
              e.delete.filter = { _and: newFilter };
            }
            break;
          }
          default:
            break;
        }
        return e;
      })
    );
  }

  function onCheckChange(newCheck: TableFilterExp[], operation: string, role: string) {
    setApiDefinitions(
      apiDefinitions.map((e) => {
        switch (operation) {
          case INSERT: {
            if (e.insert && e.role === role) {
              e.insert.check = { _and: newCheck };
            }
            break;
          }
          case UPDATE: {
            if (e.update && e.role === role) {
              e.update.check = { _and: newCheck };
            }
            break;
          }
          default:
            break;
        }
        return e;
      })
    );
  }

  return (
    <Modal
      className={styles.mainContainer}
      title={content.button.editPermission}
      visible
      onCancel={onCancel}
      onOk={onOk}
    >
      <Collapse
        defaultOpenIndex={0}
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={apiDefinitions.map((definition) => ({
          title: definition.role,
          content: (
            <TablePermissionEdit
              table={table}
              apiDefinition={definition}
              constantColumnPermission={constantColumnPermissions[definition.role]}
              allOptions={allOptions}
              onColumnChange={(newColumns, operation) =>
                onColumnChange(newColumns, operation, definition.role)
              }
              onFilterChange={(newFilter, operation) => {
                onFilterChange(newFilter, operation, definition.role);
              }}
              onCheckChange={(newCheck, operation) => {
                onCheckChange(newCheck, operation, definition.role);
              }}
            />
          ),
        }))}
      />
    </Modal>
  );
}
