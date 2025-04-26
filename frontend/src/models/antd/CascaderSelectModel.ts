/* eslint-disable import/no-default-export */
import { CascaderOptionType } from 'antd/lib/cascader';

export interface CascaderSelectModel extends CascaderOptionType {
  type?: string;
  itemType?: string;
  children?: CascaderSelectModel[];
}