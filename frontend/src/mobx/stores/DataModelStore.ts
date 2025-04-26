import VALIDATE_LEGAL_TABLE_NAME from '../../graphQL/table';
import {
  ApiDefinition,
  ColumnMetadata,
  ConstraintMetadata,
  RelationMetadata,
  TableCreation,
  TableMetadata,
} from '../../shared/type-definition/DataModel';
import { DataModelMutations } from '../mutations/DataModelMutations';
import { AllStores } from '../StoreContexts';

export interface RelationTableInfo {
  index: number;
  tableName: string;
  relations: RelationMetadata[];
}

export interface SelectedTableInfo {
  index: number;
  tableName: string;
}

export interface DataModelUmlView {
  selectedTableInfo: SelectedTableInfo;
  leftRelationTableList: RelationTableInfo[];
  rightRelationTableList: RelationTableInfo[];
  tableMetadata: TableMetadata[];
}

export class DataModelStore {
  public createTable(table: TableCreation, dataModelMutations: DataModelMutations): Promise<void> {
    return new Promise((resolve, reject) => {
      const { sessionStore, coreStore } = AllStores;
      sessionStore.clientForSession
        .query({
          query: VALIDATE_LEGAL_TABLE_NAME,
          variables: {
            tableName: table.displayName,
            existTableSet: coreStore.dataModel.tableMetadata.map((tmd) => tmd.name),
          },
        })
        .then((result) => {
          if (result.data?.validateLegalTableName) {
            dataModelMutations.addDataModel(table);
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createColumn(
    column: ColumnMetadata,
    selectedTableMetadata: TableMetadata,
    dataModelMutations: DataModelMutations
  ): void {
    dataModelMutations.addDataModelColumn(selectedTableMetadata.name, column);
  }

  public createRelation(relation: RelationMetadata, dataModelMutations: DataModelMutations): void {
    dataModelMutations.addDataModelRelation(relation);
  }

  public updateTableApiDefinitions(
    apiDefinitions: ApiDefinition[],
    selectedTableMetadata: TableMetadata,
    dataModelMutations: DataModelMutations
  ): void {
    dataModelMutations.updateDataModel({
      ...selectedTableMetadata,
      apiDefinitions,
    });
  }

  public updateTableConstraintMetadata(
    constraints: ConstraintMetadata[],
    selectedTableMetadata: TableMetadata,
    dataModelMutations: DataModelMutations
  ): void {
    dataModelMutations.updateDataModel({
      ...selectedTableMetadata,
      constraintMetadata: constraints,
    });
  }

  public genDataModelUmlView = (
    selectedTableName: string,
    tableMetadata: TableMetadata[]
  ): DataModelUmlView => {
    const { coreStore } = AllStores;
    let selectedObjectIndex = 0;
    tableMetadata.forEach((table, idx) => {
      if (table.name === selectedTableName) {
        selectedObjectIndex = idx;
      }
    });
    const selectedTableMetadata: TableMetadata = tableMetadata[selectedObjectIndex];
    const dataModelUmlInfo: DataModelUmlView = {
      selectedTableInfo: {
        index: selectedObjectIndex,
        tableName: selectedTableMetadata.name,
      },
      leftRelationTableList: [],
      rightRelationTableList: [],
      tableMetadata: [],
    };

    const selectedTableRelationRecord: Record<string, RelationMetadata[]> = {};
    coreStore.dataModel.relationMetadata.forEach((relation) => {
      if (relation.sourceTable === selectedTableMetadata.name) {
        const relations = selectedTableRelationRecord[relation.targetTable] || [];
        selectedTableRelationRecord[relation.targetTable] = [...relations, relation];
      }
      if (relation.targetTable === selectedTableMetadata.name) {
        const relations = selectedTableRelationRecord[relation.targetTable] || [];
        selectedTableRelationRecord[relation.sourceTable] = [...relations, relation];
      }
    });

    const leftNormalTableMetadata: TableMetadata[] = [];
    const leftRelationTableMetadata: TableMetadata[] = [];
    for (let index = 0; index < selectedObjectIndex; index++) {
      const table: TableMetadata = tableMetadata[index];
      const relation = selectedTableRelationRecord[table.name];
      if (relation) {
        leftRelationTableMetadata.push(table);
      } else {
        leftNormalTableMetadata.push(table);
      }
    }
    dataModelUmlInfo.leftRelationTableList = leftRelationTableMetadata.map((table, idx) => ({
      index: leftNormalTableMetadata.length + idx,
      tableName: table.name,
      relations: selectedTableRelationRecord[table.name],
    }));

    const rightNormalTableMetadata: TableMetadata[] = [];
    const rightRelationTableMetadata: TableMetadata[] = [];
    for (let index = selectedObjectIndex + 1; index < tableMetadata.length; index++) {
      const table: TableMetadata = tableMetadata[index];
      const relation = selectedTableRelationRecord[table.name];
      if (relation) {
        rightRelationTableMetadata.push(table);
      } else {
        rightNormalTableMetadata.push(table);
      }
    }
    dataModelUmlInfo.rightRelationTableList = rightRelationTableMetadata.map((table, idx) => ({
      index: leftNormalTableMetadata.length + leftRelationTableMetadata.length + 1 + idx,
      tableName: table.name,
      relations: selectedTableRelationRecord[table.name],
    }));

    dataModelUmlInfo.tableMetadata = [
      ...leftNormalTableMetadata,
      ...leftRelationTableMetadata,
      selectedTableMetadata,
      ...rightRelationTableMetadata,
      ...rightNormalTableMetadata,
    ];
    return dataModelUmlInfo;
  };
}
