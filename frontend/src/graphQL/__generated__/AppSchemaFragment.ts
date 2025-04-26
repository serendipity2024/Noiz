/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AppSchemaFragment
// ====================================================

export interface AppSchemaFragment_appGlobalSetting {
  __typename: "AppGlobalSetting";
  /**
   * 应用加载完成时的回调函数
   */
  appDidLoad: string | null;
  /**
   * 全局变量表
   */
  globalVariableTable: any | null;
}

export interface AppSchemaFragment_functors {
  __typename: "Functor";
  /**
   * 函数ID
   */
  id: string;
  /**
   * API版本
   */
  apiVersion: string;
  /**
   * 创建时间
   */
  createdAt: any;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 调用API名称
   */
  invokeApiName: string;
  /**
   * 函数类型
   */
  type: string;
  /**
   * 唯一ID
   */
  uniqueId: string;
  /**
   * 输入模式
   */
  inputSchema: any;
  /**
   * 输出模式
   */
  outputSchema: any;
}

export interface AppSchemaFragment_actionFlows_allNodes_FlowEnd {
  __typename: "FlowEnd";
  /**
   * 节点唯一ID
   */
  uniqueId: string;
  /**
   * 节点类型
   */
  type: string;
}

export interface AppSchemaFragment_actionFlows_allNodes_RunCustomCode {
  __typename: "RunCustomCode";
  /**
   * 节点类型
   */
  type: string;
  /**
   * 节点唯一ID
   */
  uniqueId: string;
  /**
   * 输入参数
   */
  inputArgs: any;
  /**
   * 输出值
   */
  outputValues: any;
  /**
   * 自定义代码
   */
  code: string;
  /**
   * 下一个节点ID
   */
  andThenNodeId: string | null;
}

export type AppSchemaFragment_actionFlows_allNodes = AppSchemaFragment_actionFlows_allNodes_FlowEnd | AppSchemaFragment_actionFlows_allNodes_RunCustomCode;

export interface AppSchemaFragment_actionFlows {
  __typename: "ActionFlow";
  /**
   * 唯一ID
   */
  uniqueId: string;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 输入参数
   */
  inputArgs: any;
  /**
   * 输出值
   */
  outputValues: any;
  /**
   * 起始节点ID
   */
  startNodeId: string;
  /**
   * 版本ID
   */
  versionId: string;
  /**
   * 模式版本
   */
  schemaVersion: string;
  /**
   * 所有节点
   */
  allNodes: AppSchemaFragment_actionFlows_allNodes[];
}

export interface AppSchemaFragment_subsystemRecords_miscSettings {
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

export interface AppSchemaFragment_subsystemRecords_optionalArgToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_optionalRowToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_optionalColumnToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_requiredTableMappings_columnMappings {
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

export interface AppSchemaFragment_subsystemRecords_requiredTableMappings {
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
  columnMappings: AppSchemaFragment_subsystemRecords_requiredTableMappings_columnMappings[];
}

export interface AppSchemaFragment_subsystemRecords_optionalTableMappings_columnMappings {
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

export interface AppSchemaFragment_subsystemRecords_optionalTableMappings {
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
  columnMappings: AppSchemaFragment_subsystemRecords_optionalTableMappings_columnMappings[];
}

export interface AppSchemaFragment_subsystemRecords_functors {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_miscSettings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_optionalArgToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_optionalRowToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_optionalColumnToColumnMappings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_requiredTableMappings_columnMappings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_requiredTableMappings {
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
  columnMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_requiredTableMappings_columnMappings[];
}

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_optionalTableMappings_columnMappings {
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

export interface AppSchemaFragment_subsystemRecords_enabledPlugins_optionalTableMappings {
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
  columnMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_optionalTableMappings_columnMappings[];
}

export interface AppSchemaFragment_subsystemRecords_enabledPlugins {
  __typename: "SubsystemPlugin";
  /**
   * 插件类型
   */
  pluginType: string;
  /**
   * 杂项设置
   */
  miscSettings: AppSchemaFragment_subsystemRecords_enabledPlugins_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: AppSchemaFragment_subsystemRecords_enabledPlugins_optionalTableMappings[];
}

export interface AppSchemaFragment_subsystemRecords {
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
  miscSettings: AppSchemaFragment_subsystemRecords_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: AppSchemaFragment_subsystemRecords_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: AppSchemaFragment_subsystemRecords_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: AppSchemaFragment_subsystemRecords_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: AppSchemaFragment_subsystemRecords_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: AppSchemaFragment_subsystemRecords_optionalTableMappings[];
  /**
   * 函数
   */
  functors: AppSchemaFragment_subsystemRecords_functors[];
  /**
   * 启用的插件
   */
  enabledPlugins: AppSchemaFragment_subsystemRecords_enabledPlugins[];
}

export interface AppSchemaFragment_mcConfiguration {
  __typename: "McConfiguration";
  /**
   * 用户角色
   */
  userRoles: any | null;
  /**
   * 菜单项
   */
  menuItems: any | null;
  /**
   * 对象
   */
  objects: any | null;
}

export interface AppSchemaFragment {
  __typename: "AppSchema";
  /**
   * 微信根MRefs
   */
  wechatRootMRefs: string[];
  /**
   * Web根MRefs
   */
  webRootMRefs: string[];
  /**
   * 移动Web根MRefs
   */
  mobileWebRootMRefs: string[];
  /**
   * MRef映射
   */
  mRefMap: any;
  /**
   * 数据模型
   */
  dataModel: any;
  /**
   * 颜色主题
   */
  colorTheme: any | null;
  /**
   * 应用配置
   */
  appConfiguration: any;
  /**
   * 微信配置
   */
  wechatConfiguration: any;
  /**
   * Web配置
   */
  webConfiguration: any;
  /**
   * 移动Web配置
   */
  mobileWebConfiguration: any;
  /**
   * 应用全局设置
   */
  appGlobalSetting: AppSchemaFragment_appGlobalSetting | null;
  /**
   * Zed版本
   */
  zedVersion: string | null;
  /**
   * 远程API模式
   */
  remoteApiSchema: any | null;
  /**
   * 第三方API配置
   */
  thirdPartyApiConfigs: any | null;
  /**
   * 函数
   */
  functors: AppSchemaFragment_functors[];
  /**
   * 动作流
   */
  actionFlows: AppSchemaFragment_actionFlows[];
  /**
   * 子系统记录
   */
  subsystemRecords: AppSchemaFragment_subsystemRecords[];
  /**
   * MC配置
   */
  mcConfiguration: AppSchemaFragment_mcConfiguration | null;
  /**
   * 组件模板
   */
  componentTemplates: any | null;
}