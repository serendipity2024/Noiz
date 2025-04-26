/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import _ from 'lodash';
import useConfigTabHelpers from '../../../../hooks/useConfigTabHelpers';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useCustomRequestRegistry from '../../../../hooks/useCustomRequestRegistry';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import BaseContainerModel, { DataAccessMode } from '../../../../models/base/BaseContainerModel';
import {
  DataBinding,
  DataBindingKind,
  REMOTE_DATA_PATH,
  PathComponent,
  VariableBinding,
} from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, IntegerType, USER_ROLE } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  GraphQLRequestBinding,
  CustomRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from './DataBindingConfigRow';
import GraphQLRequestConfigRow from './GraphQLRequestConfigRow';
import CustomMutationActionRow from '../action-row/CustomMutationActionRow';
import i18n from './SelectListDataConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { useMutations } from '../../../../hooks/useMutations';
import { ZThemedColors } from '../../../../utils/ZConst';
import { InputNumber, Select } from '../../../../zui';

const QUERY = 'query';
const CUSTOM_QUERY = 'custom-query';

interface Props {
  title: string;
  subscriptionEnabled?: boolean;
  additionalUpdatesWithQueryChange?: () => void;
}

export default observer(function SelectListDataConfigRow(
  props: MRefProp & Props
): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { transaction, componentMutations } = useMutations();
  const { dataModelRegistry } = useDataModelMetadata();
  const { customQueries } = useCustomRequestRegistry();
  const { model } = useConfigTabHelpers<BaseContainerModel>(props.mRef);

  if (!model) return null;

  // query
  const currentQueries: GraphQLRequestBinding[] = model.queries?.slice() ?? [];
  const currentQuery: GraphQLRequestBinding = _.cloneDeep(currentQueries[0] ?? undefined);
  const options: Field[] = DataBindingHelper.fetchCollectionFields(dataModelRegistry) ?? [];

  // custom query
  const currentCustomQueries: CustomRequestBinding[] = model.thirdPartyQueries?.slice() ?? [];
  const currentCustomQuery: CustomRequestBinding = _.cloneDeep(
    currentCustomQueries[0] ?? undefined
  );
  const customOptions = customQueries.filter((e) => e.output?.type === ARRAY_TYPE) ?? [];

  // page data
  const { dataPathComponents, mRef: modelId } = model;

  const { additionalUpdatesWithQueryChange = _.noop } = props;

  const onSelectPathComponents = (dataBinding: DataBinding) => {
    const { pathComponents } = dataBinding.valueBinding as VariableBinding;
    transaction(() => {
      additionalUpdatesWithQueryChange();

      componentMutations.setProperty(modelId, 'dataPathComponents', pathComponents);
      componentMutations.setProperty(modelId, 'queries', []);
      componentMutations.setProperty(modelId, 'thirdPartyQueries', []);

      if (!pathComponents || pathComponents.length < 1) {
        componentMutations.setProperty(modelId, 'itemVariableTable', {});
      } else {
        const basePathComponents: PathComponent[] = pathComponents.slice(
          0,
          pathComponents.length - 1
        );
        const lastPath = pathComponents[pathComponents.length - 1];
        const dataName = `${lastPath.name}_${model.mRef}`;
        const itemVariableTable = getNewItemVariableTable(
          dataName,
          lastPath.type,
          lastPath.itemType,
          basePathComponents
        );
        componentMutations.setProperty(modelId, 'itemVariableTable', itemVariableTable);
      }
    });
  };

  const onSelectCustomRequestBinding = (customRequestBinding: CustomRequestBinding) => {
    const { output } = customRequestBinding;
    if (!output) return;
    const requestId = `${customRequestBinding.value}_${model.mRef}`;
    transaction(() => {
      additionalUpdatesWithQueryChange();
      componentMutations.setProperty(
        modelId,
        'itemVariableTable',
        getNewItemVariableTable(requestId, output.type, output.itemType, [REMOTE_DATA_PATH])
      );
      componentMutations.setProperty(modelId, 'dataPathComponents', undefined);
      componentMutations.setProperty(modelId, 'queries', []);
      componentMutations.setProperty(modelId, 'thirdPartyQueries', [
        {
          ...customRequestBinding,
          requestId,
        },
      ]);
    });
  };

  const onSelectQuery = (field: Field) => {
    const requestId = `${field.name}_${model.mRef}`;
    transaction(() => {
      additionalUpdatesWithQueryChange();
      componentMutations.setProperty(
        modelId,
        'itemVariableTable',
        getNewItemVariableTable(requestId, field.type, field.itemType, [REMOTE_DATA_PATH])
      );
      componentMutations.setProperty(modelId, 'dataPathComponents', undefined);
      componentMutations.setProperty(modelId, 'queries', [
        {
          type: EventType.QUERY,
          value: field.name,
          requestId,
          limit: 10,
          rootFieldType: `${field.itemType ?? field.type}[]`,
          role: USER_ROLE,
          where: { _and: [] },
          isWhereError: true,
        },
      ]);
      componentMutations.setProperty(modelId, 'thirdPartyQueries', []);
    });
  };

  const getNewItemVariableTable = (
    name: string,
    type: string,
    itemType?: string,
    basePathComponents?: PathComponent[]
  ) => {
    return {
      [name]: {
        type,
        itemType,
        nullable: false,
        args: {
          item: {
            type: itemType ?? '',
            nullable: false,
          },
          index: {
            type: IntegerType.INTEGER,
            nullable: false,
          },
        },
        pathComponents: basePathComponents,
      },
    };
  };

  const renderLocalDataSourceComponent = () => {
    const tempDataBinding = DataBinding.withSingleValue(ARRAY_TYPE);
    if (dataPathComponents) {
      tempDataBinding.valueBinding = {
        kind: DataBindingKind.VARIABLE,
        pathComponents: dataPathComponents,
      };
    }
    return (
      <DataBindingConfigRow
        title={content.label.data}
        componentModel={model}
        dataBinding={tempDataBinding}
        onChange={(dataBinding) => {
          onSelectPathComponents(dataBinding);
        }}
      />
    );
  };

  const renderRequestDataSourceComponent = () => {
    let currentSelectQueryName: string | undefined;
    if (currentQuery) {
      currentSelectQueryName =
        currentQuery?.rootFieldType?.length > 0 ? currentQuery?.value : undefined;
    } else if (currentCustomQuery) {
      currentSelectQueryName = currentCustomQuery?.value ?? undefined;
    }
    return (
      <>
        <ZConfigRowTitle text={content.label.whichList} />
        <Select
          bordered={false}
          dropdownMatchSelectWidth={false}
          placeholder={content.placeholder}
          size="large"
          style={styles.select}
          value={currentSelectQueryName}
          onChange={(value) => {
            const field = options.find((e) => e.name === value);
            const customQuery = customOptions.find((e) => e.value === value);
            if (field) {
              onSelectQuery(field);
            } else if (customQuery) {
              onSelectCustomRequestBinding(customQuery);
            }
          }}
        >
          <Select.OptGroup label={QUERY}>
            {options.map((item: Field) => (
              <Select.Option key={item.name} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select.OptGroup>
          {customOptions.length > 0 ? (
            <Select.OptGroup label={CUSTOM_QUERY}>
              {customOptions.map((item: CustomRequestBinding) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.value}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ) : null}
        </Select>
      </>
    );
  };

  return (
    <div>
      <ZConfigRowTitle text={content.label.dataSource} />
      <Select
        style={styles.fullWidth}
        value={model.listDataAccessMode}
        onChange={(value) => {
          transaction(() => {
            componentMutations.setProperty(modelId, 'listDataAccessMode', value);
            componentMutations.setProperty(modelId, 'dataPathComponents', undefined);
            componentMutations.setProperty(modelId, 'queries', []);
            componentMutations.setProperty(modelId, 'thirdPartyQueries', []);
            componentMutations.setProperty(modelId, 'itemVariableTable', {});
          });
        }}
      >
        {Object.values(DataAccessMode).map((e) => (
          <Select.Option key={e} value={e}>
            {content.source[e] ?? e}
          </Select.Option>
        ))}
      </Select>
      {model.listDataAccessMode === DataAccessMode.LOCAL ? renderLocalDataSourceComponent() : null}
      {model.listDataAccessMode === DataAccessMode.REMOTE
        ? renderRequestDataSourceComponent()
        : null}

      {currentCustomQuery ? (
        <CustomMutationActionRow
          componentModel={model}
          event={currentCustomQuery}
          onEventChange={() => {
            model.onUpdateModel('thirdPartyQueries', [currentCustomQuery]);
          }}
        />
      ) : null}

      {currentQuery ? (
        <>
          <ZConfigRowTitle text={props.title} />
          <InputNumber
            min={1}
            max={100}
            value={currentQuery?.limit ?? undefined}
            style={styles.input}
            onChange={(value) => {
              const limit = typeof value === 'number' ? value : undefined;
              currentQuery.limit = limit;
              model.onUpdateModel('queries', [currentQuery]);
            }}
          />
          <GraphQLRequestConfigRow
            request={currentQuery}
            componentModel={model}
            subscriptionEnabled={props.subscriptionEnabled ?? false}
            onRequestChange={() => {
              model.onUpdateModel('queries', [currentQuery]);
            }}
          />
        </>
      ) : null}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    background: ZThemedColors.PRIMARY,
  },
};
