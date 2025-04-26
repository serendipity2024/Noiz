import React, { useState } from 'react';
import { TableFilterExp, ColumnFilterExp } from '../../shared/type-definition/TableFilterExp';
import { AndExp } from '../../shared/type-definition/BoolExp';
import {
  ApiDefinition,
  DELETE,
  INSERT,
  SELECT,
  TableMetadata,
  UPDATE,
  USER_ROLE,
} from '../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import TablePermissionFilterEdit from './TablePermissionFilterEdit';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import { PredefinedTableName, ZColors } from '../../utils/ZConst';
import { Checkbox, Radio } from '../../zui';
import cssModule from './TablePermissionEdit.module.scss';
import i18n from './TablePermissionEdit.i18n.json';
import useLocale, { Locale } from '../../hooks/useLocale';

export interface Props {
  table: TableMetadata;
  apiDefinition: ApiDefinition;
  constantColumnPermission: Record<string, Record<string, string>>;
  allOptions: string[];
  onColumnChange(newColumns: string[], operation: string): void;
  onFilterChange(newFilter: TableFilterExp[], operation: string): void;
  onCheckChange(newCheck: TableFilterExp[], operation: string): void;
}

export function TablePermissionEdit(props: Props): NullableReactElement {
  const {
    table,
    apiDefinition,
    constantColumnPermission,
    allOptions,
    onColumnChange,
    onFilterChange,
    onCheckChange,
  } = props;

  const [operation, setOperation] = useState<string>(SELECT);
  const { localizedContent: content, locale } = useLocale(i18n);

  let columns: string[] = [];
  switch (operation) {
    case INSERT: {
      columns =
        apiDefinition.insert?.columns === '*' ? allOptions : apiDefinition.insert?.columns ?? [];
      break;
    }
    case SELECT: {
      columns =
        apiDefinition.select?.columns === '*' ? allOptions : apiDefinition.select?.columns ?? [];
      break;
    }
    case UPDATE: {
      columns =
        apiDefinition.update?.columns === '*' ? allOptions : apiDefinition.update?.columns ?? [];
      break;
    }
    default:
      break;
  }

  let filters: TableFilterExp[] | undefined;
  switch (operation) {
    case SELECT:
      filters = (apiDefinition.select?.filter as AndExp<ColumnFilterExp>)?._and ?? [];
      break;
    case UPDATE:
      filters = (apiDefinition.update?.filter as AndExp<ColumnFilterExp>)?._and ?? [];
      break;
    case DELETE:
      filters = (apiDefinition.delete?.filter as AndExp<ColumnFilterExp>)?._and ?? [];
      break;
    default:
      break;
  }

  let checks: TableFilterExp[] | undefined;
  switch (operation) {
    case INSERT:
      checks = (apiDefinition.insert?.check as AndExp<ColumnFilterExp>)?._and ?? [];
      break;
    case UPDATE:
      checks = (apiDefinition.update?.check as AndExp<ColumnFilterExp>)?._and ?? [];
      break;
    default:
      break;
  }

  return (
    <div className={cssModule.mainContainer}>
      <Radio.Group
        defaultValue={operation}
        buttonStyle="solid"
        onChange={(e) => setOperation(e.target.value)}
      >
        {table.name !== PredefinedTableName.ACCOUNT && (
          <Radio.Button value={INSERT}>{INSERT}</Radio.Button>
        )}
        <Radio.Button value={SELECT}>{SELECT}</Radio.Button>
        <Radio.Button value={UPDATE}>{UPDATE}</Radio.Button>
        {table.name !== PredefinedTableName.ACCOUNT && (
          <Radio.Button value={DELETE}>{DELETE}</Radio.Button>
        )}
      </Radio.Group>

      {operation !== DELETE && (
        <>
          <ZConfigRowTitle
            text={
              locale === Locale.EN
                ? `${content.column} ${operation} ${content.permission}`
                : `${operation}${content.column}${content.permission}`
            }
          />
          <Checkbox.Group
            value={columns}
            style={styles.checkboxGroup}
            disabled={apiDefinition.role === USER_ROLE}
            onChange={(newValue) => onColumnChange(newValue as string[], operation)}
          >
            {allOptions.map((option) => (
              <Checkbox
                key={option}
                value={option}
                style={styles.checkbox}
                disabled={!!constantColumnPermission[operation][option]}
              >
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </>
      )}
      {apiDefinition.role !== USER_ROLE && (
        <div key={operation}>
          {filters && (
            <TablePermissionFilterEdit
              title="Filter"
              header={
                <ZConfigRowTitle
                  text={
                    locale === Locale.EN
                      ? `${content.row} ${operation} ${content.permission}`
                      : `${operation}${content.row}${content.permission}`
                  }
                />
              }
              tableName={table.name}
              filters={filters}
              onFilterChange={(newFilters) => onFilterChange(newFilters, operation)}
            />
          )}
          {checks && (
            <TablePermissionFilterEdit
              title="Check"
              tableName={table.name}
              filters={checks}
              onFilterChange={(newChecks) => onCheckChange(newChecks, operation)}
            />
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  checkboxGroup: {
    marginLeft: '5px',
  },
  checkbox: {
    marginLeft: '0px',
    marginRight: '10px',
    marginBottom: '5px',
    color: ZColors.WHITE,
  },
};
