/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';
import {
  ARRAY_TYPE,
  CREATED_AT,
  DataModel,
  ID,
  RelationMetadata,
  RelationType,
  TableMetadata,
  UPDATED_AT,
  LocationType,
  AdministrationAreaInformationPrefix,
} from './DataModel';

export interface Field {
  name: string;
  type: string;
  itemType?: string; // mark item type when type === ARRAY_TYPE
  operation?: 'insert' | 'upsert' | 'update' | 'delete';
  nullable: boolean;
  object?: Field[];
  where?: Field[];
  isRelation?: boolean;
}

export interface GraphQLModel {
  name: string;
  description?: string;
  fields: Field[];
}

export class DataModelRegistry {
  private map = new Map<string, GraphQLModel>();

  private registerModelFinished = false;

  private dataModel: DataModel = {
    tableMetadata: [],
    relationMetadata: [],
  };

  constructor(dataModel: DataModel) {
    this.dataModel = dataModel;
    this.map.set('Query', {
      name: 'Query',
      description: 'root query',
      fields: [],
    });
    this.map.set('Mutation', {
      name: 'Mutation',
      description: 'root Mutation',
      fields: [],
    });
  }

  public getGraphQLModel(name: string) {
    this.registerModels();
    return this.map.get(name);
  }

  public getQueries() {
    this.registerModels();
    return this.map.get('Query')!.fields;
  }

  public getMutations() {
    this.registerModels();
    return this.map.get('Mutation')!.fields;
  }

  private registerModels() {
    if (this.registerModelFinished === true) return;
    this.dataModel.tableMetadata.forEach((s) =>
      this.registerModel(s, this.dataModel.relationMetadata)
    );
    this.registerModelFinished = true;
  }

  private registerModel(table: TableMetadata, relations: RelationMetadata[]) {
    const graphQLModel: GraphQLModel = {
      name: table.name,
      description: table.description,
      fields: DataModelRegistry.fetchTableFields(table, relations),
    };
    this.map.set(table.name, graphQLModel);
    const objectFields = this.convertFieldsToInputs(graphQLModel.fields);
    const whereFields = graphQLModel.fields;
    this.addRootQuery({
      name: _.camelCase(table.name),
      type: table.name,
      nullable: true,
      where: whereFields,
    });
    this.addRootQuery({
      name: `${_.camelCase(table.name)}List`,
      type: ARRAY_TYPE,
      itemType: table.name,
      where: whereFields,
      nullable: false,
    });

    const isView = table.isView ?? false;
    if (isView) return this;

    const writableForAdminOnly = table.writableForAdminOnly ?? false;
    if (writableForAdminOnly) return this;

    const modelUpperName = _.upperFirst(table.name);
    this.addMutation({
      name: `delete${modelUpperName}`,
      type: table.name,
      operation: 'delete',
      where: whereFields,
      nullable: false,
    });
    this.addMutation({
      name: `insert${modelUpperName}`,
      type: table.name,
      operation: 'insert',
      object: objectFields,
      nullable: false,
    });
    this.addMutation({
      name: `update${modelUpperName}`,
      type: table.name,
      operation: 'update',
      object: objectFields,
      where: whereFields,
      nullable: false,
    });
    return this;
  }

  public convertFieldsToInputs(fields: Field[]): Field[] {
    return fields.filter((field) => {
      if (field.name === ID || field.name === CREATED_AT || field.name === UPDATED_AT) {
        return false;
      }
      if (field.isRelation && field.type !== ARRAY_TYPE) {
        return false;
      }
      return true;
    });
  }

  private static convertTableToFields(
    table: TableMetadata,
    relations: RelationMetadata[]
  ): Field[] {
    return table.columnMetadata
      .filter((column) => {
        // 获取relation在target方向上产生的key
        const currentRelation = relations.find(
          (relation) => relation.targetColumn === column.name && relation.targetTable === table.name
        );
        if (currentRelation) {
          return true;
        }
        return !column.uiHidden;
      })
      .flatMap((column) => {
        if (column.type === LocationType.GEO_POINT) {
          return [
            {
              name: column.name,
              type: column.type,
              nullable: !column.required,
            } as Field,
            {
              name: `${AdministrationAreaInformationPrefix}${column.name}`,
              type: `${AdministrationAreaInformationPrefix}${column.name}`,
              nullable: true,
            },
          ];
        }
        return [
          {
            name: column.name,
            type: column.type,
            nullable: !column.required,
          },
        ];
      });
  }

  private static convertRelationsToFields(
    table: TableMetadata,
    relations: RelationMetadata[]
  ): Field[] {
    const sourceFields = relations
      .filter((relation) => relation.sourceTable === table.name)
      .map((relation) => {
        switch (relation.type) {
          case RelationType.ONE_TO_ONE: {
            if (relation.sourceTable === table.name) {
              return {
                name: relation.nameInSource,
                type: relation.targetTable,
                nullable: true,
                isRelation: true,
              };
            }
            throw new Error('unsupported relation');
          }
          case RelationType.ONE_TO_MANY:
          case RelationType.MANY_TO_MANY: {
            if (relation.sourceTable === table.name) {
              return {
                name: relation.nameInSource,
                type: ARRAY_TYPE,
                itemType: relation.targetTable,
                nullable: true,
                isRelation: true,
              };
            }
            throw new Error('unsupported relation');
          }
          default:
            throw new Error('unsupported relation');
        }
      });
    const targetFields = relations
      .filter((relation) => relation.targetTable === table.name)
      .map((relation) => {
        switch (relation.type) {
          case RelationType.ONE_TO_ONE:
          case RelationType.ONE_TO_MANY: {
            if (relation.targetTable === table.name) {
              return {
                name: relation.nameInTarget,
                type: relation.sourceTable,
                nullable: true,
                isRelation: true,
              };
            }
            throw new Error('unsupported relation');
          }
          case RelationType.MANY_TO_MANY: {
            if (relation.targetTable === table.name) {
              return {
                name: relation.nameInTarget,
                type: ARRAY_TYPE,
                itemType: relation.sourceTable,
                nullable: true,
                isRelation: true,
              };
            }
            throw new Error('unsupported relation');
          }
          default:
            throw new Error('unsupported relation');
        }
      });
    return [...sourceFields, ...targetFields];
  }

  private addRootQuery(filed: Field) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.map.get('Query')!.fields.push(filed);
  }

  private addMutation(filed: Field) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.map.get('Mutation')!.fields.push(filed);
  }

  public static fetchTableFields(table: TableMetadata, relations: RelationMetadata[]): Field[] {
    return [
      ...DataModelRegistry.convertTableToFields(table, relations),
      ...DataModelRegistry.convertRelationsToFields(table, relations),
    ];
  }
}
