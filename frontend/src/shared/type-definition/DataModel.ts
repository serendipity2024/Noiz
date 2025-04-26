import { TableFilterExp } from './TableFilterExp';

export enum IdentityType {
  EXID = 'EXID',
}

export enum IntegerType {
  BIGSERIAL = 'BIGSERIAL',
  INTEGER = 'INTEGER',
  BIGINT = 'BIGINT',
}

export enum DecimalType {
  FLOAT8 = 'FLOAT8',
  DECIMAL = 'DECIMAL',
}

export enum TimeType {
  TIMESTAMPTZ = 'TIMESTAMPTZ',
  TIMETZ = 'TIMETZ',
  DATE = 'DATE',
}

export enum BaseType {
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
}

export enum JsonType {
  JSONB = 'JSONB',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  IMAGE_LIST = 'IMAGE_LIST',
  FILE = 'FILE',
}

export enum LocationType {
  GEO_POINT = 'GEO_POINT',
}

export enum RelationType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_MANY = 'MANY_TO_MANY',
}

export enum SwitchStyleType {
  SWITCH = 'SWITCH',
  TICK_CHECKBOX = 'TICK_CHECKBOX',
  ROUND_CHECKBOX = 'ROUND_CHECKBOX',
}

export const BITMAP = 'BITMAP';
export const LOCATION_INFO = 'LOCATION_INFO';
export const ARRAY_TYPE = 'array';

export const USER_ROLE = 'user';
export const SELF_ROLE = 'self';

export const ID = 'id';
export const CREATED_AT = 'created_at';
export const UPDATED_AT = 'updated_at';

export const INSERT = 'insert';
export const DELETE = 'delete';
export const UPDATE = 'update';
export const SELECT = 'select';

export type NumericType = IntegerType | DecimalType;

export type ColumnType = BaseType | JsonType | TimeType | NumericType | MediaType | LocationType;

export const DecimalTypes = Object.values(DecimalType);

export const IntegerTypes = Object.values(IntegerType);

export const TimeTypes = Object.values(TimeType);

export const BaseTypes = Object.values(BaseType);

export const JsonTypes = Object.values(JsonType);

export const MediaTypes = Object.values(MediaType);

export const LocationTypes = Object.values(LocationType);

export const NumericTypes = [...DecimalTypes, ...IntegerTypes];

export const ColumnTypes = [
  ...BaseTypes,
  ...JsonTypes,
  ...MediaTypes,
  ...NumericTypes,
  ...TimeTypes,
  ...LocationTypes,
];

export const RelationTypes = Object.values(RelationType);

export interface DataModel {
  tableMetadata: TableMetadata[];
  relationMetadata: RelationMetadata[];
}

export interface TableMetadata {
  name: string;
  displayName: string;
  description?: string;
  columnMetadata: ColumnMetadata[];
  constraintMetadata: ConstraintMetadata[];
  apiDefinitions?: ApiDefinition[];
  isView?: boolean;
  writableForAdminOnly?: boolean;
  schemaModifiable: boolean;
}

export interface ColumnMetadata {
  id: string;
  name: string;
  type: ColumnType;
  required: boolean;
  unique: boolean;
  primaryKey: boolean;
  uiHidden: boolean;
  defaultValue?: string | number;
  systemDefined?: boolean;
}

export interface RelationMetadata {
  id: string;
  nameInSource: string;
  nameInTarget: string;
  type: RelationType;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string; // {sourceName}_{targetName}
}

export interface ApiDefinition {
  role: string;
  insert?: InsertPermission;
  select?: SelectPermission;
  update?: UpdatePermission;
  delete?: DeletePermission;
}

export type InsertPermission = {
  // This expression has to hold true for every new row that is inserted
  check: TableFilterExp;
  // Preset values for columns that can be sourced from session variables or static values
  set?: ColumnPresetsExp;
  // Can insert into only these columns (or all when '*' is specified)
  columns?: string[] | '*';
  // When set to true the mutation is accessible only if x-hasura-use-backend-only-permissions session variable exists
  // and is set to true and request is made with x-hasura-admin-secret set if any auth is configured
  backend_only?: boolean;
};

export type SelectPermission = {
  columns: string[] | '*';
  computed_fields?: string[];
  filter: TableFilterExp;
  limit?: number;
  allow_aggregations?: boolean;
};

export type UpdatePermission = {
  columns: string[] | '*';
  filter: TableFilterExp;
  check?: TableFilterExp;
  set?: ColumnPresetsExp;
};

export type DeletePermission = {
  filter: TableFilterExp;
};

export type UniqueConstraint = {
  name: string;
  compositeUniqueColumns: string[];
};

export type NotNullConstraint = {
  name: string;
  columnName: string;
};

export type PrimaryKeyConstraint = {
  name: string;
  primaryKeyColumns: string[];
};

export type ForeignKeyConstraint = {
  name: string;
  sourceUnitedColumns: string[];
  targetTable: string;
  targetUnitedColumns: string[];
};

export type ConstraintMetadata =
  | UniqueConstraint
  | NotNullConstraint
  | PrimaryKeyConstraint
  | ForeignKeyConstraint;

export type ColumnPresetsExp = Record<string, any>;

export type TableCreation = Pick<TableMetadata, 'displayName' | 'description'> & {
  createdAt: boolean;
  updatedAt: boolean;
};

export const AdministrationAreaInformationPrefix = 'fz_administration_info_';
export const PredefinedDistanceColumnNamePrefix = 'fz_distance_from_';

export enum AdministrationAreaInformation {
  PROVINCE = 'province',
  CITY = 'city',
  DISTRICT = 'district',
}
