import React, { ReactElement, useState } from 'react';
import cx from 'classnames';
import { MoreOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { useQuery } from '@apollo/client';
import cssModule from './DataModelTab.module.scss';
import i18n from './DataModelTab.i18n.json';
import useLocale from '../../hooks/useLocale';
import { GQL_IMMUTABLE_APP_SCHEMA } from '../../graphQL/immutableAppSchema';
import {
  ConstraintMetadata,
  DataModel,
  RelationMetadata,
  TableMetadata,
} from '../../shared/type-definition/DataModel';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import { Dropdown, message, Modal, ZMenu } from '../../zui';
import { TableCreateForm } from './TableCreateForm';
import { useMutations } from '../../hooks/useMutations';
import { TableEditForm } from './TableEditForm';
import { TableConstraintEdit } from './TableConstraintEdit';
import useStores from '../../hooks/useStores';
import { DataModelColumnsTab } from './DataModelColumnsTab';
import { DataModelRelationsTab } from './DataModelRelationsTab';
import { ColumnCreateForm } from './ColumnCreateForm';
import { RelationCreateForm } from './RelationCreateForm';
import DataModelAddIcon from '../../shared/assets/icons/data-model-add.svg';
import { DataModeTabUML } from './DataModelTabUML';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { AllStores } from '../../mobx/StoreContexts';
import { MenuClickEventInfo } from '../../zui/Menu';
import { FeatureType } from '../../graphQL/__generated__/globalTypes';

export const DataModelTab = observer((): NullableReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { transaction, dataModelMutations } = useMutations();
  const { dataModelStore, featureStore } = useStores();
  const dataModelMetaData = useDataModelMetadata();
  const tableMetadata = dataModelMetaData.tableMetadata.filter((table) => table.schemaModifiable);
  if (!tableMetadata.length) return null;

  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number>(0);
  const [tableCreationVisible, setTableCreationVisible] = useState<boolean>(false);
  const [apiDefinitionEditVisible, setApiDefinitionEditVisible] = useState<boolean>(false);
  const [constraintEditVisible, setConstraintEditVisible] = useState<boolean>(false);
  const [columnCreationVisible, setColumnCreationVisible] = useState<boolean>(false);
  const [relationCreationVisible, setRelationCreationVisible] = useState<boolean>(false);

  const getSelectedTableMetadata = (): TableMetadata => {
    if (tableMetadata[selectedObjectIndex]) {
      return tableMetadata[selectedObjectIndex];
    }
    setSelectedObjectIndex(0);
    return tableMetadata[0];
  };
  const [centerTableName, setCenterTableName] = useState<string>(getSelectedTableMetadata().name);

  const deleteTable = (tableData: TableMetadata): void => {
    const deleteRelations = dataModelMetaData.relationMetadata.filter(
      (target) => target.sourceTable === tableData.name || target.targetTable === tableData.name
    );
    Modal.confirm({
      okType: 'danger',
      title: `${localizedContent.warning.confirm} ${tableData.name} ${localizedContent.warning.table}?`,
      content:
        deleteRelations.length > 0 ? (
          <>
            {localizedContent.warning.also}{' '}
            {deleteRelations.map((relation) => relation.nameInSource).join(', ')}{' '}
            {localizedContent.warning.relation}
          </>
        ) : null,
      onOk: () => {
        transaction(() => {
          dataModelMutations.removeDataModelRelations(deleteRelations);
          dataModelMutations.removeDataModel(tableData.name);
        });
      },
    });
  };

  const handleActions = {
    schema: {
      create: (form: any) => {
        dataModelStore
          .createTable(form, dataModelMutations)
          .then((result) => {
            setTableCreationVisible(false);
          })
          .catch((error) => {
            message.error(JSON.stringify(error));
          });
      },
    },
    column: {
      create: (form: any) => {
        const selectedTableMetadata = getSelectedTableMetadata();
        dataModelStore.createColumn(form, selectedTableMetadata, dataModelMutations);
        setColumnCreationVisible(false);
      },
    },
    relation: {
      create: (form: any) => {
        const selectedTableMetadata = getSelectedTableMetadata();
        const newRelation: RelationMetadata = {
          ...form,
          sourceTable: selectedTableMetadata.name,
          sourceColumn: 'id',
        };
        dataModelStore.createRelation(newRelation, dataModelMutations);
        setRelationCreationVisible(false);
      },
    },
    apiDefinition: {
      update: (form: any) => {
        const selectedTableMetadata = getSelectedTableMetadata();
        dataModelStore.updateTableApiDefinitions(
          form.apiDefinitions ?? [],
          selectedTableMetadata,
          dataModelMutations
        );
        setApiDefinitionEditVisible(false);
      },
    },
    constraint: {
      update: (form: { list: (ConstraintMetadata & { type: string; saved: boolean })[] }) => {
        const selectedTableMetadata = getSelectedTableMetadata();
        const constraints: ConstraintMetadata[] = form.list.map((constraint) => {
          const { type, saved, ...data } = constraint;
          return data;
        });
        dataModelStore.updateTableConstraintMetadata(
          constraints,
          selectedTableMetadata,
          dataModelMutations
        );
        setConstraintEditVisible(false);
      },
    },
  };

  const renderTableList = (): ReactElement => {
    return (
      <div className={cssModule.tableList}>
        <div className={cssModule.header}>
          <div className={cssModule.dataSetting}>{localizedContent.title.dataSetting}</div>
          <div
            className={cssModule.addModel}
            onClick={(e) => {
              e.stopPropagation();
              setTableCreationVisible(true);
            }}
          >
            <span>{localizedContent.title.addModel}</span>
          </div>
        </div>
        <div className={cssModule.objectButtonList}>
          {tableMetadata.map((table, idx) => (
            <div
              className={cx(cssModule.objectButton, {
                [cssModule.selectedObjectButton]: idx === selectedObjectIndex,
              })}
              key={table.name}
              onClick={() => {
                setSelectedObjectIndex(idx);
                setCenterTableName(table.name);
              }}
            >
              <div className={cssModule.buttonContent}>{table.name}</div>
              {selectedObjectIndex === idx && renderTableTool(table)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { projectDetails } = AllStores.projectStore;
  const appSchema = useQuery(GQL_IMMUTABLE_APP_SCHEMA, {
    variables: {
      projectExId: projectDetails?.projectExId,
      schemaExId: projectDetails?.schemaExId,
    },
  });
  const immutableDataModel: DataModel | undefined =
    appSchema.data?.project?.projectSchema?.immutableAppSchema?.dataModel;

  const checkTableDeletable = (table: TableMetadata): boolean => {
    if (!featureStore.isFeatureAccessible(FeatureType.DATA_MODEL_DELETE)) return false;
    return immutableDataModel
      ? !immutableDataModel.tableMetadata.find((item) => item.name === table.name)
      : false;
  };

  const renderTableTool = (table: TableMetadata) => {
    const items = [
      {
        key: 'permission',
        onClick: (param: MenuClickEventInfo) => {
          param.domEvent.stopPropagation();
          setApiDefinitionEditVisible(true);
        },
        title: localizedContent.title.editPermissions,
      },
      {
        key: 'constraint',
        onClick: (param: MenuClickEventInfo) => {
          param.domEvent.stopPropagation();
          setConstraintEditVisible(true);
        },
        title: localizedContent.title.editConstraints,
      },
    ];
    if (checkTableDeletable(table))
      items.push({
        key: 'delete',
        onClick: (param: MenuClickEventInfo) => {
          param.domEvent.stopPropagation();
          deleteTable(table);
        },
        title: localizedContent.title.delete,
      });
    return (
      <Dropdown overlay={<ZMenu items={items} />} trigger={['click']}>
        <MoreOutlined className={cssModule.moreIcon} onClick={(e) => e.stopPropagation()} />
      </Dropdown>
    );
  };

  const renderTableDetail = (): ReactElement => {
    const selectedTableMetadata = getSelectedTableMetadata();
    return (
      <div className={cssModule.tableDetail}>
        {renderRow(localizedContent.title.columns, () => {
          setColumnCreationVisible(true);
        })}
        <DataModelColumnsTab
          tableMetadata={selectedTableMetadata}
          deletable={featureStore.isFeatureAccessible(FeatureType.DATA_MODEL_DELETE)}
          immutableDataModel={immutableDataModel}
        />
        {renderRow(localizedContent.title.relations, () => {
          setRelationCreationVisible(true);
        })}
        <DataModelRelationsTab
          tableMetadata={selectedTableMetadata}
          deletable={featureStore.isFeatureAccessible(FeatureType.DATA_MODEL_DELETE)}
          immutableDataModel={immutableDataModel}
        />
      </div>
    );
  };

  const renderRow = (title: string, onAddAction?: () => void): ReactElement => {
    return (
      <div className={cssModule.row}>
        <div className={cssModule.detailTitle}>{title}</div>
        {onAddAction && (
          <div
            className={cssModule.detailAddIcon}
            onClick={(event) => {
              event.stopPropagation();
              onAddAction();
            }}
          >
            <img alt="" src={DataModelAddIcon} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cssModule.container}>
      <div className={cssModule.title}>{localizedContent.title.dataModel}</div>
      <div className={cssModule.content}>
        <DataModeTabUML
          tableMetadata={dataModelMetaData.tableMetadata.filter((table) => table.schemaModifiable)}
          centerTableName={centerTableName}
          selectedTableName={getSelectedTableMetadata().name}
          onTableSelected={(table) => {
            const index = tableMetadata.findIndex((v) => v.name === table);
            setSelectedObjectIndex(index);
          }}
        />
        <div className={cssModule.configContainer}>
          {renderTableList()}
          {renderTableDetail()}
        </div>
      </div>
      {tableCreationVisible && (
        <TableCreateForm
          onCancel={() => setTableCreationVisible(false)}
          onSubmit={handleActions.schema.create}
        />
      )}
      {apiDefinitionEditVisible && (
        <TableEditForm
          onCancel={() => setApiDefinitionEditVisible(false)}
          table={getSelectedTableMetadata()}
          onSubmit={handleActions.apiDefinition.update}
        />
      )}
      {constraintEditVisible && (
        <TableConstraintEdit
          table={getSelectedTableMetadata()}
          constraint={getSelectedTableMetadata().constraintMetadata ?? []}
          onCancel={() => setConstraintEditVisible(false)}
          onSubmit={handleActions.constraint.update}
        />
      )}
      {columnCreationVisible && (
        <ColumnCreateForm
          onCancel={() => setColumnCreationVisible(false)}
          onSubmit={handleActions.column.create}
        />
      )}
      {relationCreationVisible && (
        <RelationCreateForm
          schemaNames={tableMetadata.map((tmd) => tmd.name)}
          onCancel={() => setRelationCreationVisible(false)}
          onSubmit={handleActions.relation.create}
        />
      )}
    </div>
  );
});
