import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useStores from '../../hooks/useStores';
import {
  DataModel,
  RelationMetadata,
  RelationType,
  TableMetadata,
} from '../../shared/type-definition/DataModel';
import { List, Modal, Tooltip } from '../../zui';
import cssModule from './DataModelRelationsTab.module.scss';
import ManyToManyIcon from '../../shared/assets/icons/relation-type/many_to_many.svg';
import OneToManyIcon from '../../shared/assets/icons/relation-type/one-to-many.svg';
import ManyToOneIcon from '../../shared/assets/icons/relation-type/many-to-one.svg';
import OneToOneIcon from '../../shared/assets/icons/relation-type/one-to-one.svg';
import ZHoverableIcon from '../editor/ZHoverableIcon';
import DeleteColumnNormalIcon from '../../shared/assets/icons/delete-column-normal.svg';
import DeleteColumnHoverIcon from '../../shared/assets/icons/delete-column-hover.svg';
import { useMutations } from '../../hooks/useMutations';
import useLocale from '../../hooks/useLocale';
import i18n from './DataModelRelationsTab.i18n.json';

interface RelationObject {
  relationName: string;
  relationType: RelationType;
  isSource: boolean;
  targetTable: string;
}

export interface Props {
  tableMetadata: TableMetadata;
  deletable?: boolean;
  immutableDataModel?: DataModel;
}

export const DataModelRelationsTab = observer((props: Props): ReactElement => {
  const { coreStore } = useStores();
  const { relationMetadata } = coreStore.dataModel;
  const { tableMetadata, deletable, immutableDataModel } = props;
  const { dataModelMutations } = useMutations();
  const { localizedContent } = useLocale(i18n);
  const immutableRelationData = immutableDataModel?.relationMetadata;

  const currentRelationMeta: RelationMetadata[] = relationMetadata.filter(
    (relation) =>
      relation.sourceTable === tableMetadata.name || relation.targetTable === tableMetadata.name
  );

  const getSourceByRelationShipType = (relationObject: RelationObject) => {
    switch (relationObject.relationType) {
      case RelationType.ONE_TO_ONE:
        return OneToOneIcon;
      case RelationType.ONE_TO_MANY:
        return relationObject.isSource ? OneToManyIcon : ManyToOneIcon;
      case RelationType.MANY_TO_MANY:
        return ManyToManyIcon;
      default:
        throw new Error(`unsupported relation type, ${relationObject.relationType}`);
    }
  };

  const deleteRelation = (metadata: RelationMetadata): void => {
    Modal.confirm({
      okType: 'danger',
      title: `${localizedContent.confirm} ${
        tableMetadata.name === metadata.sourceTable ? metadata.nameInSource : metadata.nameInTarget
      } ${localizedContent.relation}?`,
      onOk: () => {
        dataModelMutations.removeDataModelRelation(metadata);
      },
    });
  };

  const checkRelationDeletable = (relationMetaData: RelationMetadata): boolean => {
    return immutableRelationData
      ? !immutableRelationData.find((item) => item.id === relationMetaData.id)
      : true;
  };

  const renderRelationMeta = (relation: RelationMetadata) => {
    const relations = prepareRelations(relation, tableMetadata.name);
    return (
      <div key={`${relation.nameInSource}${relation.nameInTarget}`}>
        {relations.map((relationObject) => (
          <List.Item className={cssModule.relationMetadata} key={relationObject.relationName}>
            <div className={cssModule.relationContanier}>
              <div className={cssModule.relationInfo}>
                <Tooltip title={relationObject.relationType}>
                  <img
                    alt=""
                    className={cssModule.relationIcon}
                    src={getSourceByRelationShipType(relationObject)}
                  />
                </Tooltip>
                <div className={cssModule.relationContent}>
                  <div className={cssModule.relationTitle}>{relationObject.relationName}</div>
                  <div className={cssModule.relationTable}>{`(${relationObject.targetTable})`}</div>
                </div>
              </div>
              {deletable && checkRelationDeletable(relation) && (
                <div className={cssModule.deleteIcon}>
                  <ZHoverableIcon
                    isSelected={false}
                    src={DeleteColumnNormalIcon}
                    hoveredSrc={DeleteColumnHoverIcon}
                    toolTip={localizedContent.delete}
                    onClick={() => deleteRelation(relation)}
                  />
                </div>
              )}
            </div>
          </List.Item>
        ))}
      </div>
    );
  };

  return currentRelationMeta.length > 0 ? (
    <div className={cssModule.container}>
      <List size="small" split={false}>
        {currentRelationMeta.map(renderRelationMeta)}
      </List>
    </div>
  ) : (
    <div />
  );
});

export const prepareRelations = (
  relationMetadata: RelationMetadata,
  tableName: string
): RelationObject[] => {
  const relations: RelationObject[] = [];
  if (relationMetadata.sourceTable === tableName) {
    relations.push({
      relationName: relationMetadata.nameInSource,
      relationType: relationMetadata.type,
      isSource: true,
      targetTable: relationMetadata.targetTable,
    });
  }
  if (relationMetadata.targetTable === tableName) {
    relations.push({
      relationName: relationMetadata.nameInTarget,
      relationType: relationMetadata.type,
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
