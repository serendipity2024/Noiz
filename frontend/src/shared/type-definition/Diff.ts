/* eslint-disable import/no-default-export */
import { ShortId } from './ZTypes';

export interface DiffPathComponent {
  name: string;
  type: string;
}

export interface DiffItem {
  path: string[];
  value1: any;
  value2: any;
}

export interface ArrayDiffItem {
  path: string[];
  index: number;
  items: any[];
  type: 'add' | 'remove';
}

export interface Diff {
  id: string;
  dataSource: (DiffItem | ArrayDiffItem)[];
}