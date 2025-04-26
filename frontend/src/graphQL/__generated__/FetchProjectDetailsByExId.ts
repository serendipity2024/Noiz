/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeploymentStatus, CollaboratorType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchProjectDetailsByExId
// ====================================================

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_appGlobalSetting {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_functors {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes_FlowEnd {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes_RunCustomCode {
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

export type FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes = FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes_FlowEnd | FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes_RunCustomCode;

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows {
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
  allNodes: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows_allNodes[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_miscSettings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalArgToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalRowToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalColumnToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_requiredTableMappings_columnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_requiredTableMappings {
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
  columnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_requiredTableMappings_columnMappings[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalTableMappings_columnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalTableMappings {
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
  columnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalTableMappings_columnMappings[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_functors {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_miscSettings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalArgToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalRowToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalColumnToColumnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_requiredTableMappings_columnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_requiredTableMappings {
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
  columnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_requiredTableMappings_columnMappings[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalTableMappings_columnMappings {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalTableMappings {
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
  columnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalTableMappings_columnMappings[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins {
  __typename: "SubsystemPlugin";
  /**
   * 插件类型
   */
  pluginType: string;
  /**
   * 杂项设置
   */
  miscSettings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins_optionalTableMappings[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords {
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
  miscSettings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_miscSettings[];
  /**
   * 可选参数到列映射
   */
  optionalArgToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalArgToColumnMappings[];
  /**
   * 可选行到列映射
   */
  optionalRowToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalRowToColumnMappings[];
  /**
   * 可选列到列映射
   */
  optionalColumnToColumnMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalColumnToColumnMappings[];
  /**
   * 必需表映射
   */
  requiredTableMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_requiredTableMappings[];
  /**
   * 可选表映射
   */
  optionalTableMappings: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_optionalTableMappings[];
  /**
   * 函数
   */
  functors: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_functors[];
  /**
   * 启用的插件
   */
  enabledPlugins: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords_enabledPlugins[];
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_mcConfiguration {
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

export interface FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema {
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
  appGlobalSetting: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_appGlobalSetting | null;
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
  functors: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_functors[];
  /**
   * 动作流
   */
  actionFlows: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_actionFlows[];
  /**
   * 子系统记录
   */
  subsystemRecords: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_subsystemRecords[];
  /**
   * MC配置
   */
  mcConfiguration: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema_mcConfiguration | null;
  /**
   * 组件模板
   */
  componentTemplates: any | null;
}

export interface FetchProjectDetailsByExId_project_lastUploadedSchema {
  __typename: "ProjectSchema";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 应用模式
   */
  appSchema: FetchProjectDetailsByExId_project_lastUploadedSchema_appSchema | null;
}

export interface FetchProjectDetailsByExId_project_schemaHistory {
  __typename: "ProjectSchema";
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 创建时间
   */
  createdAt: any;
}

export interface FetchProjectDetailsByExId_project_projectConfig_wechatAppConfig {
  __typename: "WechatAppConfig";
  /**
   * 微信应用ID
   */
  appId: string | null;
  /**
   * 微信应用密钥
   */
  appSecret: string | null;
  /**
   * 微信应用原始ID
   */
  originalId: string | null;
  /**
   * 微信应用名称
   */
  appName: string | null;
  /**
   * 微信应用图标
   */
  appIcon: string | null;
  /**
   * 微信应用描述
   */
  appDescription: string | null;
  /**
   * 微信应用类别
   */
  appCategory: string | null;
  /**
   * 微信应用服务类别
   */
  appServiceCategory: string | null;
  /**
   * 微信应用服务类别ID
   */
  appServiceCategoryId: string | null;
  /**
   * 微信应用支持版本
   */
  appSupportVersion: string | null;
  /**
   * 微信应用请求域名
   */
  requestDomain: string[] | null;
  /**
   * 微信应用Socket域名
   */
  socketDomain: string[] | null;
  /**
   * 微信应用上传域名
   */
  uploadDomain: string[] | null;
  /**
   * 微信应用下载域名
   */
  downloadDomain: string[] | null;
  /**
   * 微信应用业务域名
   */
  bizDomain: string[] | null;
  /**
   * 微信应用WebView域名
   */
  webViewDomain: string[] | null;
}

export interface FetchProjectDetailsByExId_project_projectConfig_hasuraConfig {
  __typename: "HasuraConfig";
  /**
   * Hasura管理员密钥
   */
  adminSecret: string | null;
  /**
   * Hasura端点
   */
  endpoint: string | null;
  /**
   * Hasura JWT密钥
   */
  jwtSecret: string | null;
}

export interface FetchProjectDetailsByExId_project_projectConfig_aliyunSmsConfig_signature {
  __typename: "AliyunSmsSignature";
  /**
   * 描述
   */
  description: string | null;
  /**
   * 签名来源
   */
  signSource: string | null;
  /**
   * 签名
   */
  signature: string | null;
}

export interface FetchProjectDetailsByExId_project_projectConfig_aliyunSmsConfig {
  __typename: "AliyunSmsConfig";
  /**
   * 授权书图片外部ID
   */
  powerOfAttorneyImageExId: string | null;
  /**
   * 签名
   */
  signature: FetchProjectDetailsByExId_project_projectConfig_aliyunSmsConfig_signature | null;
}

export interface FetchProjectDetailsByExId_project_projectConfig_emailConfig {
  __typename: "EmailConfig";
  /**
   * 邮箱密码
   */
  emailPassword: string | null;
  /**
   * 邮箱提供商
   */
  emailProvider: string | null;
  /**
   * 邮箱发送者
   */
  emailSender: string | null;
}

export interface FetchProjectDetailsByExId_project_projectConfig {
  __typename: "ProjectConfig";
  /**
   * 微信应用配置
   */
  wechatAppConfig: FetchProjectDetailsByExId_project_projectConfig_wechatAppConfig | null;
  /**
   * Hasura配置
   */
  hasuraConfig: FetchProjectDetailsByExId_project_projectConfig_hasuraConfig | null;
  /**
   * 阿里云短信配置
   */
  aliyunSmsConfig: FetchProjectDetailsByExId_project_projectConfig_aliyunSmsConfig | null;
  /**
   * 邮箱配置
   */
  emailConfig: FetchProjectDetailsByExId_project_projectConfig_emailConfig | null;
  /**
   * 注册令牌
   */
  registerToken: string | null;
  /**
   * 营业执照图片外部ID
   */
  businessLicenseImageExId: string | null;
}

export interface FetchProjectDetailsByExId_project {
  __typename: "Project";
  /**
   * 项目名称
   */
  projectName: string;
  /**
   * 协作者类型
   */
  collaboratorType: CollaboratorType;
  /**
   * 模式外部ID
   */
  schemaExId: string | null;
  /**
   * 调试脚本URL
   */
  debugScriptUrl: string | null;
  /**
   * 移动Web URL
   */
  mobileWebUrl: string | null;
  /**
   * 自定义MC URL
   */
  customizedMcUrl: string | null;
  /**
   * 自定义MC默认密码
   */
  customizedMcDefaultPassword: string | null;
  /**
   * 管理控制台URL
   */
  managementConsoleUrl: string | null;
  /**
   * 最后上传的模式
   */
  lastUploadedSchema: FetchProjectDetailsByExId_project_lastUploadedSchema | null;
  /**
   * 模式历史
   */
  schemaHistory: FetchProjectDetailsByExId_project_schemaHistory[];
  /**
   * 是否绑定云配置
   */
  hasBindCloudConfiguration: boolean;
  /**
   * 项目配置
   */
  projectConfig: FetchProjectDetailsByExId_project_projectConfig | null;
  /**
   * 外部ID
   */
  exId: string;
  /**
   * 部署状态
   */
  deploymentStatus: DeploymentStatus | null;
  /**
   * 微信小程序链接
   */
  wechatMiniAppLink: string | null;
  /**
   * 微信小程序二维码链接
   */
  wechatMiniAppQRCodeLink: string | null;
  /**
   * 微信小程序二维码Base64
   */
  wechatMiniAppQRCodeBase64: string | null;
}

export interface FetchProjectDetailsByExId {
  /**
   * 项目
   */
  project: FetchProjectDetailsByExId_project | null;
}

export interface FetchProjectDetailsByExIdVariables {
  projectExId: string;
}