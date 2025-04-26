/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { VariableContext } from '../../../../context/VariableContext';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  DataBinding,
  Variable,
  VariableBinding,
} from '../../../../shared/type-definition/DataBinding';
import { ARRAY_TYPE, IntegerType } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  ListActionHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ListActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: ListActionHandleBinding;
  onEventChange: () => void;
}

export default observer(function ListActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event } = props;

  const dataSourceImported =
    (event.dataSource?.valueBinding as VariableBinding)?.pathComponents?.length > 0;
  const actionDataVariableRecord: Record<string, Variable> = {};

  if (dataSourceImported) {
    const variableBinding = event.dataSource?.valueBinding as VariableBinding;
    const dataPathComponent =
      variableBinding.pathComponents[variableBinding.pathComponents.length - 1];
    if (dataPathComponent && dataPathComponent.itemType) {
      actionDataVariableRecord[event.id] = {
        type: dataPathComponent.type,
        itemType: dataPathComponent.itemType,
        nullable: false,
        args: {
          item: {
            type: dataPathComponent.itemType ?? '',
            nullable: false,
          },
          index: {
            type: IntegerType.INTEGER,
            nullable: false,
          },
        },
      };
    }
  }

  return (
    <>
      <DataBindingConfigRow
        title={content.label.dataSource}
        componentModel={props.componentModel}
        dataBinding={event.dataSource ?? DataBinding.withSingleValue(ARRAY_TYPE)}
        onChange={(value) => {
          event.dataSource = value;
          event.itemActions = [];
          props.onEventChange();
        }}
      />
      {dataSourceImported && (
        <VariableContext.Provider value={{ actionDataVariableRecord }}>
          <ZConfigRowTitle text={content.label.itemActions} />
          <ClickActionConfigRow
            componentModel={props.componentModel}
            enabledActions={getWithDefaultActions([
              {
                type: EventType.LIST_ACTION,
                enabled: false,
              },
            ])}
            eventList={event.itemActions ?? []}
            eventListOnChange={(value) => {
              event.itemActions = value;
              props.onEventChange();
            }}
          />
        </VariableContext.Provider>
      )}
    </>
  );
});
