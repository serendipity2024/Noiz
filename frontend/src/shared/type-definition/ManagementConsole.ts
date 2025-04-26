import uniqid from 'uniqid';
import { DataBinding } from './DataBinding';
import {
  AdministrationAreaInformationPrefix,
  PredefinedDistanceColumnNamePrefix,
  DataModel,
} from './DataModel';
import { DataModelRegistry, Field, GraphQLModel } from './DataModelRegistry';
import { ColumnValueExp } from './TableFilterExp';
import { ShortId } from './ZTypes';

export interface ManagementConsoleConfig {
  userRoles: string[];
  menuItems: PrimaryMenuItem[];
  objects: ObjectViewConfig[];
}

export interface PrimaryMenuItem {
  id: ShortId;
  displayName: string;
  subItems: SecondaryMenuItem[];
}

export interface SecondaryMenuItem {
  id: ShortId;
  displayName: string;
  dataSource: SourceDataModel;
  displayColumns: ColumnModel[];
  filters: ColumnValueExp[];
  actions: ManagementConsoleAction[];
}

export interface ObjectViewConfig {
  objectType: SourceDataModel;
  displayColumns: ColumnModel[];
  actions: ManagementConsoleAction[];
}

export interface SourceDataModel {
  table: string;
  displayText: string;
  permissions: Record<string, 'READ' | 'WRITE'>;
}

export enum ManagementConsoleActionType {
  DELETE_OBJECTS = 'DELETE_OBJECTS',
  UPDATE_OBJECTS = 'UPDATE_OBJECTS',
  CREATE_OBJECT = 'CREATE_OBJECT',
}

export interface ManagementConsoleAction {
  id: ShortId;
  displayName: string;
  actionType: ManagementConsoleActionType;
  needsExplicitTarget: boolean;
  permittedRoles: string[];
}

export interface ColumnModel {
  fieldName: string;
  displayName: string;
  type: string;
  itemType?: string;
  isRelation: boolean;
  nullable: boolean;
  isHidden: boolean;
  contentDataBinding?: DataBinding;
  sourceTable?: string;
}

export const genManagementConsoleMenuItems = (
  dataModel: DataModel,
  mcConfiguration: ManagementConsoleConfig
): PrimaryMenuItem[] => {
  const dataModelRegistry = new DataModelRegistry(dataModel);
  const menuRecord = Object.fromEntries(
    mcConfiguration.menuItems.map((item) => [item.displayName, item])
  );
  return dataModel.tableMetadata
    .filter((table) => !table.isView && !table.writableForAdminOnly)
    .map((table) => {
      const menuItem = menuRecord[table.name];
      const graphQLModel = dataModelRegistry.getGraphQLModel(table.name);
      if (menuItem) {
        return {
          ...menuItem,
          subItems: menuItem.subItems.map((smi) => ({
            ...smi,
            displayColumns: genCurrentDisplayColumns(smi.displayColumns, graphQLModel),
          })),
        };
      }
      return {
        id: uniqid.process(),
        displayName: table.name,
        subItems: [
          {
            id: uniqid.process(),
            displayName: table.name,
            dataSource: {
              table: table.name,
              displayText: table.name,
              permissions: {},
            },
            filters: [],
            displayColumns: genCurrentDisplayColumns([], graphQLModel),
            actions: [],
          },
        ],
      } as PrimaryMenuItem;
    });
};

export const genManagementConsoleObjects = (
  dataModel: DataModel,
  mcConfiguration: ManagementConsoleConfig
): ObjectViewConfig[] => {
  const dataModelRegistry = new DataModelRegistry(dataModel);
  const dataModelObjectRecord = Object.fromEntries(
    mcConfiguration.objects.map((obj) => [obj.objectType.table, obj])
  );
  return dataModel.tableMetadata
    .filter((table) => !table.isView && !table.writableForAdminOnly)
    .map((table) => {
      const obj = dataModelObjectRecord[table.name];
      const graphQLModel = dataModelRegistry.getGraphQLModel(table.name);
      if (obj) {
        return {
          ...obj,
          displayColumns: genCurrentDisplayColumns(obj.displayColumns, graphQLModel),
        };
      }
      return {
        objectType: {
          table: table.name,
          displayText: table.name,
          permissions: {},
        },
        actions: [],
        displayColumns: genCurrentDisplayColumns([], graphQLModel),
      } as ObjectViewConfig;
    });
};

// This is a hack. For geo point types, we generate another fz_administration_info field
// but it is not present when the front end tries to request it from Hasura.
// geo point also generated a field fz_distance_from_ field which is also a hack.
//  We filter them out here.
export const filterGeoPointHackField = (field: Field): boolean => {
  return !(
    field.type.includes(AdministrationAreaInformationPrefix) ||
    field.name.includes(PredefinedDistanceColumnNamePrefix)
  );
};

export const genCurrentDisplayColumns = (
  displayColumns: ColumnModel[],
  graphQLModel?: GraphQLModel
): ColumnModel[] => {
  const columnRecord: Record<string, ColumnModel> = Object.fromEntries(
    displayColumns.map((cl) => [cl.fieldName, cl])
  );
  return (
    graphQLModel?.fields.filter(filterGeoPointHackField).map((field) => {
      const currentColumn = columnRecord[field.name];
      return (
        currentColumn || {
          fieldName: field.name,
          displayName: field.name,
          type: field.type,
          itemType: field.itemType,
          nullable: field.nullable,
          isHidden: false,
          isRelation: field.isRelation ?? false,
        }
      );
    }) ?? []
  );
};
