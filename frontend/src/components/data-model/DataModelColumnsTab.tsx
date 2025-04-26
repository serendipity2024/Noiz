import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import {
  BaseType,
  ColumnMetadata,
  ColumnType,
  DataModel,
  DecimalType,
  IntegerType,
  JsonType,
  MediaType,
  TableMetadata,
  TimeType,
} from '../../shared/type-definition/DataModel';
import { List, Modal, Tooltip } from '../../zui';
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
import DeleteColumnHoverIcon from '../../shared/assets/icons/delete-column-hover.svg';
import DeleteColumnNormalIcon from '../../shared/assets/icons/delete-column-normal.svg';
import cssModule from './DataModelColumnsTab.module.scss';
import ZHoverableIcon from '../editor/ZHoverableIcon';
import i18n from './DataModelColumnsTab.i18n.json';
import useLocale from '../../hooks/useLocale';
import { useMutations } from '../../hooks/useMutations';
import useStores from '../../hooks/useStores';

export interface Props {
  deletable: boolean;
  tableMetadata: TableMetadata;
  immutableDataModel?: DataModel;
}

export const DataModelColumnsTab = observer((props: Props): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { tableMetadata, deletable, immutableDataModel } = props;
  const { dataModelMutations } = useMutations();
  const { coreStore } = useStores();
  const { relationMetadata } = coreStore.dataModel;
  const immutableTableData = immutableDataModel?.tableMetadata.find(
    (item) => item.name === tableMetadata.name
  );

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

  const deleteColumn = (columnData: ColumnMetadata): void => {
    Modal.confirm({
      okType: 'danger',
      title: `${localizedContent.confirm} ${columnData.name} ${localizedContent.column}?`,
      onOk: () => {
        const relation = relationMetadata.find((e) => e.targetColumn === columnData.name);
        if (relation) dataModelMutations.removeDataModelRelation(relation);
        else dataModelMutations.removeDataModelColumn(tableMetadata.name, columnData.id);
      },
    });
  };

  const checkColumnDeletable = (columnMetaData: ColumnMetadata): boolean => {
    if (columnMetaData.primaryKey) return false;
    return immutableTableData
      ? !immutableTableData.columnMetadata.find((item) => item.name === columnMetaData.name)
      : true;
  };

  return (
    <div className={cssModule.container}>
      <List size="small" split={false}>
        {tableMetadata.columnMetadata
          .filter((meta: ColumnMetadata) => !meta.uiHidden)
          .map((metadata) => (
            <List.Item className={cssModule.columnMetadata} key={metadata.name}>
              <div className={cssModule.columnContent}>
                <Tooltip title={metadata.type}>
                  <img
                    alt=""
                    className={cssModule.columnIcon}
                    src={getSourceByColumnType(metadata.type)}
                  />
                </Tooltip>
                <div className={cssModule.columnTitle}>{metadata.name}</div>
              </div>
              {deletable && checkColumnDeletable(metadata) && (
                <div className={cssModule.deleteIcon}>
                  <ZHoverableIcon
                    isSelected={false}
                    src={DeleteColumnNormalIcon}
                    hoveredSrc={DeleteColumnHoverIcon}
                    toolTip={localizedContent.delete}
                    onClick={() => deleteColumn(metadata)}
                  />
                </div>
              )}
            </List.Item>
          ))}
      </List>
    </div>
  );
});
