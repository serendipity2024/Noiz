/* eslint-disable import/no-default-export */
import { PlusOutlined } from '@ant-design/icons';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { matches } from 'lodash';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import {
  DataModelRegistry,
  Field,
  GraphQLModel,
} from '../../../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../../../models/antd/CascaderSelectModel';
import {
  AGGREGATE,
  AggregateType,
  isBasicType,
  isMediaType,
  isNumericType,
} from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE } from '../../../../shared/type-definition/DataModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import CustomCascader from '../shared/CustomCascader';
import { Dropdown } from '../../../../zui';

const COUNT = 'count';

export const COUNT_OPTION = {
  value: COUNT,
  label: COUNT,
  type: AGGREGATE,
  isLeaf: true,
};

const AGGREGATE_OPTIONS = Object.values(AggregateType).map((type) => ({
  value: type,
  label: type,
  type: AGGREGATE,
  isLeaf: true,
}));

interface Props {
  cascaderOptions: CascaderSelectModel[];
  customComponent?: (menu: ReactElement) => ReactElement;
  arrayAggregate?: boolean;
  onCascaderChange: (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => void;
}

export default observer(function CustomCascaderConfigRow(props: Props): NullableReactElement {
  const { onCascaderChange, customComponent } = props;
  const { dataModelRegistry } = useDataModelMetadata();
  const arrayAggregate = props.arrayAggregate ?? true;

  return (
    <CustomCascader
      options={props.cascaderOptions}
      loadData={(targetOption) => {
        return (
          dataModelRegistry
            .getQueries()
            .find((obj: Field) =>
              (obj.itemType
                ? matches({ type: targetOption.type, itemType: targetOption.itemType })
                : matches({ type: targetOption.type }))(obj)
            )?.where ?? []
        ).map((field) => convertFieldToOption(field, dataModelRegistry, arrayAggregate));
      }}
      onChange={onCascaderChange}
      customDropdown={
        customComponent ||
        ((menu) => (
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={styles.buttonContainer}>
              <PlusOutlined />
            </div>
          </Dropdown>
        ))
      }
    />
  );
});

export function convertFieldToOption(
  field: Field,
  dataModelRegistry: DataModelRegistry,
  arrayAggregate = true
): CascaderSelectModel {
  if (field.type !== ARRAY_TYPE) {
    return {
      value: field.name,
      label: field.name,
      type: field.type,
      isLeaf: isMediaType(field.type) || isBasicType(field.type),
    };
  }
  if (!field.itemType) {
    throw new Error(`field itemType is null, ${JSON.stringify(field)}`);
  }
  let childrenOption: CascaderSelectModel[] = [];
  const gqlModel: GraphQLModel | undefined = dataModelRegistry.getGraphQLModel(field.itemType);
  if (gqlModel) {
    if (arrayAggregate) {
      childrenOption =
        gqlModel.fields
          .filter((element) => isNumericType(element.type) && element.name !== 'id')
          .map((element) => ({
            value: element.name,
            label: element.name,
            type: element.type,
            isLeaf: false,
            children: AGGREGATE_OPTIONS,
          })) ?? [];
      childrenOption.push(COUNT_OPTION);
    } else {
      childrenOption =
        gqlModel.fields.map((element) => ({
          value: element.name,
          label: element.name,
          type: element.type,
          itemType: element.itemType,
          isLeaf: isMediaType(element.type) || isBasicType(element.type),
        })) ?? [];
    }
  }
  return {
    value: field.name,
    label: field.name,
    type: field.type,
    isLeaf: false,
    children: childrenOption,
  };
}

const styles: Record<string, React.CSSProperties> = {
  sortContainer: {
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
  sortField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    fontSize: '10px',
    background: '#eee',
  },
  sortTitle: {
    textAlign: 'center',
    flex: '1',
    marginLeft: '10px',
    marginRight: '10px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
  },
  sortIcon: {
    fontSize: '12px',
    color: '#a8a8a8',
    marginRight: '10px',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
};
