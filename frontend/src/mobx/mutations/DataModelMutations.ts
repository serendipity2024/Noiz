import { message } from 'antd';
import {
  ColumnMetadata,
  ID,
  IntegerType,
  RelationMetadata,
  RelationType,
  TableCreation,
  TableMetadata,
  TimeType,
  DecimalType,
  LocationType,
  JsonType,
  PredefinedDistanceColumnNamePrefix,
} from '../../shared/type-definition/DataModel';
import { SchemaMutator } from './SchemaMutator';
import StringUtils, { uuidV4 } from '../../utils/StringUtils';
import { alwaysTrueFilter } from '../../shared/type-definition/TableFilterExp';
import ZArrayUtils from '../../utils/ZArrayUtils';
import { DataModelRegistry, Field } from '../../shared/type-definition/DataModelRegistry';

export class DataModelMutations {
  constructor(private mutator: SchemaMutator) {}

  public addDataModel(creation: TableCreation): void {
    const isExisting = !!this.mutator.coreStore.dataModel.tableMetadata.find(
      (tmd) => tmd.name === creation.displayName
    );
    if (isExisting) {
      message.error('table name can not repeat');
      return;
    }
    const schema: TableMetadata = {
      name: creation.displayName,
      displayName: creation.displayName,
      description: creation.description,
      schemaModifiable: true,
      columnMetadata: [
        {
          id: uuidV4(),
          name: 'id',
          type: IntegerType.BIGSERIAL,
          primaryKey: true,
          required: true,
          unique: true,
          uiHidden: false,
          systemDefined: true,
        },
        {
          id: uuidV4(),
          name: 'trigger_arg',
          type: JsonType.JSONB,
          primaryKey: false,
          required: false,
          unique: false,
          uiHidden: true,
          systemDefined: true,
        },
      ],
      constraintMetadata: [],
      apiDefinitions: [
        {
          role: 'user',
          insert: {
            check: alwaysTrueFilter,
            columns: '*',
          },
          select: {
            columns: '*',
            filter: alwaysTrueFilter,
            allow_aggregations: true,
          },
          update: {
            columns: '*',
            filter: alwaysTrueFilter,
          },
          delete: {
            filter: alwaysTrueFilter,
          },
        },
        {
          role: 'self',
          insert: {
            check: alwaysTrueFilter,
            columns: [ID],
          },
          select: {
            columns: [ID],
            filter: alwaysTrueFilter,
            allow_aggregations: true,
          },
          update: {
            columns: [ID],
            filter: alwaysTrueFilter,
          },
          delete: {
            filter: alwaysTrueFilter,
          },
        },
      ],
    };
    if (creation.createdAt) {
      schema.columnMetadata.push({
        id: uuidV4(),
        name: 'created_at',
        type: TimeType.TIMESTAMPTZ,
        primaryKey: false,
        required: false,
        unique: false,
        uiHidden: false,
        systemDefined: true,
      });
    }
    if (creation.updatedAt) {
      schema.columnMetadata.push({
        id: uuidV4(),
        name: 'updated_at',
        type: TimeType.TIMESTAMPTZ,
        primaryKey: false,
        required: false,
        unique: false,
        uiHidden: false,
        systemDefined: true,
      });
    }
    this.mutator.applyUpdate({
      dataModel: { tableMetadata: { $push: [schema] } },
    });
  }

  public updateDataModel(schema: TableMetadata): void {
    const tableNameExists = this.mutator.coreStore.dataModel.tableMetadata.find(
      (table) => table.displayName === schema.displayName && table.name !== schema.name
    );
    if (tableNameExists) {
      message.error('name already exists');
      return;
    }
    const updateIndex = this.mutator.coreStore.dataModel.tableMetadata.findIndex(
      (item) => item.name === schema.name
    );
    if (updateIndex >= 0) {
      this.mutator.applyUpdate({
        dataModel: { tableMetadata: { [updateIndex]: { $set: schema } } },
      });
    }
  }

  public removeDataModel(schemaName: string): void {
    const deleteIndex = this.mutator.coreStore.dataModel.tableMetadata.findIndex(
      (item) => item.name === schemaName
    );
    if (deleteIndex >= 0) {
      this.mutator.applyUpdate({
        dataModel: { tableMetadata: { $splice: [[deleteIndex, 1]] } },
      });
    }
  }

  public addDataModelColumn(schemaName: string, column: Omit<ColumnMetadata, 'id'>): void {
    if (!StringUtils.isValid(column.name)) {
      message.error('column name is illegal');
      return;
    }
    const itemAndIndex = ZArrayUtils.findItemAndIndex({
      array: this.mutator.coreStore.dataModel.tableMetadata,
      filter: (item) => item.name === schemaName,
    });
    if (!itemAndIndex) return;

    const targetFields = DataModelRegistry.fetchTableFields(
      itemAndIndex.item,
      this.mutator.coreStore.dataModel.relationMetadata
    );
    const columnNameRecord: Record<string, string> = {};
    itemAndIndex.item.columnMetadata.forEach((cmd) => {
      columnNameRecord[cmd.name] = cmd.name;
    });
    targetFields.forEach((field) => {
      columnNameRecord[field.name] = field.name;
    });
    const equalColumn = !!columnNameRecord[column.name];
    if (equalColumn) {
      message.error('schemaName column can not repeat');
      return;
    }

    const hackDistanceColumn: ColumnMetadata = {
      id: uuidV4(),
      type: DecimalType.FLOAT8,
      name: `${PredefinedDistanceColumnNamePrefix}${column.name}`,
      primaryKey: false,
      required: false,
      unique: false,
      uiHidden: false,
      systemDefined: true,
    };

    const newCols: ColumnMetadata[] = [
      {
        ...column,
        id: uuidV4(),
        primaryKey: false,
        required: column.required ?? false,
        unique: column.unique ?? false,
        uiHidden: false,
        systemDefined: false,
      },
    ];
    if (column.type === LocationType.GEO_POINT) {
      newCols.push(hackDistanceColumn);
    }
    this.mutator.applyUpdate({
      dataModel: {
        tableMetadata: {
          [itemAndIndex.index]: {
            columnMetadata: {
              $push: newCols,
            },
          },
        },
      },
    });
  }

  public updateDataModelColumn(
    schemaName: string,
    column: Pick<ColumnMetadata, 'id'> & Partial<ColumnMetadata>
  ): void {
    const itemAndIndex = ZArrayUtils.findItemAndIndex({
      array: this.mutator.coreStore.dataModel.tableMetadata,
      filter: (item) => item.name === schemaName,
    });
    if (!itemAndIndex) return;

    const columnIndex = itemAndIndex.item.columnMetadata.findIndex((item) => item.id === column.id);

    this.mutator.applyUpdate({
      dataModel: {
        tableMetadata: {
          [itemAndIndex.index]: { columnMetadata: { [columnIndex]: { $set: column } } },
        },
      },
    });
  }

  public removeDataModelColumn(schemaName: string, columnId: string): void {
    const itemAndIndex = ZArrayUtils.findItemAndIndex({
      array: this.mutator.coreStore.dataModel.tableMetadata,
      filter: (item) => item.name === schemaName,
    });
    if (!itemAndIndex) return;

    this.mutator.applyUpdate(this.getDeleteColumnUpdateById(itemAndIndex.index, columnId));
  }

  private getDeleteColumnUpdateById(tableIndex: number, columnId: string) {
    const filterFun = (cols: ColumnMetadata[]) => cols.filter((c) => c.id !== columnId);
    return {
      dataModel: { tableMetadata: { [tableIndex]: { columnMetadata: { $apply: filterFun } } } },
    };
  }

  public addDataModelRelation(relation: Omit<RelationMetadata, 'id' | 'targetColumn'>): void {
    if (
      !StringUtils.isValid(relation.nameInTarget) ||
      !StringUtils.isValid(relation.nameInSource)
    ) {
      message.error('relation name is illegal');
      return;
    }
    const targetTable: TableMetadata | undefined =
      this.mutator.coreStore.dataModel.tableMetadata.find((table) => {
        return table.name === relation.targetTable;
      });
    const sourceTable: TableMetadata | undefined =
      this.mutator.coreStore.dataModel.tableMetadata.find((table) => {
        return table.name === relation.sourceTable;
      });
    if (!targetTable || !sourceTable) {
      message.error('relation data invalid');
      return;
    }
    const targetField: Field[] = DataModelRegistry.fetchTableFields(
      targetTable,
      this.mutator.coreStore.dataModel.relationMetadata
    );
    const sourceField: Field[] = DataModelRegistry.fetchTableFields(
      sourceTable,
      this.mutator.coreStore.dataModel.relationMetadata
    );
    const targetColumn = `${relation.nameInTarget}_${relation.sourceTable}`;
    if (
      targetField.find((field) => {
        return field.name === targetColumn || field.name === relation.nameInTarget;
      }) ||
      sourceField.find((field) => {
        return field.name === relation.nameInSource;
      })
    ) {
      message.error('relation already exists');
      return;
    }
    const currentRelation = {
      ...relation,
      id: uuidV4(),
      targetColumn,
    };
    if (relation.type === RelationType.MANY_TO_MANY) {
      currentRelation.targetColumn = ID;
      currentRelation.sourceColumn = ID;
    }

    const relationUpdate = { dataModel: { relationMetadata: { $push: [currentRelation] } } };

    // MANY_TO_MANY 不需要添加column
    if (relation.type === RelationType.MANY_TO_MANY) {
      this.mutator.applyUpdate(relationUpdate);
      return;
    }

    const itemAndIndex = ZArrayUtils.findItemAndIndex({
      array: this.mutator.coreStore.dataModel.tableMetadata,
      filter: (table) =>
        table.name === relation.targetTable && relation.type !== RelationType.MANY_TO_MANY,
    });
    if (itemAndIndex) {
      this.mutator.applyUpdate({
        dataModel: {
          relationMetadata: relationUpdate.dataModel.relationMetadata,
          tableMetadata: {
            [itemAndIndex.index]: {
              columnMetadata: {
                $push: [
                  {
                    id: uuidV4(),
                    name: targetColumn,
                    type: IntegerType.BIGINT,
                    primaryKey: false,
                    required: false,
                    unique: relation.type === RelationType.ONE_TO_ONE,
                    uiHidden: false,
                    systemDefined: true,
                  },
                ],
              },
            },
          },
        },
      });
    }
  }

  public removeDataModelRelations(relations: RelationMetadata[]): void {
    const { relationMetadata, tableMetadata } = this.mutator.coreStore.dataModel;
    const relationDataList = relationMetadata.filter(
      (relation) => !relations.find((relationItem) => relationItem.id === relation.id)
    );
    const tableDataList = tableMetadata.map((table) => ({
      ...table,
      columnMetadata: table.columnMetadata.filter(
        (column) =>
          !relations.find(
            (relation) =>
              relation.targetTable === table.name &&
              relation.type !== RelationType.MANY_TO_MANY &&
              relation.targetColumn === column.name
          )
      ),
    }));

    this.mutator.applyUpdate({
      dataModel: {
        tableMetadata: {
          $set: tableDataList,
        },
        relationMetadata: {
          $set: relationDataList,
        },
      },
    });
  }

  public removeDataModelRelation(relation: RelationMetadata): void {
    let columnUpdate;
    const targetTable = ZArrayUtils.findItemAndIndex({
      array: this.mutator.coreStore.dataModel.tableMetadata,
      filter: (table) =>
        table.name === relation.targetTable && relation.type !== RelationType.MANY_TO_MANY,
    });
    if (targetTable) {
      const columnMetadata = targetTable.item.columnMetadata.find(
        (cm: ColumnMetadata) => cm.name === relation.targetColumn
      );
      if (columnMetadata) {
        columnUpdate = this.getDeleteColumnUpdateById(targetTable.index, columnMetadata.id);
      }
    }

    const targetRelationIndex = this.mutator.coreStore.dataModel.relationMetadata.findIndex(
      (item) => item.id === relation.id
    );

    if (columnUpdate && targetRelationIndex >= 0) {
      this.mutator.applyUpdate({
        dataModel: {
          tableMetadata: columnUpdate.dataModel.tableMetadata,
          relationMetadata: {
            $splice: [[targetRelationIndex, 1]],
          },
        },
      });
    }
  }
}
