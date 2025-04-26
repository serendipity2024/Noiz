import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { Col } from 'antd/es/grid';
import { EditFilled } from '@ant-design/icons';
import { Divider, Row } from '../../zui';
import {
  ColumnModel,
  genCurrentDisplayColumns,
} from '../../shared/type-definition/ManagementConsole';
import cssModule from './ZManagementConsoleColumnConfigRow.module.scss';
import i18n from './ZManagementConsoleColumnConfigRow.i18n.json';
import useLocale from '../../hooks/useLocale';
import fieldDisplaySrc from '../../shared/assets/mc/mc-field-display.png';
import fieldHiddenSrc from '../../shared/assets/mc/mc-field-hidden.png';
import ConfigInput from '../side-drawer-tabs/right-drawer/shared/ConfigInput';
import useStores from '../../hooks/useStores';
import { ARRAY_TYPE } from '../../shared/type-definition/DataModel';
import { prepareRelations, RelationIcon } from '../data-model/SideDataModelDesigner';
import DataBindingConfigRow from '../side-drawer-tabs/right-drawer/config-row/DataBindingConfigRow';
import TextModel from '../../models/mobile-components/TextModel';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { CascaderSelectModel } from '../../models/antd/CascaderSelectModel';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';

interface Props {
  tableName: string;
  columns: ColumnModel[];
  onColumnsChange: (columns: ColumnModel[]) => void;
}

export const ZManagementConsoleColumnConfigRow = observer((props: Props): ReactElement => {
  const { columns, onColumnsChange, tableName } = props;
  const { localizedContent } = useLocale(i18n);
  const { coreStore } = useStores();
  const { dataModelRegistry } = useDataModelMetadata();
  const graphQLModel = dataModelRegistry.getGraphQLModel(tableName);
  const currentColumns = genCurrentDisplayColumns(columns, graphQLModel);
  const relationDisplayable = !!currentColumns.find((column) => column.isRelation);

  function onColumnDataChange(fieldName: string, key: keyof ColumnModel, newValue: any) {
    const newColumns = currentColumns.map((columnModel) =>
      columnModel.fieldName === fieldName
        ? {
            ...columnModel,
            [key]: newValue,
          }
        : columnModel
    );
    onColumnsChange(newColumns);
  }

  function renderFieldsComponent(): ReactElement {
    return (
      <div>
        <div className={cssModule.fieldItemTitleContainer}>
          <Row justify="start" align="middle">
            <div className={cssModule.fieldTitle}>{localizedContent.field}</div>
            <div className={cssModule.fieldTitle}>{localizedContent.titleContent}</div>
          </Row>
        </div>
        <Divider className={cssModule.divider} />
        {currentColumns.map(
          (columnModel) =>
            !columnModel.isRelation && (
              <Row
                className={cssModule.fieldItem}
                key={columnModel.fieldName}
                justify="space-between"
                align="middle"
              >
                <div className={cssModule.fieldItemTitleContainer}>
                  <Row justify="start" align="middle">
                    <Col span={8}>
                      <div className={cssModule.fieldName}>{columnModel.fieldName}</div>
                    </Col>
                    <Col span={8}>
                      <ConfigInput
                        className={cssModule.fieldContent}
                        value={columnModel.displayName}
                        onSaveValue={(value) =>
                          onColumnDataChange(columnModel.fieldName, 'displayName', value)
                        }
                      />
                    </Col>
                  </Row>
                </div>
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    onColumnDataChange(columnModel.fieldName, 'isHidden', !columnModel.isHidden);
                  }}
                >
                  <img
                    alt=""
                    className={cssModule.icon}
                    src={columnModel.isHidden ? fieldHiddenSrc : fieldDisplaySrc}
                  />
                </div>
              </Row>
            )
        )}
      </div>
    );
  }

  function renderRelationMeta(columnModel: ColumnModel): ReactElement {
    const relationTableName =
      columnModel.type === ARRAY_TYPE ? columnModel.itemType : columnModel.type;
    const newRelationMetadata = coreStore.dataModel.relationMetadata.filter(
      (e) =>
        (e.nameInSource === columnModel.fieldName && e.sourceTable === tableName) ||
        (e.targetTable === tableName && e.nameInTarget === columnModel.fieldName)
    )[0];
    const relationColumns = prepareRelations(newRelationMetadata, tableName ?? '');
    const { relation: relationType, isSource } = relationColumns[0];
    return (
      <div>
        <span className={cssModule.tableName}>{relationTableName}</span>
        <RelationIcon relation={relationType} isSource={isSource} />
      </div>
    );
  }

  function renderRelationTablesComponent(): ReactElement {
    const tempComponentModel = new TextModel('');
    return (
      <div>
        <div className={cssModule.fieldItemTitleContainer}>
          <Row justify="start" align="middle">
            <div className={cssModule.fieldTitle}>{localizedContent.table}</div>
            <div className={cssModule.fieldTitle}>{localizedContent.titleContent}</div>
            <div className={cssModule.fieldTitle}>{localizedContent.displayContent}</div>
          </Row>
        </div>
        <Divider className={cssModule.divider} />
        {currentColumns.map((columnModel) => {
          if (!columnModel.isRelation) return null;
          const cascaderOptions: CascaderSelectModel[] = [];
          cascaderOptions.push({
            value: columnModel.fieldName,
            label: columnModel.fieldName,
            isLeaf: false,
            type: columnModel.itemType ?? columnModel.type,
          });
          return (
            <Row
              className={cssModule.fieldItem}
              key={columnModel.fieldName}
              justify="space-between"
              align="middle"
            >
              <div className={cssModule.fieldItemTitleContainer}>
                <Row justify="start" align="middle">
                  <Col span={8}>
                    <div className={cssModule.fieldName}>{renderRelationMeta(columnModel)}</div>
                  </Col>
                  <Col span={8}>
                    <ConfigInput
                      className={cssModule.fieldContent}
                      value={columnModel.displayName}
                      onSaveValue={(value) =>
                        onColumnDataChange(columnModel.fieldName, 'displayName', value)
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <DataBindingConfigRow
                      displayTitleComponent={false}
                      cascaderOptions={cascaderOptions}
                      componentModel={tempComponentModel}
                      dataBinding={columnModel.contentDataBinding ?? DataBinding.withTextVariable()}
                      onChange={(dataBinding) => {
                        onColumnDataChange(
                          columnModel.fieldName,
                          'contentDataBinding',
                          dataBinding
                        );
                      }}
                      editComponent={<EditFilled style={{ color: '#FFA522' }} />}
                    />
                  </Col>
                </Row>
              </div>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  onColumnDataChange(columnModel.fieldName, 'isHidden', !columnModel.isHidden);
                }}
              >
                <img
                  alt=""
                  className={cssModule.icon}
                  src={columnModel.isHidden ? fieldHiddenSrc : fieldDisplaySrc}
                />
              </div>
            </Row>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cssModule.container}>
      <div>
        <div className={cssModule.title}>{localizedContent.dataSource}</div>
        {renderFieldsComponent()}
      </div>
      {relationDisplayable && (
        <div className={cssModule.relationContainer}>
          <div className={cssModule.title}>{localizedContent.associatedData}</div>
          {renderRelationTablesComponent()}
        </div>
      )}
    </div>
  );
});
