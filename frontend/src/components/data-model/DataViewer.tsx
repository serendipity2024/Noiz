import React, { ReactElement } from 'react';
import { TableMetadata } from '../../shared/type-definition/DataModel';

export interface Props {
  table: TableMetadata;
}

export function DataViewer(props: Props): ReactElement {
  return (
    <div>
      <h3>{props.table.name}</h3>
    </div>
  );
}
