import { VariableTable } from './DataBinding';

export interface ActionFlow {
  schemaVersion: '1';
  versionId: number;
  displayName: string;
  uniqueId: string;
  inputArgs: VariableTable;
  outputValues: VariableTable;
  startNodeId: string;
  allNodes: Array<ActionFlowNode>;
}

export type ActionFlowNode = FlowEnd | RunCustomCode;

export enum ActionFlowNodeType {
  FLOW_END = 'FLOW_END',
  CUSTOM_CODE = 'CUSTOM_CODE',
}

export interface FlowEnd {
  type: ActionFlowNodeType.FLOW_END;
  uniqueId: string;
}

export interface RunCustomCode {
  type: ActionFlowNodeType.CUSTOM_CODE;
  uniqueId: string;
  inputArgs: VariableTable;
  outputValues: VariableTable;
  code: string;
  andThenNodeId: string;
}
