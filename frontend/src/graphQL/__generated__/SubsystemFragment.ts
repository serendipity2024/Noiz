/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SubsystemFragment
// ====================================================

export interface SubsystemFragment_miscSettings {
  __typename: "MiscSetting";
  /**
   * 键
   */
  key: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 值
   */
  value: any;
}

export interface SubsystemFragment_optionalArgToColumnMappings {
  __typename: "ArgToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源键
   */
  sourceKey: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_optionalRowToColumnMappings {
  __typename: "RowToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源键
   */
  sourceKey: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_optionalColumnToColumnMappings {
  __typename: "ColumnToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源列ID
   */
  sourceColumnId: string;
  /**
   * 源列名称
   */
  sourceColumnName: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_requiredTableMappings_columnMappings {
  __typename: "ColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 列ID
   */
  columnId: string;
  /**
   * 列名称
   */
  columnName: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SubsystemFragment_requiredTableMappings {
  __typename: "TableMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 表名称
   */
  tableName: string;
  /**
   * 列映射
   */
  columnMappings: SubsystemFragment_requiredTableMappings_columnMappings[];
}

export interface SubsystemFragment_optionalTableMappings_columnMappings {
  __typename: "ColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 列ID
   */
  columnId: string;
  /**
   * 列名称
   */
  columnName: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SubsystemFragment_optionalTableMappings {
  __typename: "TableMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 表名称
   */
  tableName: string;
  /**
   * 列映射
   */
  columnMappings: SubsystemFragment_optionalTableMappings_columnMappings[];
}

export interface SubsystemFragment_functors {
  __typename: "SubsystemFunctor";
  /**
   * 类型
   */
  type: string;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 调用API名称
   */
  invokeApiName: string;
  /**
   * 输入模式
   */
  inputSchema: any;
  /**
   * 输出模式
   */
  outputSchema: any;
}

export interface SubsystemFragment_enabledPlugins_miscSettings {
  __typename: "MiscSetting";
  /**
   * 键
   */
  key: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 值
   */
  value: any;
}

export interface SubsystemFragment_enabledPlugins_optionalArgToColumnMappings {
  __typename: "ArgToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源键
   */
  sourceKey: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_enabledPlugins_optionalRowToColumnMappings {
  __typename: "RowToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源键
   */
  sourceKey: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_enabledPlugins_optionalColumnToColumnMappings {
  __typename: "ColumnToColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 源列ID
   */
  sourceColumnId: string;
  /**
   * 源列名称
   */
  sourceColumnName: string;
  /**
   * 目标列ID
   */
  targetColumnId: string;
  /**
   * 目标列名称
   */
  targetColumnName: string;
}

export interface SubsystemFragment_enabledPlugins_requiredTableMappings_columnMappings {
  __typename: "ColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 列ID
   */
  columnId: string;
  /**
   * 列名称
   */
  columnName: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SubsystemFragment_enabledPlugins_requiredTableMappings {
  __typename: "TableMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 表名称
   */
  tableName: string;
  /**
   * 列映射
   */
  columnMappings: SubsystemFragment_enabledPlugins_requiredTableMappings_columnMappings[];
}

export interface SubsystemFragment_enabledPlugins_optionalTableMappings_columnMappings {
  __typename: "ColumnMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 列ID
   */
  columnId: string;
  /**
   * 列名称
   */
  columnName: string;
  /**
   * 是否可选
   */
  optional: boolean;
}

export interface SubsystemFragment_enabledPlugins_optionalTableMappings {
  __typename: "TableMapping";
  /**
   * 名称
   */
  name: string;
  /**
   * 表名称
   */
  tableName: string;
  /**
   * 列映射
   */
  columnMappings: SubsystemFragment_enabledPlugins_optionalTableMappings_columnMappings[];
}

export interface SubsystemFragment_enabledPlugins {
  __typename: "SubsystemPlugin";
  /**
   * 插件类型
   */
  pluginType: string;
  /**
   * 杂项设置
   */
  miscSettings: SubsystemFragment_enabledPlugins_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: SubsystemFragment_enabledPlugins_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: SubsystemFragment_enabledPlugins_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: SubsystemFragment_enabledPlugins_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: SubsystemFragment_enabledPlugins_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: SubsystemFragment_enabledPlugins_optionalTableMappings[];
}

export interface SubsystemFragment {
  __typename: "SubsystemRecord";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 子系统类型
   */
  subsystemType: string;
  /**
   * 杂项设置
   */
  miscSettings: SubsystemFragment_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: SubsystemFragment_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: SubsystemFragment_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: SubsystemFragment_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: SubsystemFragment_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: SubsystemFragment_optionalTableMappings[];
  /**
   * 函数
   */
  functors: SubsystemFragment_functors[];
  /**
   * 启用的插件
   */
  enabledPlugins: SubsystemFragment_enabledPlugins[];
}