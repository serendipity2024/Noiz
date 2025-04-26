import { gql } from '@apollo/client';

const MISC_SETTING_FRAGMENT = gql`
  fragment MiscSettingFragment on MiscSetting {
    key
    type
    value
  }
`;

const ARG_COLUMN_MAPPING_FRAGMENT = gql`
  fragment ArgToColumnMappingFragment on ArgToColumnMapping {
    name
    type
    sourceKey
    targetColumnId
    targetColumnName
  }
`;

const COLUMN_COLUMN_MAPPING_FRAGMENT = gql`
  fragment ColumnToColumnMappingFragment on ColumnToColumnMapping {
    name
    type
    sourceColumnId
    sourceColumnName
    targetColumnId
    targetColumnName
  }
`;

const ROW_COLUMN_MAPPING_FRAGMENT = gql`
  fragment RowToColumnMappingFragment on RowToColumnMapping {
    name
    type
    sourceKey
    targetColumnId
    targetColumnName
  }
`;

const TABLE_MAPPING_FRAGMENT = gql`
  fragment TableMappingFragment on TableMapping {
    name
    tableName
    columnMappings {
      name
      type
      columnId
      columnName
      optional
    }
  }
`;

export const SUB_SYSTEM_RECORD = gql`
  fragment SubsystemFragment on SubsystemRecord {
    exId
    subsystemType
    miscSettings {
      ...MiscSettingFragment
    }
    optionalArgToColumnMappings {
      ...ArgToColumnMappingFragment
    }
    optionalRowToColumnMappings {
      ...RowToColumnMappingFragment
    }
    optionalColumnToColumnMappings {
      ...ColumnToColumnMappingFragment
    }
    requiredTableMappings {
      ...TableMappingFragment
    }
    optionalTableMappings {
      ...TableMappingFragment
    }
    functors {
      type
      displayName
      invokeApiName
      inputSchema
      outputSchema
    }
    enabledPlugins {
      pluginType
      miscSettings {
        ...MiscSettingFragment
      }
      optionalArgToColumnMappings {
        ...ArgToColumnMappingFragment
      }
      optionalRowToColumnMappings {
        ...RowToColumnMappingFragment
      }
      optionalColumnToColumnMappings {
        ...ColumnToColumnMappingFragment
      }
      requiredTableMappings {
        ...TableMappingFragment
      }
      optionalTableMappings {
        ...TableMappingFragment
      }
    }
  }
  ${MISC_SETTING_FRAGMENT}
  ${ARG_COLUMN_MAPPING_FRAGMENT}
  ${COLUMN_COLUMN_MAPPING_FRAGMENT}
  ${ROW_COLUMN_MAPPING_FRAGMENT}
  ${TABLE_MAPPING_FRAGMENT}
`;

export const MAPPING_INFO_RECORD = gql`
  fragment MappingInfoFragment on MappingInfo {
    ... on ColumnToColumnMappingConfig {
      mappingType
      name
      applicableApis
      description
      multiple
      sourceTable
      targetTable
    }
    ... on RowToColumnMappingConfig {
      mappingType
      name
      applicableApis
      description
      multiple
      type
      lookupColumn
      sourceTable
      targetTable
    }
    ... on ArgToColumnMappingConfig {
      mappingType
      name
      applicableApis
      description
      multiple
      argName
      targetTable
    }
  }
`;
