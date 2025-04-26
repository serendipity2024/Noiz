import React from 'react';
import { VariableTable } from '../shared/type-definition/DataBinding';

export interface VariableContextData {
  // result data
  resultVariableRecord?: VariableTable;

  // request status
  requestStatusVariableRecord?: VariableTable;

  // action data
  actionDataVariableRecord?: VariableTable;
}

export const VariableContext = React.createContext<VariableContextData>({});
