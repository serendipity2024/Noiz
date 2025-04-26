/* eslint-disable import/no-default-export */
import { DataBinding } from './DataBinding';

export interface MutationObjColumn {
  column: string;
  value: DataBinding;
}

export interface MutationObj {
  table: string;
  operation: 'insert' | 'update' | 'upsert' | 'delete';
  columns: MutationObjColumn[];
  where?: any;
}