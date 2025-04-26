/* eslint-disable import/no-default-export */
import React, { ReactElement, CSSProperties, useContext } from 'react';
import { cloneDeep, isUndefined } from 'lodash';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  SELF_ROLE,
  USER_ROLE,
  LocationType,
  BaseType,
  PredefinedDistanceColumnNamePrefix,
} from '../../../../shared/type-definition/DataModel';
import { EventType, GraphQLRequestBinding } from '../../../../shared/type-definition/EventBinding';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ListSortConfigRow from './ListSortConfigRow';
import RequestDistinctOnConfigRow from './RequestDistinctOnConfigRow';
import RequestFilterConfigRow from './RequestFilterConfigRow';
import i18n from './GraphQLRequestConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import { ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from './DataBindingConfigRow';
import { DataBinding, Variable } from '../../../../shared/type-definition/DataBinding';
import RequestResultActionRow from '../action-row/RequestResultActionRow';
import ClickActionConfigRow, {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from './ClickActionConfigRow';
import { VariableContext } from '../../../../context/VariableContext';
import { Select } from '../../../../zui';

interface Props {
  request: GraphQLRequestBinding;
  componentModel: BaseComponentModel;
  subscriptionEnabled: boolean;
  onRequestChange: () => void;
  filterRemoteId?: string;
}

export default function GraphQLRequestConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { request, componentModel, subscriptionEnabled, onRequestChange, filterRemoteId } = props;
  const { tableMetadata } = useDataModelMetadata();
  const { requestStatusVariableRecord } = useContext(VariableContext);

  const rootFieldType = request.rootFieldType.replace('[]', '');
  const table = tableMetadata.find((t) => t.name === rootFieldType);
  const distanceFields = table?.columnMetadata
    .filter((column) => column.name.startsWith(PredefinedDistanceColumnNamePrefix))
    .map((column) => column.name);
  const { distanceArgs } = request;

  const currentRequestStatusVariableRecord: Record<string, Variable> =
    cloneDeep(requestStatusVariableRecord) ?? {};
  currentRequestStatusVariableRecord[request.requestId] = {
    type: BaseType.TEXT,
    nullable: false,
  };

  return (
    <>
      {subscriptionEnabled && (
        <>
          <ZConfigRowTitle text={content.label.requestType} />
          <Select
            size="large"
            bordered={false}
            key={request.type}
            value={request.type}
            style={styles.select}
            onChange={(value) => {
              request.type = value;
              onRequestChange();
            }}
          >
            <Select.Option value={EventType.QUERY}>{content.request.query}</Select.Option>
            <Select.Option value={EventType.SUBSCRIPTION}>
              {content.request.subscription}
            </Select.Option>
          </Select>
        </>
      )}
      <ZConfigRowTitle text={content.label.role} />
      <Select
        size="large"
        bordered={false}
        key={request.rootFieldType}
        value={request.role ?? USER_ROLE}
        style={styles.select}
        onChange={(value) => {
          request.role = value;
          onRequestChange();
        }}
      >
        <Select.Option value={USER_ROLE}>{content.role.user}</Select.Option>
        <Select.Option value={SELF_ROLE}>{content.role.self}</Select.Option>
      </Select>

      <ListSortConfigRow request={request} onRequestChange={onRequestChange} />
      <RequestDistinctOnConfigRow request={request} onRequestChange={onRequestChange} />
      <RequestFilterConfigRow
        filterRemoteId={filterRemoteId}
        componentModel={componentModel}
        request={request}
        onRequestChange={onRequestChange}
      />
      {request.type !== EventType.QUERY ||
      isUndefined(distanceFields) ||
      distanceFields.length === 0 ? (
        <></>
      ) : (
        <>
          <ZConfigRowTitle text={content.label.distanceFrom} />
          {distanceFields.map((name) => (
            <DataBindingConfigRow
              key={name}
              componentModel={componentModel}
              title={name}
              dataBinding={
                distanceArgs?.[name] ?? DataBinding.withSingleValue(LocationType.GEO_POINT)
              }
              onChange={(dataBinding) => {
                request.distanceArgs = { ...distanceArgs, [name]: dataBinding };
                onRequestChange();
              }}
            />
          ))}
        </>
      )}
      {request.type === EventType.QUERY && (
        <VariableContext.Provider
          value={{ requestStatusVariableRecord: currentRequestStatusVariableRecord }}
        >
          <ZConfigRowTitle text={content.label.onRequestStatusChange} />
          <ClickActionConfigRow
            componentModel={props.componentModel}
            enabledActions={getWithDefaultActions([
              ...getDefaultDisabledClickActionList(),
              { type: EventType.MUTATION, enabled: false },
              { type: EventType.BATCH_MUTATION, enabled: false },
              { type: EventType.THIRD_PARTY_API, enabled: false },
              { type: EventType.FUNCTOR_API, enabled: false },
            ])}
            eventList={request.onRequestStatusChangeActions}
            eventListOnChange={(eventList) => {
              request.onRequestStatusChangeActions = eventList;
              onRequestChange();
            }}
          />
        </VariableContext.Provider>
      )}

      <RequestResultActionRow
        componentModel={componentModel}
        event={request}
        onEventChange={onRequestChange}
        enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
        onSuccess
      />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
};
