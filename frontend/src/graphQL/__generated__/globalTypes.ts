/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ActionFlowNodeType {
  CUSTOM_CODE = "CUSTOM_CODE",
  FLOW_END = "FLOW_END",
}

export enum AgeRange {
  ABOVE_45 = "ABOVE_45",
  AGE20_24 = "AGE20_24",
  AGE25_34 = "AGE25_34",
  AGE35_44 = "AGE35_44",
  BELOW_18 = "BELOW_18",
}

export enum AliyunSmsSignSourceType {
  APP = "APP",
  BRAND_NAME = "BRAND_NAME",
  ENTERPRISE_OR_INSTITUTION = "ENTERPRISE_OR_INSTITUTION",
  E_COMMERCE_PLATFORM_STORE_NAME = "E_COMMERCE_PLATFORM_STORE_NAME",
  OFFICIAL_ACCOUNT_OR_MINIPROGRAM = "OFFICIAL_ACCOUNT_OR_MINIPROGRAM",
  WEBSITE = "WEBSITE",
}

export enum AliyunSmsStatus {
  APPROVED = "APPROVED",
  AUDIT_FAILED = "AUDIT_FAILED",
  IN_REVIEW = "IN_REVIEW",
}

export enum AliyunSmsTemplateType {
  INTERNATIONAL_SMS = "INTERNATIONAL_SMS",
  PROMOTE_SMS = "PROMOTE_SMS",
  SMS_NONTIFICATION = "SMS_NONTIFICATION",
  VERIFICATION_CODE = "VERIFICATION_CODE",
}

export enum AuditStatus {
  IN_REVIEW = "IN_REVIEW",
  REJECTED = "REJECTED",
  SUCCESS = "SUCCESS",
  WITHDRAWN = "WITHDRAWN",
}

export enum BuildTarget {
  ANDROID = "ANDROID",
  CUSTOMIZED_MC = "CUSTOMIZED_MC",
  IOS = "IOS",
  MANAGEMENT_CONSOLE = "MANAGEMENT_CONSOLE",
  MOBILE_WEB = "MOBILE_WEB",
  WECHAT_MINIPROGRAM = "WECHAT_MINIPROGRAM",
}

export enum CloudProvider {
  ALIYUN = "ALIYUN",
  AWS = "AWS",
}

export enum CollaborationEventType {
  DIFFS_DELETED = "DIFFS_DELETED",
  ERROR_REPORT = "ERROR_REPORT",
  PROJECT_RESET = "PROJECT_RESET",
  SCHEMA_SAVED = "SCHEMA_SAVED",
}

export enum CollaboratorType {
  EDITOR = "EDITOR",
  OWNER = "OWNER",
  VIEWER = "VIEWER",
}

export enum ColumnType {
  BIGINT = "BIGINT",
  BIGSERIAL = "BIGSERIAL",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DECIMAL = "DECIMAL",
  FILE = "FILE",
  FLOAT8 = "FLOAT8",
  GEO_POINT = "GEO_POINT",
  IMAGE = "IMAGE",
  IMAGE_LIST = "IMAGE_LIST",
  INTEGER = "INTEGER",
  JSONB = "JSONB",
  TEXT = "TEXT",
  TIMESTAMPTZ = "TIMESTAMPTZ",
  TIMETZ = "TIMETZ",
  VIDEO = "VIDEO",
  VIDEO_LIST = "VIDEO_LIST",
}

export enum ComponentTemplateOwnership {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum ComponentTemplateType {
  COMPONENT = "COMPONENT",
  SCREEN = "SCREEN",
}

export enum DbModificationType {
  DELETE = "DELETE",
  INSERT = "INSERT",
  UPDATE = "UPDATE",
}

export enum DeploymentStatus {
  ARCHIVED = "ARCHIVED",
  ARCHIVING = "ARCHIVING",
  BUILD_MOBILE_WEB = "BUILD_MOBILE_WEB",
  BUILD_WECHAT = "BUILD_WECHAT",
  COMPILING_MANAGEMENT_CONSOLE = "COMPILING_MANAGEMENT_CONSOLE",
  COMPILING_MOBILE_WEB = "COMPILING_MOBILE_WEB",
  COMPILING_TARO = "COMPILING_TARO",
  COMPILING_WECHAT = "COMPILING_WECHAT",
  DEPLOYING = "DEPLOYING",
  FAILED = "FAILED",
  GENERATING = "GENERATING",
  GEN_MANAGEMENT_CONSOLE = "GEN_MANAGEMENT_CONSOLE",
  GEN_MOBILE_WEB = "GEN_MOBILE_WEB",
  GEN_TARO = "GEN_TARO",
  GEN_WECHAT = "GEN_WECHAT",
  INITIALIZING = "INITIALIZING",
  PACKAGE_ALL_COMPLETE = "PACKAGE_ALL_COMPLETE",
  PACKAGE_ANDROID_COMPLETE = "PACKAGE_ANDROID_COMPLETE",
  PACKAGE_CUSTOMIZED_MC = "PACKAGE_CUSTOMIZED_MC",
  PACKAGE_IOS_COMPLETE = "PACKAGE_IOS_COMPLETE",
  PACKAGE_MANAGEMENT_CONSOLE_COMPLETE = "PACKAGE_MANAGEMENT_CONSOLE_COMPLETE",
  PACKAGE_WECHAT_MINIPROGRAM_COMPLETE = "PACKAGE_WECHAT_MINIPROGRAM_COMPLETE",
  PACKAGING_CUSTOMIZED_MC = "PACKAGING_CUSTOMIZED_MC",
  PACKAGING_MANAGEMENT_CONSOLE = "PACKAGING_MANAGEMENT_CONSOLE",
  PACKAGING_MOBILE_WEB = "PACKAGING_MOBILE_WEB",
  PACKAGING_MOBILE_WEB_COMPLETE = "PACKAGING_MOBILE_WEB_COMPLETE",
  PACKAGING_WECHAT_MINIPROGRAM = "PACKAGING_WECHAT_MINIPROGRAM",
  PUBLISHED = "PUBLISHED",
  WECHAT_TEMPLATE_MINIPROGRAM_ID_OBTAINED = "WECHAT_TEMPLATE_MINIPROGRAM_ID_OBTAINED",
}

export enum EmailProvider {
  EMPTY = "EMPTY",
  GMAIL = "GMAIL",
  QQ = "QQ",
  QQ_EX = "QQ_EX",
}

export enum FeatureType {
  ACTION_FLOW = "ACTION_FLOW",
  CUSTOMER_SERVICE_BUBBLE = "CUSTOMER_SERVICE_BUBBLE",
  DATA_MODEL_DELETE = "DATA_MODEL_DELETE",
  NEW_DATA_MODEL_DESIGN = "NEW_DATA_MODEL_DESIGN",
  SCHEMA_VALIDATION = "SCHEMA_VALIDATION",
  SHOW_DEVICE_SELECTOR = "SHOW_DEVICE_SELECTOR",
  SHOW_SET_USERNAME = "SHOW_SET_USERNAME",
  SHOW_USER_PROFILE = "SHOW_USER_PROFILE",
  THIRD_PARTY_API = "THIRD_PARTY_API",
  WECHAT_OFFICIAL_ACCOUNT = "WECHAT_OFFICIAL_ACCOUNT",
}

export enum FunctorType {
  mutation = "mutation",
  query = "query",
}

export enum Language {
  JS = "JS",
  PYTHON = "PYTHON",
  R = "R",
  RUBY = "RUBY",
  SCALA = "SCALA",
}

export enum MappingType {
  ARG_TO_COLUMN = "ARG_TO_COLUMN",
  COLUMN_TO_COLUMN = "COLUMN_TO_COLUMN",
  ROW_TO_COLUMN = "ROW_TO_COLUMN",
}

export enum MediaFormat {
  CSS = "CSS",
  DOC = "DOC",
  DOCX = "DOCX",
  GIF = "GIF",
  HTML = "HTML",
  JPEG = "JPEG",
  JPG = "JPG",
  JSON = "JSON",
  MOV = "MOV",
  MP3 = "MP3",
  MP4 = "MP4",
  OTHER = "OTHER",
  PDF = "PDF",
  PNG = "PNG",
  PPT = "PPT",
  PPTX = "PPTX",
  TXT = "TXT",
  WAV = "WAV",
  XLS = "XLS",
  XLSX = "XLSX",
  XML = "XML",
}

export enum PGType {
  ACL_ITEM = "ACL_ITEM",
  BIT = "BIT",
  BOOL = "BOOL",
  BOX = "BOX",
  BPCHAR = "BPCHAR",
  BYTES = "BYTES",
  CHAR = "CHAR",
  CID = "CID",
  CIDR = "CIDR",
  CIRCLE = "CIRCLE",
  CITEXT = "CITEXT",
  CSTRING = "CSTRING",
  DATE = "DATE",
  FLOAT4 = "FLOAT4",
  FLOAT8 = "FLOAT8",
  HSTORE = "HSTORE",
  INET = "INET",
  INT2 = "INT2",
  INT4 = "INT4",
  INT8 = "INT8",
  INTERVAL = "INTERVAL",
  JSON = "JSON",
  JSONB = "JSONB",
  LINE = "LINE",
  LINE_SEGMENT = "LINE_SEGMENT",
  MACADDR = "MACADDR",
  MACADDR8 = "MACADDR8",
  MONEY = "MONEY",
  NAME = "NAME",
  NUMERIC = "NUMERIC",
  OID = "OID",
  PATH = "PATH",
  POINT = "POINT",
  POLYGON = "POLYGON",
  RECORD = "RECORD",
  TEXT = "TEXT",
  TID = "TID",
  TIME = "TIME",
  TIMESTAMP = "TIMESTAMP",
  TIMESTAMP_WITH_TIMEZONE = "TIMESTAMP_WITH_TIMEZONE",
  TIME_WITH_TIMEZONE = "TIME_WITH_TIMEZONE",
  UUID = "UUID",
  VARBIT = "VARBIT",
  VARCHAR = "VARCHAR",
  XID = "XID",
  XML = "XML",
}

export enum Platform {
  MOBILE_WEB = "MOBILE_WEB",
  WECHAT_MINI_PROGRAM = "WECHAT_MINI_PROGRAM",
}

export enum PluginType {
  COUPON = "COUPON",
}

export enum QueryType {
  MANY = "MANY",
  ONE = "ONE",
}

export enum RedemptionType {
  ACCOUNT_ACTIVATION = "ACCOUNT_ACTIVATION",
}

export enum SendMethod {
  EMAIL = "EMAIL",
  SMS = "SMS",
}

export enum SubsystemType {
  ORDER_SYSTEM = "ORDER_SYSTEM",
  WITHDRAW_SYSTEM = "WITHDRAW_SYSTEM",
}

export enum Visibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export interface AccountProfileInput {
  ageRange?: AgeRange | null;
  industry?: string | null;
  reasonUsingZion?: string | null;
  referralSource?: string | null;
  title?: string | null;
}

export interface AliyunSmsSignatureInput {
  description?: string | null;
  signSource?: AliyunSmsSignSourceType | null;
  signature?: string | null;
}

export interface AliyunSmsTemplateParamsInput {
  templateCode?: string | null;
  templateContent: string;
  templateDescription: string;
  templateName: string;
  templateType: AliyunSmsTemplateType;
}

export interface ArgToColumnMappingInput {
  name: string;
  sourceKey: string;
  targetColumnId: any;
  targetColumnName: string;
  type: ColumnType;
}

export interface ClientLogEntryInput {
  category: string;
  data: any;
  env?: any | null;
  eventId: string;
  timestamp: any;
}

export interface ColumnMappingInput {
  columnId: any;
  columnName: string;
  name: string;
  optional?: boolean | null;
  type: ColumnType;
}

export interface ColumnToColumnMappingInput {
  name: string;
  sourceColumnId: any;
  sourceColumnName: string;
  targetColumnId: any;
  targetColumnName: string;
  type: ColumnType;
}

export interface ComponentTemplateCreationInputInput {
  data: any;
  description?: string | null;
  iconImageExId?: string | null;
  ownership: ComponentTemplateOwnership;
  previewImageExId?: string | null;
  projectExId: string;
  title: string;
  type: ComponentTemplateType;
}

export interface CropOptionInput {
  height?: number | null;
  offsetX?: number | null;
  offsetY?: number | null;
  width?: number | null;
}

export interface DataTypeInput {
  baseType?: PGType | null;
  dataType?: DataTypeInput | null;
  list: boolean;
}

export interface DbDataInput {
  query?: string | null;
  queryArgs?: (SqlArgInput | null)[] | null;
  queryType?: QueryType | null;
}

export interface DbInputInput {
  argName?: string | null;
  dbData?: DbDataInput | null;
}

export interface DbModificationInput {
  batch: boolean;
  sql?: string | null;
  sqlArgs?: (SqlArgInput | null)[] | null;
  type?: DbModificationType | null;
}

export interface EmailConfigInput {
  emailPassword?: string | null;
  emailProvider?: EmailProvider | null;
  emailSender?: string | null;
}

export interface FunctorCreationInputInput {
  code: string;
  dbInputs: (DbInputInput | null)[];
  dbModifications?: (DbModificationInput | null)[] | null;
  displayName: string;
  language: Language;
  outputSchema: any;
  runtimeInputs: (RuntimeInputInput | null)[];
  type: FunctorType;
}

export interface ImageProcessOptionInput {
  crop?: CropOptionInput | null;
  resize?: ResizeOptionInput | null;
}

export interface MiscSettingInput {
  key: string;
  type: ColumnType;
  value: any;
}

export interface PluginSettingInput {
  miscSettings: MiscSettingInput[];
  optionalArgToColumnMappings: ArgToColumnMappingInput[];
  optionalColumnToColumnMappings: ColumnToColumnMappingInput[];
  optionalRowToColumnMappings: RowToColumnMappingInput[];
  optionalTableMappings: TableMappingInput[];
  pluginType: PluginType;
  requiredTableMappings: TableMappingInput[];
}

export interface ResizeOptionInput {
  height?: number | null;
  width?: number | null;
}

export interface RowToColumnMappingInput {
  name: string;
  sourceKey: string;
  targetColumnId: any;
  targetColumnName: string;
  type: ColumnType;
}

export interface RuntimeInputInput {
  argName?: string | null;
  dataType?: DataTypeInput | null;
}

export interface SqlArgInput {
  dataType?: DataTypeInput | null;
  name?: string | null;
}

export interface SubsystemConfigInput {
  enabledPlugins: PluginSettingInput[];
  miscSettings: MiscSettingInput[];
  optionalArgToColumnMappings: ArgToColumnMappingInput[];
  optionalColumnToColumnMappings: ColumnToColumnMappingInput[];
  optionalRowToColumnMappings: RowToColumnMappingInput[];
  optionalTableMappings: TableMappingInput[];
  requiredTableMappings: TableMappingInput[];
  subsystemType: SubsystemType;
}

export interface TableMappingInput {
  columnMappings: ColumnMappingInput[];
  name: string;
  tableName: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
