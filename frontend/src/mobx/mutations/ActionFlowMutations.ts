import update from 'immutability-helper';
import { SchemaMutator } from './SchemaMutator';
import { ActionFlow, ActionFlowNodeType } from '../../shared/type-definition/ActionFlow';
import { VariableTable } from '../../shared/type-definition/DataBinding';
import { uuidV4 } from '../../utils/StringUtils';

export class ActionFlowMutations {
  constructor(private mutator: SchemaMutator) {}

  public addActionFlow(): void {
    const customNodeId = uuidV4();
    const flowEndId = uuidV4();
    const actionFlow = {
      schemaVersion: '1',
      displayName: `actionflow${uuidV4()}`,
      uniqueId: uuidV4(),
      versionId: 1,
      inputArgs: {},
      outputValues: {},
      startNodeId: customNodeId,
      allNodes: [
        {
          type: ActionFlowNodeType.CUSTOM_CODE,
          code: '',
          uniqueId: customNodeId,
          inputArgs: {},
          outputValues: {},
          andThenNodeId: flowEndId,
        },
        {
          type: ActionFlowNodeType.FLOW_END,
          uniqueId: flowEndId,
        },
      ],
    } as ActionFlow;
    this.applyActionFlowUpdate({ $push: [actionFlow] });
  }

  public deleteActionFlow(uniqueId: string): void {
    this.applyActionFlowUpdate({
      $apply: (actionFlows: ActionFlow[]) => actionFlows.filter((a) => a.uniqueId !== uniqueId),
    });
  }

  public updateActionFlow(block: ActionFlow): void {
    this.updateForUniqueId(block.uniqueId, () => block);
  }

  public updateVariableType(
    blockUniqueId: string,
    variable: VariableTable,
    key: 'inputArgs' | 'outputValues'
  ): void {
    this.updateForUniqueId(blockUniqueId, (block) =>
      update(block, {
        [key]: { $set: variable },
        allNodes: {
          0: { [key]: { $set: variable } },
        },
      })
    );
  }

  public updateLogicCode(blockUniqueId: string, code: string): void {
    this.updateForUniqueId(blockUniqueId, (block) =>
      update(block, {
        allNodes: {
          0: {
            code: { $set: code },
          },
        },
      })
    );
  }

  private updateForUniqueId<T>(uniqueId: string, transform: (original: ActionFlow) => ActionFlow) {
    this.applyActionFlowUpdate({
      $apply: (actionFlows: ActionFlow[]) =>
        actionFlows.map((actionFlow) => {
          if (actionFlow.uniqueId === uniqueId) {
            return update(transform(actionFlow), {
              versionId: {
                $set: actionFlow.versionId + 1,
              },
            });
          }
          return actionFlow;
        }),
    });
  }

  private applyActionFlowUpdate<T>(updateObj: T) {
    this.mutator.applyUpdate({ actionFlows: updateObj });
  }
}
