/* eslint-disable import/no-default-export */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
import React, { ReactElement, useEffect, useState } from 'react';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { transaction } from 'mobx';
import useLocale from '../../../hooks/useLocale';
import useStores from '../../../hooks/useStores';
import i18n from './AddSubSystemTab.i18n.json';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import PlusIcon from '../../../shared/assets/icons/plus.svg';
import ZConfigRowTitle from '../right-drawer/shared/ZConfigRowTitle';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import { ENABLE_SUBSYSTEM, SUPPORTED_SUBSYSTEMS } from '../../../graphQL/subsystems';
import {
  SupportedSubsystems_supportedSubsystems,
  SupportedSubsystems_supportedSubsystems_optionalMappings,
  SupportedSubsystems_supportedSubsystems_optionalMappings_ArgToColumnMappingConfig,
  SupportedSubsystems_supportedSubsystems_optionalMappings_ColumnToColumnMappingConfig,
  SupportedSubsystems_supportedSubsystems_optionalMappings_RowToColumnMappingConfig,
  SupportedSubsystems_supportedSubsystems_pluginInfo,
} from '../../../graphQL/__generated__/SupportedSubsystems';
import LeftDrawerButton from './shared/LeftDrawerButton';
import { MappingType } from '../../../graphQL/__generated__/globalTypes';
import ConfigInput from '../right-drawer/shared/ConfigInput';
import {
  SubsystemFragment,
  SubsystemFragment_enabledPlugins,
  SubsystemFragment_optionalArgToColumnMappings,
  SubsystemFragment_optionalColumnToColumnMappings,
  SubsystemFragment_optionalRowToColumnMappings,
  SubsystemFragment_requiredTableMappings,
  SubsystemFragment_requiredTableMappings_columnMappings,
} from '../../../graphQL/__generated__/SubsystemFragment';
import {
  ColumnMetadata,
  ColumnTypes,
  TableMetadata,
} from '../../../shared/type-definition/DataModel';
import { isMediaType } from '../../../shared/type-definition/DataBinding';
import DataBindingHelper from '../../../utils/DataBindingHelper';
import { Collapse, Dropdown, Select, message, Spin, Row, ZMenu } from '../../../zui';

export default function AddSubSystemTab(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore, projectStore } = useStores();

  const [subsystemConfigList, setSubsystemConfigList] = useState<
    SupportedSubsystems_supportedSubsystems[]
  >([]);
  const [subSystemList, setSubSystemList] = useState<SubsystemFragment[]>(
    coreStore.subsystemRecords
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { refetch } = useQuery(SUPPORTED_SUBSYSTEMS, {
    onCompleted: (data) => {
      if (data.supportedSubsystems) {
        setSubsystemConfigList(data.supportedSubsystems);
      }
    },
    onError: (error) => {
      window.console.log(error);
    },
  });

  const [enableSubsystem] = useMutation(ENABLE_SUBSYSTEM);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addPluginMapping = (
    pluginConfig: SupportedSubsystems_supportedSubsystems_pluginInfo,
    subSystem: SubsystemFragment,
    index: number
  ) => {
    const plugin = {
      pluginType: pluginConfig.pluginType,
      requiredTableMappings: pluginConfig.requiredTables.map((table) => ({
        name: table.name,
        columnMappings: table.requiredColumns.map((column) => ({
          name: column.name,
          type: column.type,
          optional: false,
        })),
      })),
      optionalTableMappings: pluginConfig.optionalTables.map((table) => ({
        name: table.name,
        columnMappings: table.optionalColumns.map((column) => ({
          name: column.name,
          type: column.type,
          optional: column.optional,
        })),
      })),
      miscSettings: pluginConfig.miscSettings.map((misc) => ({
        key: misc.name,
        type: misc.type,
      })),
      optionalColumnToColumnMappings: [],
      optionalRowToColumnMappings: [],
      optionalArgToColumnMappings: [],
    };
    subSystem.enabledPlugins.push(plugin as any);
    setSubSystemList(subSystemList.map((ssm, ssmIndex) => (ssmIndex === index ? subSystem : ssm)));
  };

  const addSubSystemMapping = (subsystemConfig: SupportedSubsystems_supportedSubsystems) => {
    setSubSystemList([
      ...subSystemList,
      {
        subsystemType: subsystemConfig.subsystemType,
        requiredTableMappings: subsystemConfig.requiredTables.map((table) => ({
          name: table.name,
          columnMappings: table.requiredColumns.map((column) => ({
            name: column.name,
            type: column.type,
            optional: false,
          })),
        })),
        optionalTableMappings: subsystemConfig.optionalTables.map((table) => ({
          name: table.name,
          columnMappings: table.optionalColumns.map((column) => ({
            name: column.name,
            type: column.type,
            optional: column.optional,
          })),
        })),
        miscSettings: subsystemConfig.miscSettings.map((misc) => ({
          key: misc.name,
          type: misc.type,
        })),
        optionalColumnToColumnMappings: [],
        optionalRowToColumnMappings: [],
        optionalArgToColumnMappings: [],
        enabledPlugins: [],
      },
    ] as SubsystemFragment[]);
  };

  const validateSubSystem = (
    errorMessageTitle: string,
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins
  ): boolean => {
    const requiredTableMappingInvalid = !!subSystem.requiredTableMappings.find((tm) => {
      return (
        tm.tableName === undefined || !!tm.columnMappings.find((cm) => cm.columnId === undefined)
      );
    });
    if (requiredTableMappingInvalid) {
      message.error(`${errorMessageTitle}: ${content.requiredTableMappingsError}`);
      return false;
    }
    const optionalTableMappingInvalid = !!subSystem.optionalTableMappings.find((tm) => {
      return (
        tm.tableName && !!tm.columnMappings.find((cm) => cm.columnId === undefined && !cm.optional)
      );
    });
    if (optionalTableMappingInvalid) {
      message.error(`${errorMessageTitle}: ${content.optionalTableMappingsError}`);
      return false;
    }
    const miscSettingInvalid = !!subSystem.miscSettings.find((ms) => ms.value === undefined);
    if (miscSettingInvalid) {
      message.error(`${errorMessageTitle}: ${content.miscSettingInvalidError}`);
      return false;
    }
    const optionalColumnToColumnMappingInvalid = !!subSystem.optionalColumnToColumnMappings.find(
      (occm) => occm.sourceColumnId === undefined || occm.targetColumnId === undefined
    );
    const optionalRowToColumnMappingInvalid = !!subSystem.optionalRowToColumnMappings.find(
      (occm) => occm.targetColumnId === undefined || occm.sourceKey === undefined
    );
    const optionalArgToColumnMappingInvalid = !!subSystem.optionalArgToColumnMappings.find(
      (occm) => occm.targetColumnId === undefined || occm.sourceKey === undefined
    );
    if (
      optionalColumnToColumnMappingInvalid ||
      optionalRowToColumnMappingInvalid ||
      optionalArgToColumnMappingInvalid
    ) {
      message.error(`${errorMessageTitle}: ${content.optionalMappingInvalidError}`);
      return false;
    }
    return true;
  };

  const saveSubSystemMappings = (subSystem: SubsystemFragment, index: number) => {
    if (!validateSubSystem(content.subsystems, subSystem)) return;
    for (let i = 0; i < subSystem.enabledPlugins.length; i++) {
      const plugin = subSystem.enabledPlugins[i];
      if (plugin && !validateSubSystem(content.plugins, plugin)) return;
    }
    setLoading(true);
    enableSubsystem({
      variables: {
        projectExId: projectStore.projectDetails?.projectExId,
        config: {
          subsystemType: subSystem.subsystemType,
          requiredTableMappings: subSystem.requiredTableMappings,
          optionalTableMappings: subSystem.optionalTableMappings
            .filter((tm) => tm.tableName)
            .map((tm) => {
              tm.columnMappings = tm.columnMappings.filter((cm) => cm.columnId);
              return tm;
            }),
          miscSettings: subSystem.miscSettings,
          optionalColumnToColumnMappings: subSystem.optionalColumnToColumnMappings,
          optionalRowToColumnMappings: subSystem.optionalRowToColumnMappings,
          optionalArgToColumnMappings: subSystem.optionalArgToColumnMappings,
          enabledPlugins: subSystem.enabledPlugins,
        },
      },
    })
      .then((rsp) => {
        if (rsp.data?.enableSubsystem) {
          const newSubsystem = rsp.data?.enableSubsystem;
          const subsystemRecords = subSystemList.map((ss, ssIdx) =>
            ssIdx === index ? newSubsystem : ss
          );
          setSubSystemList(subsystemRecords);
          message.success(content.saveSuccessfulMessage);

          transaction(() => {
            if (newSubsystem.dataModel) {
              coreStore.dataModel = newSubsystem.dataModel;
            }
            coreStore.subsystemRecords = subsystemRecords;
          });
        }
      })
      .catch((error: any) => {
        message.error(JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onOptionalMappingSelect = (
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins,
    optionalMapping: SupportedSubsystems_supportedSubsystems_optionalMappings,
    onSubSystemChange: (subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins) => void
  ) => {
    switch (optionalMapping.mappingType) {
      case MappingType.COLUMN_TO_COLUMN: {
        subSystem.optionalColumnToColumnMappings = [
          ...subSystem.optionalColumnToColumnMappings,
          {
            name: optionalMapping.name,
          },
        ] as SubsystemFragment_optionalColumnToColumnMappings[];
        break;
      }
      case MappingType.ROW_TO_COLUMN: {
        subSystem.optionalRowToColumnMappings = [
          ...subSystem.optionalRowToColumnMappings,
          {
            name: optionalMapping.name,
          },
        ] as SubsystemFragment_optionalRowToColumnMappings[];
        break;
      }
      case MappingType.ARG_TO_COLUMN: {
        subSystem.optionalArgToColumnMappings = [
          ...subSystem.optionalArgToColumnMappings,
          {
            name: optionalMapping.name,
          },
        ] as SubsystemFragment_optionalArgToColumnMappings[];
        break;
      }
      default:
        throw new Error(`unsupported mappingType, ${JSON.stringify(optionalMapping)}`);
    }
    onSubSystemChange(subSystem);
  };

  const renderTableMappingComponent = (
    editable: boolean,
    tableMapping: SubsystemFragment_requiredTableMappings,
    onTableMappingChange: (tableMapping: SubsystemFragment_requiredTableMappings) => void
  ) => {
    if (!tableMapping) return <div />;
    const table = coreStore.dataModel.tableMetadata.find(
      (tb) => tb.name === tableMapping.tableName
    );
    return (
      <div style={{ pointerEvents: editable ? 'auto' : 'none' }}>
        <ZConfigRowTitle text={content.tableName} />
        <Select
          size="large"
          bordered={false}
          style={styles.select}
          placeholder={content.selectPlaceholder}
          value={tableMapping.tableName ?? undefined}
          onChange={(value) => {
            onTableMappingChange({
              ...tableMapping,
              tableName: value,
              columnMappings: tableMapping.columnMappings.map((cm) => ({
                name: cm.name,
                type: cm.type,
                optional: cm.optional,
              })),
            } as SubsystemFragment_requiredTableMappings);
          }}
        >
          {coreStore.dataModel.tableMetadata.map((tb) => (
            <Select.Option key={tb.name} value={tb.name}>
              {tb.name}
            </Select.Option>
          ))}
        </Select>

        {tableMapping.tableName &&
          tableMapping.columnMappings.map((columnMapping, index) => {
            const columns =
              table?.columnMetadata.filter((column) =>
                DataBindingHelper.isSameDataType(column.type, columnMapping.type)
              ) ?? [];
            return (
              <div key={columnMapping.name}>
                <ZConfigRowTitle text={columnMapping.name} />
                {renderSelectColumnComponent(columnMapping.columnName, columns, (column) => {
                  onTableMappingChange({
                    ...tableMapping,
                    columnMappings: tableMapping.columnMappings.map((cm, cmIdx) =>
                      index === cmIdx
                        ? {
                            ...columnMapping,
                            columnName: column.name,
                            columnId: column.id,
                          }
                        : cm
                    ) as SubsystemFragment_requiredTableMappings_columnMappings[],
                  });
                })}
              </div>
            );
          })}
      </div>
    );
  };

  const renderSelectColumnComponent = (
    selectedColumnName: string,
    columnMetadata: ColumnMetadata[],
    onColumnSelect: (column: ColumnMetadata) => void
  ) => {
    return (
      <Select
        size="large"
        bordered={false}
        style={styles.select}
        placeholder={content.selectPlaceholder}
        value={selectedColumnName}
        onChange={(value) => {
          const column = columnMetadata.find((cl) => cl.id === value);
          if (column) {
            onColumnSelect(column);
          }
        }}
      >
        {columnMetadata
          .filter((column) => !column.uiHidden)
          .map((column) => (
            <Select.Option key={column.id + column.name} value={column.id}>
              {column.name}
            </Select.Option>
          ))}
      </Select>
    );
  };

  const renderOptionalColumnToColumnMappingComponent = (
    editable: boolean,
    mapping: SubsystemFragment_optionalColumnToColumnMappings,
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins,
    subsystemConfig:
      | SupportedSubsystems_supportedSubsystems
      | SupportedSubsystems_supportedSubsystems_pluginInfo,
    providedTables: TableMetadata[],
    onOptionalMappingChange: (mapping: SubsystemFragment_optionalColumnToColumnMappings) => void
  ) => {
    const supportedOptionalMapping = subsystemConfig.optionalMappings.find(
      (om) => om.name === mapping.name
    ) as SupportedSubsystems_supportedSubsystems_optionalMappings_ColumnToColumnMappingConfig;
    if (!supportedOptionalMapping) return <div />;

    let sourceTableName = subSystem.requiredTableMappings.find(
      (requiredTableMapping) => requiredTableMapping.name === supportedOptionalMapping.sourceTable
    )?.tableName;
    if (!sourceTableName) {
      sourceTableName = supportedOptionalMapping.sourceTable;
    }
    let targetTableName = subSystem.requiredTableMappings.find(
      (requiredTableMapping) => requiredTableMapping.name === supportedOptionalMapping.targetTable
    )?.tableName;
    if (!targetTableName) {
      targetTableName = supportedOptionalMapping.targetTable;
    }

    const tables = [...coreStore.dataModel.tableMetadata, ...providedTables];
    const sourceTable = tables.find((tb) => tb.name === sourceTableName);
    const targetTable = tables.find((tb) => tb.name === targetTableName);
    if (!sourceTable || !targetTable) return <div />;
    return (
      <div style={{ pointerEvents: editable ? 'auto' : 'none' }}>
        <ZConfigRowTitle text={content.mappingType} />
        <Select
          bordered={false}
          size="large"
          style={{ ...styles.select, pointerEvents: 'none' }}
          value={supportedOptionalMapping.mappingType}
          showArrow={false}
        />
        <ZConfigRowTitle text={content.columnType} />
        <Select
          size="large"
          bordered={false}
          style={styles.select}
          placeholder={content.selectPlaceholder}
          value={mapping.type}
          onChange={(value) => {
            mapping = {
              name: mapping.name,
              type: value,
            } as SubsystemFragment_optionalColumnToColumnMappings;
            onOptionalMappingChange(mapping);
          }}
        >
          {ColumnTypes.filter((type) => !isMediaType(type)).map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        {mapping.type && (
          <>
            <ZConfigRowTitle text={`${supportedOptionalMapping.sourceTable}->column`} />
            {renderSelectColumnComponent(
              mapping.sourceColumnName,
              sourceTable.columnMetadata.filter((column) =>
                DataBindingHelper.isSameDataType(column.type, mapping.type)
              ),
              (column) => {
                mapping = {
                  ...mapping,
                  sourceColumnId: column.id,
                  sourceColumnName: column.name,
                };
                onOptionalMappingChange(mapping);
              }
            )}
            <ZConfigRowTitle text={`${supportedOptionalMapping.targetTable}->column`} />
            {renderSelectColumnComponent(
              mapping.targetColumnName,
              targetTable.columnMetadata.filter((column) =>
                DataBindingHelper.isSameDataType(column.type, mapping.type)
              ),
              (column) => {
                mapping = {
                  ...mapping,
                  targetColumnId: column.id,
                  targetColumnName: column.name,
                };
                onOptionalMappingChange(mapping);
              }
            )}
          </>
        )}
      </div>
    );
  };

  const renderOptionalRowToColumnMappingComponent = (
    editable: boolean,
    mapping: SubsystemFragment_optionalRowToColumnMappings,
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins,
    subsystemConfig:
      | SupportedSubsystems_supportedSubsystems
      | SupportedSubsystems_supportedSubsystems_pluginInfo,
    providedTables: TableMetadata[],
    onOptionalMappingChange: (mapping: SubsystemFragment_optionalRowToColumnMappings) => void
  ) => {
    const supportedOptionalMapping = subsystemConfig.optionalMappings.find(
      (om) => om.name === mapping.name
    ) as SupportedSubsystems_supportedSubsystems_optionalMappings_RowToColumnMappingConfig;
    if (!supportedOptionalMapping) return <div />;

    let targetTableName = subSystem.requiredTableMappings.find(
      (requiredTableMapping) => requiredTableMapping.name === supportedOptionalMapping.targetTable
    )?.tableName;
    if (!targetTableName) {
      targetTableName = supportedOptionalMapping.targetTable;
    }

    const targetTable = [...coreStore.dataModel.tableMetadata, ...providedTables].find(
      (tb) => tb.name === targetTableName
    );
    if (!targetTable) return <div />;
    return (
      <div style={{ pointerEvents: editable ? 'auto' : 'none' }}>
        <ZConfigRowTitle text={content.mappingType} />
        <Select
          bordered={false}
          size="large"
          style={{ ...styles.select, pointerEvents: 'none' }}
          value={supportedOptionalMapping.mappingType}
          showArrow={false}
        />
        <ZConfigRowTitle
          text={`${supportedOptionalMapping.sourceTable}->${supportedOptionalMapping.lookupColumn}`}
        />
        <ConfigInput
          style={styles.rowTitleInput}
          value={mapping.sourceKey}
          placeholder={content.inputPlaceholder}
          onSaveValue={(value) => {
            mapping = {
              ...mapping,
              sourceKey: value,
            };
            onOptionalMappingChange(mapping);
          }}
        />
        <ZConfigRowTitle text={`${supportedOptionalMapping.targetTable}->column`} />
        {renderSelectColumnComponent(
          mapping.targetColumnName,
          targetTable.columnMetadata,
          (column) => {
            mapping = {
              ...mapping,
              type: column.type as any,
              targetColumnId: column.id,
              targetColumnName: column.name,
            };
            onOptionalMappingChange(mapping);
          }
        )}
      </div>
    );
  };

  const renderOptionalArgToColumnMappingComponent = (
    editable: boolean,
    mapping: SubsystemFragment_optionalArgToColumnMappings,
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins,
    subsystemConfig:
      | SupportedSubsystems_supportedSubsystems
      | SupportedSubsystems_supportedSubsystems_pluginInfo,
    providedTables: TableMetadata[],
    onOptionalMappingChange: (mapping: SubsystemFragment_optionalArgToColumnMappings) => void
  ) => {
    const supportedOptionalMapping = subsystemConfig.optionalMappings.find(
      (om) => om.name === mapping.name
    ) as SupportedSubsystems_supportedSubsystems_optionalMappings_ArgToColumnMappingConfig;
    if (!supportedOptionalMapping) return <div />;

    let targetTableName = subSystem.requiredTableMappings.find(
      (requiredTableMapping) => requiredTableMapping.name === supportedOptionalMapping.targetTable
    )?.tableName;
    if (!targetTableName) {
      targetTableName = supportedOptionalMapping.targetTable;
    }

    const targetTable = [...coreStore.dataModel.tableMetadata, ...providedTables].find(
      (tb) => tb.name === targetTableName
    );
    if (!targetTable) return <div />;
    return (
      <div style={{ pointerEvents: editable ? 'auto' : 'none' }}>
        <ZConfigRowTitle text={content.mappingType} />
        <Select
          bordered={false}
          size="large"
          style={{ ...styles.select, pointerEvents: 'none' }}
          value={supportedOptionalMapping.mappingType}
          showArrow={false}
        />
        <ZConfigRowTitle text={content.argName} />
        <ConfigInput
          style={styles.rowTitleInput}
          value={mapping.sourceKey}
          placeholder={content.inputPlaceholder}
          onSaveValue={(value) => {
            mapping = {
              ...mapping,
              sourceKey: value,
            };
            onOptionalMappingChange(mapping);
          }}
        />
        <ZConfigRowTitle text={`${supportedOptionalMapping.targetTable}->column`} />
        {renderSelectColumnComponent(
          mapping.targetColumnName,
          targetTable.columnMetadata,
          (column) => {
            mapping = {
              ...mapping,
              type: column.type as any,
              targetColumnId: column.id,
              targetColumnName: column.name,
            };
            onOptionalMappingChange(mapping);
          }
        )}
      </div>
    );
  };

  const renderSubSystemSettingComponent = (
    editable: boolean,
    providedTables: TableMetadata[],
    subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins,
    subsystemConfig:
      | SupportedSubsystems_supportedSubsystems
      | SupportedSubsystems_supportedSubsystems_pluginInfo,
    onSubSystemChange: (subSystem: SubsystemFragment | SubsystemFragment_enabledPlugins) => void
  ) => {
    const optionalMappingLength =
      subSystem.optionalArgToColumnMappings.length +
      subSystem.optionalColumnToColumnMappings.length +
      subSystem.optionalRowToColumnMappings.length;
    const requiredTableMappingIsMutilated = !!subSystem.requiredTableMappings.find(
      (tm) => !!tm.tableName === false
    );

    return (
      <div>
        {subSystem.requiredTableMappings.length > 0 && (
          <div style={styles.containerMargin}>
            <ZConfigRowTitle text={content.requiredTableMappings} />
            <Collapse
              items={subSystem.requiredTableMappings.map((tableMapping, tmIdx) => ({
                title: tableMapping.name,
                content: renderTableMappingComponent(editable, tableMapping, (tm) => {
                  subSystem.requiredTableMappings = subSystem.requiredTableMappings.map(
                    (rtm, rtmIdx) => (tmIdx === rtmIdx ? tm : rtm)
                  ) as SubsystemFragment_requiredTableMappings[];
                  onSubSystemChange(subSystem);
                }),
              }))}
              bordered
              setContentFontColorToOrangeBecauseHistoryIsCruel
            />
          </div>
        )}

        {subSystem.optionalTableMappings.length > 0 && (
          <div style={styles.containerMargin}>
            <ZConfigRowTitle text={content.optionalTableMappings} />
            <Collapse
              items={subSystem.optionalTableMappings.map((tableMapping, tmIdx) => ({
                title: tableMapping.name,
                content: renderTableMappingComponent(editable, tableMapping, (tm) => {
                  subSystem.optionalTableMappings = subSystem.optionalTableMappings.map(
                    (rtm, rtmIdx) => (tmIdx === rtmIdx ? tm : rtm)
                  ) as SubsystemFragment_requiredTableMappings[];
                  onSubSystemChange(subSystem);
                }),
              }))}
              bordered
              setContentFontColorToOrangeBecauseHistoryIsCruel
            />
          </div>
        )}

        {subSystem.miscSettings.length > 0 && (
          <div style={styles.containerMargin}>
            <ZConfigRowTitle text={content.miscSettings} />
            <Collapse
              items={subSystem.miscSettings.map((miscSetting, msIdx) => ({
                title: miscSetting.key,
                content: (
                  <ConfigInput
                    style={{
                      ...styles.rowTitleInput,
                      pointerEvents: editable ? 'auto' : 'none',
                    }}
                    value={miscSetting.value}
                    placeholder={content.inputPlaceholder}
                    onSaveValue={(value) => {
                      subSystem.miscSettings = subSystem.miscSettings.map((ssc, sscIdx) =>
                        msIdx === sscIdx
                          ? {
                              ...miscSetting,
                              value,
                            }
                          : ssc
                      );
                      onSubSystemChange(subSystem);
                    }}
                  />
                ),
              }))}
              bordered
              setContentFontColorToOrangeBecauseHistoryIsCruel
            />
          </div>
        )}

        {subsystemConfig.optionalMappings.length > 0 && (
          <div style={styles.containerMargin}>
            {!requiredTableMappingIsMutilated && (
              <>
                <Row align="middle" justify="space-between">
                  <ZConfigRowTitle text={content.optionalMappings} />
                  {editable && (
                    <Dropdown
                      trigger={['click']}
                      placement="bottomCenter"
                      overlay={
                        <ZMenu
                          items={subsystemConfig.optionalMappings
                            .filter((optionalMapping) => {
                              if (optionalMapping.multiple) {
                                return true;
                              }
                              switch (optionalMapping.mappingType) {
                                case MappingType.COLUMN_TO_COLUMN: {
                                  return (
                                    subSystem.optionalColumnToColumnMappings.find(
                                      (occm) => occm.name === optionalMapping.name
                                    ) === undefined
                                  );
                                }
                                case MappingType.ROW_TO_COLUMN: {
                                  return (
                                    subSystem.optionalRowToColumnMappings.find(
                                      (orcm) => orcm.name === optionalMapping.name
                                    ) === undefined
                                  );
                                }
                                case MappingType.ARG_TO_COLUMN: {
                                  return (
                                    subSystem.optionalArgToColumnMappings.find(
                                      (oacm) => oacm.name === optionalMapping.name
                                    ) === undefined
                                  );
                                }
                                default:
                                  throw new Error(
                                    `unsupported mappingType, ${JSON.stringify(optionalMapping)}`
                                  );
                              }
                            })
                            .map((optionalMapping) => ({
                              key: optionalMapping.name,
                              onClick: () =>
                                onOptionalMappingSelect(
                                  subSystem,
                                  optionalMapping,
                                  onSubSystemChange
                                ),
                              title: optionalMapping.name,
                            }))}
                        />
                      }
                    >
                      <div style={styles.buttonContainer}>
                        <PlusOutlined />
                      </div>
                    </Dropdown>
                  )}
                </Row>
                {optionalMappingLength > 0 ? (
                  <>
                    <Collapse
                      setContentFontColorToOrangeBecauseHistoryIsCruel
                      items={[
                        ...subSystem.optionalColumnToColumnMappings.map((mapping, mIdx) => ({
                          title: mapping.name,
                          icon: editable && (
                            <DeleteFilled
                              onClick={(e) => {
                                e.stopPropagation();
                                subSystem.optionalColumnToColumnMappings =
                                  subSystem.optionalColumnToColumnMappings.filter(
                                    (_, occmIdx) => mIdx !== occmIdx
                                  );
                                onSubSystemChange(subSystem);
                              }}
                            />
                          ),
                          content: renderOptionalColumnToColumnMappingComponent(
                            editable,
                            mapping,
                            subSystem,
                            subsystemConfig,
                            providedTables,
                            (result) => {
                              subSystem.optionalColumnToColumnMappings =
                                subSystem.optionalColumnToColumnMappings.map((occm, occmIdx) =>
                                  mIdx === occmIdx ? result : occm
                                );
                              onSubSystemChange(subSystem);
                            }
                          ),
                        })),
                        ...subSystem.optionalRowToColumnMappings.map((mapping, mIdx) => ({
                          title: mapping.name,
                          icon: editable && (
                            <DeleteFilled
                              onClick={(e) => {
                                e.stopPropagation();
                                subSystem.optionalRowToColumnMappings =
                                  subSystem.optionalRowToColumnMappings.filter(
                                    (_, occmIdx) => mIdx !== occmIdx
                                  );
                                onSubSystemChange(subSystem);
                              }}
                            />
                          ),
                          content: renderOptionalRowToColumnMappingComponent(
                            editable,
                            mapping,
                            subSystem,
                            subsystemConfig,
                            providedTables,
                            (result) => {
                              subSystem.optionalRowToColumnMappings =
                                subSystem.optionalRowToColumnMappings.map((occm, occmIdx) =>
                                  mIdx === occmIdx ? result : occm
                                );
                              onSubSystemChange(subSystem);
                            }
                          ),
                        })),
                        ...subSystem.optionalArgToColumnMappings.map((mapping, mIdx) => ({
                          title: mapping.name,
                          icon: editable && (
                            <DeleteFilled
                              onClick={(e) => {
                                e.stopPropagation();
                                subSystem.optionalArgToColumnMappings =
                                  subSystem.optionalArgToColumnMappings.filter(
                                    (_, occmIdx) => mIdx !== occmIdx
                                  );
                                onSubSystemChange(subSystem);
                              }}
                            />
                          ),
                          content: renderOptionalArgToColumnMappingComponent(
                            editable,
                            mapping,
                            subSystem,
                            subsystemConfig,
                            providedTables,
                            (result) => {
                              subSystem.optionalArgToColumnMappings =
                                subSystem.optionalArgToColumnMappings.map((occm, occmIdx) =>
                                  mIdx === occmIdx ? result : occm
                                );
                              onSubSystemChange(subSystem);
                            }
                          ),
                        })),
                      ]}
                      bordered
                    />
                  </>
                ) : (
                  <div style={{ ...styles.emptyContent, color: ZThemedColors.SECONDARY_TEXT }}>
                    {content.noOptionalMapping}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSubSystemPluginComponent = (
    subSystem: SubsystemFragment,
    subSystemPlugin: SubsystemFragment_enabledPlugins,
    onSubSystemPluginChange: (subSystemPlugin: SubsystemFragment_enabledPlugins) => void
  ) => {
    const subsystemConfig = subsystemConfigList.find(
      (sss) => sss.subsystemType === subSystem.subsystemType
    );
    if (!subsystemConfig) return <div />;

    const subsystemPluginConfig = subsystemConfig.pluginInfo.find(
      (pi) => pi?.pluginType === subSystemPlugin.pluginType
    );
    if (!subsystemPluginConfig) return <div />;

    return (
      <div>
        <div style={styles.containerMargin}>
          <ZConfigRowTitle text={content.pluginType} />
          <Select
            bordered={false}
            size="large"
            style={{ ...styles.select, pointerEvents: 'none' }}
            value={subSystemPlugin.pluginType ?? undefined}
            showArrow={false}
          />
        </div>
        {renderSubSystemSettingComponent(
          subSystem.exId === undefined,
          [...subsystemConfig.providedTables, ...subsystemPluginConfig.providedTables],
          subSystemPlugin,
          subsystemPluginConfig,
          (ssp) => {
            onSubSystemPluginChange(ssp as SubsystemFragment_enabledPlugins);
          }
        )}
      </div>
    );
  };

  const renderSubSystemComponent = (
    subSystem: SubsystemFragment,
    index: number,
    onSubSystemChange: (subSystem: SubsystemFragment) => void
  ) => {
    const subsystemConfig = subsystemConfigList.find(
      (sss) => sss.subsystemType === subSystem.subsystemType
    );
    if (!subsystemConfig) return <div />;

    const canSelectPlugins = (
      subsystemConfig.pluginInfo as SupportedSubsystems_supportedSubsystems_pluginInfo[]
    ).filter(
      (plugin) => !subSystem.enabledPlugins.find((ep) => ep?.pluginType === plugin.pluginType)
    );

    return (
      <div>
        <div style={styles.containerMargin}>
          <ZConfigRowTitle text={content.subsystemType} />
          <Select
            bordered={false}
            size="large"
            style={{ ...styles.select, pointerEvents: 'none' }}
            value={subSystem.subsystemType ?? undefined}
            showArrow={false}
          />
        </div>
        {renderSubSystemSettingComponent(
          subSystem.exId === undefined,
          subsystemConfig.providedTables,
          subSystem,
          subsystemConfig,
          (ss) => onSubSystemChange(ss as SubsystemFragment)
        )}

        {subsystemConfig.pluginInfo.length > 0 && (
          <>
            <Row align="middle" justify="space-between">
              <ZConfigRowTitle text={content.plugins} />
              {subSystem.exId ? (
                <div />
              ) : (
                <Dropdown
                  trigger={['click']}
                  placement="bottomCenter"
                  overlay={
                    <ZMenu
                      items={canSelectPlugins.map((plugin) => ({
                        key: plugin.pluginType,
                        onClick: () => addPluginMapping(plugin, subSystem, index),
                        title: plugin.pluginType,
                      }))}
                    />
                  }
                >
                  <div style={styles.buttonContainer}>
                    <PlusOutlined />
                  </div>
                </Dropdown>
              )}
            </Row>
            {subSystem.enabledPlugins.length > 0 ? (
              <Collapse
                items={(
                  subSystem.enabledPlugins.filter(
                    (plugin) => plugin
                  ) as SubsystemFragment_enabledPlugins[]
                ).map((plugin, pluginIndex) => ({
                  title: plugin.pluginType,
                  content: renderSubSystemPluginComponent(subSystem, plugin, (ssp) => {
                    subSystem.enabledPlugins = subSystem.enabledPlugins.map((ep, epIndex) =>
                      epIndex === pluginIndex ? ssp : ep
                    );
                    onSubSystemChange(subSystem);
                  }),
                }))}
                bordered
                setContentFontColorToOrangeBecauseHistoryIsCruel
              />
            ) : (
              <div style={{ ...styles.emptyContent, color: ZThemedColors.SECONDARY_TEXT }}>
                {content.noPlugin}
              </div>
            )}
          </>
        )}

        {subSystem.exId ? (
          <div />
        ) : (
          <LeftDrawerButton
            type="primary"
            text={content.save}
            handleOnClick={() => saveSubSystemMappings(subSystem, index)}
          />
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <LeftDrawerTitle textStyle={styles.titleText}>{content.subsystems}</LeftDrawerTitle>
        <Dropdown
          trigger={['click']}
          placement="bottomCenter"
          overlay={
            <ZMenu
              items={subsystemConfigList
                .filter((subsystemConfig) => {
                  return (
                    subSystemList.find(
                      (subSystem) => subSystem.subsystemType === subsystemConfig.subsystemType
                    ) === undefined
                  );
                })
                .map((ss) => ({
                  key: ss.subsystemType,
                  onClick: () => addSubSystemMapping(ss),
                  title: ss.subsystemType,
                }))}
            />
          }
        >
          <img alt="" style={styles.plusIcon} src={PlusIcon} />
        </Dropdown>
      </div>
      {subSystemList.length > 0 ? (
        <>
          <Collapse
            items={subSystemList.map((subSystem, index) => ({
              title: subSystem.subsystemType,
              icon: !subSystem.exId && (
                <DeleteFilled
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubSystemList(subSystemList.filter((ssm, ssmIndex) => ssmIndex !== index));
                  }}
                />
              ),
              content: renderSubSystemComponent(subSystem, index, (data: SubsystemFragment) => {
                setSubSystemList(
                  subSystemList.map((ssm, ssmIndex) => (ssmIndex === index ? data : ssm))
                );
              }),
            }))}
            bordered
            setContentFontColorToOrangeBecauseHistoryIsCruel
          />
        </>
      ) : (
        <div style={styles.emptyContent}>{content.noSubsystem}</div>
      )}
      {loading && (
        <div style={styles.spinContainer}>
          <Spin style={styles.spin} size="large" spinning />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    padding: '14px 6px 8px 6px',
  },
  titleContainer: {
    display: 'flex',
    marginBottom: '20px',
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    flex: 1,
  },
  plusIcon: {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    textAlign: 'center',
  },
  emptyContent: {
    borderWidth: '1px',
    color: ZThemedColors.ACCENT,
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinContainer: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
  },
  spin: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  rowTitleInput: {
    flex: 1,
    fontSize: '10px',
    fontWeight: 700,
    lineHeight: '14px',
    color: ZColors.BLACK,
    backgroundColor: ZColors.WHITE_LIKE_GREY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    border: 'none',
  },
  containerMargin: {
    marginBottom: '25px',
  },
};
