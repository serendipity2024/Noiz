/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MappingType } from "./globalTypes";

// ====================================================
// GraphQL query operation: SupportedSubsystems
// ====================================================

export interface SupportedSubsystems_supportedSubsystems_requiredTables_requiredColumns {
  __typename: "ColumnConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
}

export interface SupportedSubsystems_supportedSubsystems_requiredTables {
  __typename: "TableConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 必需列
   */
  requiredColumns: SupportedSubsystems_supportedSubsystems_requiredTables_requiredColumns[];
}

export interface SupportedSubsystems_supportedSubsystems_optionalTables_optionalColumns {
  __typename: "ColumnConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SupportedSubsystems_supportedSubsystems_optionalTables {
  __typename: "TableConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 可选列
   */
  optionalColumns: SupportedSubsystems_supportedSubsystems_optionalTables_optionalColumns[];
}

export interface SupportedSubsystems_supportedSubsystems_miscSettings {
  __typename: "MiscSettingConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
}

export interface SupportedSubsystems_supportedSubsystems_optionalMappings_ColumnToColumnMappingConfig {
  __typename: "ColumnToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 源表
   */
  sourceTable: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export interface SupportedSubsystems_supportedSubsystems_optionalMappings_RowToColumnMappingConfig {
  __typename: "RowToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 类型
   */
  type: string;
  /**
   * 查找列
   */
  lookupColumn: string;
  /**
   * 源表
   */
  sourceTable: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export interface SupportedSubsystems_supportedSubsystems_optionalMappings_ArgToColumnMappingConfig {
  __typename: "ArgToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 参数名称
   */
  argName: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export type SupportedSubsystems_supportedSubsystems_optionalMappings = SupportedSubsystems_supportedSubsystems_optionalMappings_ColumnToColumnMappingConfig | SupportedSubsystems_supportedSubsystems_optionalMappings_RowToColumnMappingConfig | SupportedSubsystems_supportedSubsystems_optionalMappings_ArgToColumnMappingConfig;

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_requiredTables_requiredColumns {
  __typename: "ColumnConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_requiredTables {
  __typename: "TableConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 必需列
   */
  requiredColumns: SupportedSubsystems_supportedSubsystems_pluginInfo_requiredTables_requiredColumns[];
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_optionalTables_optionalColumns {
  __typename: "ColumnConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_optionalTables {
  __typename: "TableConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 可选列
   */
  optionalColumns: SupportedSubsystems_supportedSubsystems_pluginInfo_optionalTables_optionalColumns[];
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_ColumnToColumnMappingConfig {
  __typename: "ColumnToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 源表
   */
  sourceTable: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_RowToColumnMappingConfig {
  __typename: "RowToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 类型
   */
  type: string;
  /**
   * 查找列
   */
  lookupColumn: string;
  /**
   * 源表
   */
  sourceTable: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_ArgToColumnMappingConfig {
  __typename: "ArgToColumnMappingConfig";
  /**
   * 映射类型
   */
  mappingType: MappingType;
  /**
   * 名称
   */
  name: string;
  /**
   * 适用API
   */
  applicableApis: string[];
  /**
   * 描述
   */
  description: string;
  /**
   * 是否多个
   */
  multiple: boolean;
  /**
   * 参数名称
   */
  argName: string;
  /**
   * 目标表
   */
  targetTable: string;
}

export type SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings = SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_ColumnToColumnMappingConfig | SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_RowToColumnMappingConfig | SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings_ArgToColumnMappingConfig;

export interface SupportedSubsystems_supportedSubsystems_pluginInfo_miscSettings {
  __typename: "MiscSettingConfig";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
}

export interface SupportedSubsystems_supportedSubsystems_pluginInfo {
  __typename: "SubsystemPluginConfig";
  /**
   * 插件类型
   */
  pluginType: string;
  /**
   * 提供的表
   */
  providedTables: string[];
  /**
   * 必需表
   */
  requiredTables: SupportedSubsystems_supportedSubsystems_pluginInfo_requiredTables[];
  /**
   * 可选表
   */
  optionalTables: SupportedSubsystems_supportedSubsystems_pluginInfo_optionalTables[];
  /**
   * 可选映射
   */
  optionalMappings: SupportedSubsystems_supportedSubsystems_pluginInfo_optionalMappings[];
  /**
   * 杂项设置
   */
  miscSettings: SupportedSubsystems_supportedSubsystems_pluginInfo_miscSettings[];
}

export interface SupportedSubsystems_supportedSubsystems {
  __typename: "SubsystemConfig";
  /**
   * 子系统类型
   */
  subsystemType: string;
  /**
   * 提供的表
   */
  providedTables: string[];
  /**
   * 必需表
   */
  requiredTables: SupportedSubsystems_supportedSubsystems_requiredTables[];
  /**
   * 可选表
   */
  optionalTables: SupportedSubsystems_supportedSubsystems_optionalTables[];
  /**
   * 杂项设置
   */
  miscSettings: SupportedSubsystems_supportedSubsystems_miscSettings[];
  /**
   * 可选映射
   */
  optionalMappings: SupportedSubsystems_supportedSubsystems_optionalMappings[];
  /**
   * 插件信息
   */
  pluginInfo: SupportedSubsystems_supportedSubsystems_pluginInfo[];
}

export interface SupportedSubsystems {
  /**
   * 支持的子系统
   */
  supportedSubsystems: SupportedSubsystems_supportedSubsystems[];
}