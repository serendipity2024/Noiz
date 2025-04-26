/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/client';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { GQL_CREATE_FUNCTORS } from '../../graphQL/functorApi';
import VALIDATE_LEGAL_TABLE_NAME from '../../graphQL/table';
import {
  CONVERT_API_SCHEMA_TO_GRAPHQL_SCHEMA,
  UPLOAD_THIRD_PARTY_API_SCHEMA,
} from '../../graphQL/thirdPartyApi';
import {
  CreateFunctors,
  CreateFunctorsVariables,
} from '../../graphQL/__generated__/CreateFunctors';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import useLocale from '../../hooks/useLocale';
import useNotificationDisplay from '../../hooks/useNotificationDisplay';
import useProjectDetails from '../../hooks/useProjectDetails';
import useStores from '../../hooks/useStores';
import { useMutations } from '../../hooks/useMutations';
import BooleanIcon from '../../shared/assets/icons/data-type/boolean.svg';
import DateIcon from '../../shared/assets/icons/data-type/date.svg';
import DecimalIcon from '../../shared/assets/icons/data-type/decimal.svg';
import DefaultIcon from '../../shared/assets/icons/data-type/default.svg';
import ImageIcon from '../../shared/assets/icons/data-type/image.svg';
import JsonbIcon from '../../shared/assets/icons/data-type/jsonb.svg';
import NumberIcon from '../../shared/assets/icons/data-type/number.svg';
import TextIcon from '../../shared/assets/icons/data-type/text.svg';
import TimeIcon from '../../shared/assets/icons/data-type/time.svg';
import VideoIcon from '../../shared/assets/icons/data-type/video.svg';
import ManyToManyIcon from '../../shared/assets/icons/relation-type/many_to_many.svg';
import OneToManyIcon from '../../shared/assets/icons/relation-type/one-to-many.svg';
import OneIcon from '../../shared/assets/icons/relation-type/one-to-one.svg';
import {
  BaseType,
  ColumnMetadata,
  ColumnType,
  ConstraintMetadata,
  DecimalType,
  IntegerType,
  JsonType,
  MediaType,
  RelationMetadata,
  RelationType,
  TableMetadata,
  TimeType,
} from '../../shared/type-definition/DataModel';
import { FunctorApi } from '../../shared/type-definition/FunctorSchema';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import ConfigButton from '../side-drawer-tabs/left-drawer/shared/ConfigButton';
import LeftDrawerTitle from '../side-drawer-tabs/left-drawer/shared/LeftDrawerTitle';
import { ColumnCreateForm } from './ColumnCreateForm';
import { ColumnEditForm } from './ColumnEditForm';
import { DataViewer } from './DataViewer';
import FunctorCreateForm from './FunctorCreateForm';
import { RelationCreateForm } from './RelationCreateForm';
import { RelationEditForm } from './RelationEditForm';
import i18n from './SideDataModelDesigner.i18n.json';
import './SideDataModelDesigner.scss';
import { TableConstraintEdit } from './TableConstraintEdit';
import { TableCreateForm } from './TableCreateForm';
import { TableEditForm } from './TableEditForm';
import { Card, Collapse, Dropdown, List, ZMenu, message, Modal, Tooltip, Upload } from '../../zui';
import { MenuClickEventInfo } from '../../zui/Menu';

type EditingColumnMetadataState = {
  table: TableMetadata;
  metadata: ColumnMetadata;
};

type EditingRealtionSchemaState = {
  table: TableMetadata;
  relationSchema: RelationMetadata;
};

type EditingConstraintMetadataState = {
  table: TableMetadata;
  metadata: ConstraintMetadata[];
};

type RelationshipType = {
  relationName: string;
  relation: RelationType;
  isSource: boolean;
  targetTable: string;
};

interface RelationIconProps {
  isSource: boolean;
  relation: RelationType;
}

export const RelationIcon = (props: RelationIconProps): JSX.Element => {
  const { localizedContent: content } = useLocale(i18n);
  const { relation, isSource } = props;
  switch (relation) {
    case RelationType.ONE_TO_ONE:
      return (
        <Tooltip title={content.relation.one_to_one}>
          <img src={OneIcon} alt={content.relation.one_to_one} style={styles.relationIcon} />
        </Tooltip>
      );
    case RelationType.ONE_TO_MANY:
      return (
        <Tooltip title={isSource ? content.relation.one_to_many : content.relation.many_to_one}>
          <img
            src={OneToManyIcon}
            alt={isSource ? content.relation.one_to_many : content.relation.many_to_one}
            style={{ ...styles.relationIcon, ...(isSource ? {} : styles.flip) }}
          />
        </Tooltip>
      );
    case RelationType.MANY_TO_MANY:
      return (
        <Tooltip title={content.relation.many_to_many}>
          <img
            src={ManyToManyIcon}
            alt={content.relation.many_to_many}
            style={styles.dataModelIcon}
          />
        </Tooltip>
      );
    default:
      return <></>;
  }
};

export const prepareRelations = (
  relationMetadata: RelationMetadata,
  tableName: string
): RelationshipType[] => {
  const relations: RelationshipType[] = [];
  if (relationMetadata.sourceTable === tableName) {
    relations.push({
      relationName: relationMetadata.nameInSource,
      relation: relationMetadata.type,
      isSource: true,
      targetTable: relationMetadata.targetTable,
    });
  }
  if (relationMetadata.targetTable === tableName) {
    relations.push({
      relationName: relationMetadata.nameInTarget,
      relation: relationMetadata.type,
      isSource: false,
      targetTable: relationMetadata.sourceTable,
    });
  }
  if (relations.length <= 0)
    throw new Error(
      `Unsupported relation data, schema: ${tableName}, relation: ${JSON.stringify(
        relationMetadata
      )}`
    );
  return relations;
};

export default observer(function SideDataModelDesigner(): NullableReactElement {
  const client = useApolloClient();
  const notification = useNotificationDisplay();
  const { projectExId } = useProjectDetails();
  const { tableMetadata, relationMetadata } = useDataModelMetadata();
  const { coreStore } = useStores();
  const { dataModelMutations } = useMutations();

  const [tableCreationFormVisible, setTableCreationFormVisible] = useState(false);
  const [tableMeta, setTableMeta] = useState<TableMetadata | null>();
  const [tableMetaEdit, setTableMetaEdit] = useState<TableMetadata | null>();
  const [columnMeta, setColumnMeta] = useState<TableMetadata | null>();
  const [columnMetaEdit, setColumnMetaEdit] = useState<EditingColumnMetadataState | null>();
  const [relationMeta, setRelationMeta] = useState<TableMetadata | null>();
  const [relationMetaEdit, setRelationMetaEdit] = useState<EditingRealtionSchemaState | null>();
  const [constraintMetaEdit, setConstraintMetaEdit] =
    useState<EditingConstraintMetadataState | null>();
  const [functorCreationFormVisible, setFunctorCreationFormVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { localizedContent: content } = useLocale(i18n);

  // schema
  const handleActions = {
    schema: {
      create: async (form: any) => {
        try {
          const convertResult = await client.query({
            query: VALIDATE_LEGAL_TABLE_NAME,
            variables: {
              tableName: form.displayName,
              existTableSet: tableMetadata.map((tmd) => tmd.name),
            },
          });
          if (convertResult.data?.validateLegalTableName) {
            dataModelMutations.addDataModel(form);
            setTableCreationFormVisible(false);
          }
        } catch (error) {
          message.error(JSON.stringify(error));
        }
      },
      update: (form: any) => {
        if (!tableMetaEdit) return;
        dataModelMutations.updateDataModel({ ...form, name: tableMetaEdit.name });
        setTableMetaEdit(null);
      },
      delete: (schema: TableMetadata) => {
        Modal.confirm({
          okType: 'danger',
          title: `Are you sure delete Model: ${schema.name}`,
          onOk: () => dataModelMutations.removeDataModel(schema.name),
        });
      },
    },
    column: {
      create: (form: any) => {
        if (!columnMeta) return;
        dataModelMutations.addDataModelColumn(columnMeta.name, form);
        setColumnMeta(null);
      },
      update: (form: any) => {
        if (!columnMetaEdit) return;
        const schemaName = columnMetaEdit.table.name;
        dataModelMutations.updateDataModelColumn(schemaName, form);
        setColumnMetaEdit(null);
      },
      delete: (table: TableMetadata, attr: ColumnMetadata) => {
        Modal.confirm({
          okType: 'danger',
          title: `Are you sure delete Attr: ${attr.name}`,
          onOk: () => dataModelMutations.removeDataModelColumn(table.name, attr.id),
        });
      },
    },
    relation: {
      create: (form: any) => {
        if (!relationMeta) return;
        const newRelation = {
          ...form,
          sourceTable: relationMeta.name,
          sourceColumn: 'id',
        };
        dataModelMutations.addDataModelRelation(newRelation);
        setRelationMeta(null);
      },
      update: (form: any) => {
        if (!relationMetaEdit) return;
        // TODO: bug - unhandled action
        // dispatch({
        //   type: coreActions.UPDATE_DATA_MODEL_RELATION,
        //   payload: { schemaId: relationMetaEdit.table.name, relation: form },
        // });
        // coreStore.updateDataModelRelation(relationMetaEdit.table.name, form)
        setRelationMetaEdit(null);
      },
      delete: (relation: RelationMetadata) => {
        Modal.confirm({
          okType: 'danger',
          title: `Are you sure delete Relation: ${relation.nameInSource}`,
          onOk: () => dataModelMutations.removeDataModelRelation(relation),
        });
      },
    },
    constraint: {
      update: (form: { list: (ConstraintMetadata & { type: string; saved: boolean })[] }) => {
        if (!constraintMetaEdit) return;
        const constraints: ConstraintMetadata[] = form.list.map((constraint) => {
          const { type, saved, ...data } = constraint;
          return data;
        });
        dataModelMutations.updateDataModel({
          ...constraintMetaEdit.table,
          constraintMetadata: constraints,
        });
        setConstraintMetaEdit(null);
      },
    },
    thirdPartyApi: {
      upload: async (apiSchema: string) => {
        setUploading(true);
        try {
          const convertResult = await client.query({
            query: CONVERT_API_SCHEMA_TO_GRAPHQL_SCHEMA,
            fetchPolicy: 'network-only',
            variables: {
              apiSchema: JSON.parse(apiSchema),
            },
          });
          const uploadResult = await client.mutate({
            mutation: UPLOAD_THIRD_PARTY_API_SCHEMA,
            variables: {
              projectExId,
              thirdPartyApiSchema: JSON.parse(apiSchema),
            },
          });
          if (
            uploadResult.data.uploadThirdPartyApiSchema &&
            convertResult.data.convertApiSchemaToGraphqlSchema
          ) {
            coreStore.updateRemoteApiSchema(convertResult.data.convertApiSchemaToGraphqlSchema);
            notification('UPLOAD_THIRD_PARTY_API_SUCCESS');
          }
        } catch (error) {
          notification('UPLOAD_THIRD_PARTY_API_FAILURE');
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        } finally {
          setUploading(false);
        }
      },
    },
    functorApi: {
      upload: async (functorSchema: string) => {
        setUploading(true);
        try {
          const convertResult = await client.mutate<CreateFunctors, CreateFunctorsVariables>({
            mutation: GQL_CREATE_FUNCTORS,
            variables: {
              functorDefinitions: JSON.parse(functorSchema),
              projectExId,
            },
          });
          if (convertResult.data?.createFunctors) {
            coreStore.updateFunctors(
              convertResult.data.createFunctors.map((functor) => functor as FunctorApi)
            );
            notification('UPLOAD_FUNCTOR_API_SUCCESS');
          }
        } catch (error) {
          notification('UPLOAD_FUNCTOR_API_FAILURE');
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        } finally {
          setUploading(false);
        }
      },
    },
  };

  const getSourceByColumnType = (type: ColumnType) => {
    switch (type) {
      case BaseType.BOOLEAN:
        return BooleanIcon;
      case JsonType.JSONB:
        return JsonbIcon;
      case BaseType.TEXT:
        return TextIcon;
      case TimeType.DATE:
        return DateIcon;
      case TimeType.TIMESTAMPTZ:
        return TimeIcon;
      case TimeType.TIMETZ:
        return TimeIcon;
      case IntegerType.BIGINT:
        return NumberIcon;
      case IntegerType.BIGSERIAL:
        return NumberIcon;
      case IntegerType.INTEGER:
        return NumberIcon;
      case DecimalType.DECIMAL:
        return DecimalIcon;
      case DecimalType.FLOAT8:
        return DecimalIcon;
      case MediaType.IMAGE:
        return ImageIcon;
      case MediaType.VIDEO:
        return VideoIcon;
      default:
        return DefaultIcon;
    }
  };

  const renderDataModelTableSchema = (schema: TableMetadata) => {
    const getRelationMeta = (): RelationMetadata[] =>
      relationMetadata.filter(
        (relation) => relation.sourceTable === schema.name || relation.targetTable === schema.name
      );

    const splitLocation = /([_\-A-Z])/;
    const splitLongString = (string: string) =>
      string.split(splitLocation).map((str, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          {splitLocation.test(str) ? <wbr /> : <></>}
          {str}
        </React.Fragment>
      ));

    const renderPanelExtra = () => {
      const menu = (
        <ZMenu
          items={[
            {
              key: 'permission',
              icon: <EditOutlined />,
              onClick: (param: MenuClickEventInfo) => {
                param.domEvent.stopPropagation();
                setTableMetaEdit(schema);
              },
              title: content.button.editPermission,
            },
            {
              key: 'constraint',
              icon: <EditOutlined />,
              onClick: (param: MenuClickEventInfo) => {
                param.domEvent.stopPropagation();
                setConstraintMetaEdit({ table: schema, metadata: schema.constraintMetadata ?? [] });
              },
              title: content.button.editConstraint,
            },
          ]}
        />
      );
      return (
        <Dropdown overlay={menu} trigger={['click', 'hover']}>
          <MoreOutlined onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      );
    };
    const renderColumnMeta = (metadata: ColumnMetadata) => (
      <List.Item key={metadata.name}>
        <List.Item.Meta
          avatar={
            <Tooltip title={metadata.type}>
              <img alt="" style={styles.dataModelIcon} src={getSourceByColumnType(metadata.type)} />
            </Tooltip>
          }
          title={<span style={styles.nameStyle}>{splitLongString(metadata.name)}</span>}
        />
        {metadata.systemDefined || (
          <span className="actions" style={styles.hidden}>
            <EditOutlined onClick={() => setColumnMetaEdit({ table: schema, metadata })} />
            <DeleteOutlined
              className="danger"
              onClick={() => handleActions.column.delete(schema, metadata)}
            />
          </span>
        )}
      </List.Item>
    );
    const renderRelationMeta = (relation: RelationMetadata) => {
      const relations = prepareRelations(relation, schema.name);
      return (
        <div key={JSON.stringify(relations)}>
          {relations.map(({ relationName, relation: relationType, isSource, targetTable }) => (
            <List.Item key={relationName}>
              <List.Item.Meta
                avatar={<RelationIcon relation={relationType} isSource={isSource} />}
                title={
                  <span style={styles.nameStyle}>
                    {splitLongString(relationName)}
                    <br />
                    {splitLongString(`(${targetTable})`)}
                  </span>
                }
              />
              <span className="actions" style={styles.hidden}>
                <DeleteOutlined
                  className="danger"
                  onClick={() => handleActions.relation.delete(relation)}
                />
              </span>
            </List.Item>
          ))}
        </div>
      );
    };

    return {
      title: schema.name,
      icon: renderPanelExtra(),
      content: (
        <>
          <Card
            title={content.title.columns}
            extra={<PlusOutlined onClick={() => setColumnMeta(schema)} />}
          >
            <List className="columnMetadata" size="small" split={false}>
              {schema.columnMetadata.filter((meta: any) => !meta.uiHidden).map(renderColumnMeta)}
            </List>
          </Card>
          <Card
            title={content.title.relations}
            extra={<PlusOutlined onClick={() => setRelationMeta(schema)} />}
          >
            <List className="columnMetadata" size="small" split={false}>
              {getRelationMeta().map(renderRelationMeta)}
            </List>
          </Card>
        </>
      ),
    };
  };

  return (
    <div className="sideDataModelDesigner">
      <LeftDrawerTitle containerStyle={styles.leftDrawerTitle}>
        {content.title.dataModel}
      </LeftDrawerTitle>
      <Collapse
        items={tableMetadata
          .filter((table) => table.schemaModifiable)
          .map(renderDataModelTableSchema)}
        bordered
        noContentPadding
        setContentFontColorToOrangeBecauseHistoryIsCruel
      />
      <ConfigButton
        style={styles.configButton}
        zedType="primary"
        size="large"
        onClick={() => setTableCreationFormVisible(true)}
      >
        {content.button.addModel}
      </ConfigButton>
      <LeftDrawerTitle containerStyle={styles.leftDrawerTitle}>
        {content.title.thirdPartyAPI}
      </LeftDrawerTitle>
      <Upload
        multiple={false}
        accept=".json"
        showUploadList={false}
        customRequest={(options) => {
          const reader = new FileReader();
          reader.readAsText(options.file as Blob);
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              handleActions.thirdPartyApi.upload(reader.result);
            } else {
              notification('UPLOAD_FILE_UNSUPPORTED');
            }
          };
        }}
      >
        <ConfigButton
          zedType="primary"
          size="large"
          icon={<UploadOutlined />}
          loading={uploading}
          disabled={uploading}
        >
          {content.button.uploadThirdPartyAPI}
        </ConfigButton>
      </Upload>
      <Modal visible={!!tableMeta} onCancel={() => setTableMeta(null)}>
        {tableMeta && <DataViewer table={tableMeta} />}
      </Modal>
      {tableCreationFormVisible && (
        <TableCreateForm
          onCancel={() => setTableCreationFormVisible(false)}
          onSubmit={handleActions.schema.create}
        />
      )}
      {tableMetaEdit && (
        <TableEditForm
          onCancel={() => setTableMetaEdit(null)}
          table={tableMetaEdit}
          onSubmit={handleActions.schema.update}
        />
      )}
      {columnMeta && (
        <ColumnCreateForm
          onCancel={() => setColumnMeta(null)}
          onSubmit={handleActions.column.create}
        />
      )}
      {columnMetaEdit && (
        <ColumnEditForm
          table={columnMetaEdit.table}
          column={columnMetaEdit.metadata}
          onCancel={() => setColumnMetaEdit(null)}
          onSubmit={handleActions.column.update}
        />
      )}
      {relationMeta && (
        <RelationCreateForm
          schemaNames={tableMetadata.map((s) => s.name)}
          onCancel={() => setRelationMeta(null)}
          onSubmit={handleActions.relation.create}
        />
      )}
      {relationMetaEdit && (
        <RelationEditForm
          table={relationMetaEdit.table}
          relation={relationMetaEdit.relationSchema}
          onCancel={() => setRelationMetaEdit(null)}
          onSubmit={handleActions.relation.update}
        />
      )}
      {constraintMetaEdit && (
        <TableConstraintEdit
          table={constraintMetaEdit.table}
          constraint={constraintMetaEdit.metadata}
          onCancel={() => setConstraintMetaEdit(null)}
          onSubmit={handleActions.constraint.update}
        />
      )}
      {functorCreationFormVisible && (
        <FunctorCreateForm onFinish={() => setFunctorCreationFormVisible(false)} />
      )}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  configButton: {
    marginTop: 16,
  },
  uploadContainer: {
    width: 0,
    height: 0,
    visibility: 'hidden',
  },
  hidden: {
    visibility: 'hidden',
  },
  schemaPanel: {
    width: '200px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  dataModelIcon: {
    width: '13px',
  },
  relationIcon: {
    width: '20px',
  },
  nameStyle: {
    overflowWrap: 'break-word',
  },
  leftDrawerTitle: {
    margin: '12px 0 12px 0',
  },
  flip: {
    transform: 'scale(-1, 1)',
  },
};
