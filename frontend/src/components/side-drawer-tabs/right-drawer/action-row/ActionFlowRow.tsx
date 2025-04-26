/* eslint-disable import/no-default-export */
import { Select } from 'antd';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { CSSProperties, ReactElement } from 'react';

import useStores from '../../../../hooks/useStores';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding, Variable } from '../../../../shared/type-definition/DataBinding';
import { ActionFlowHandleBinding } from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './ActionFlowRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { VariableContext } from '../../../../context/VariableContext';

interface Props {
  model: BaseComponentModel;
  event: ActionFlowHandleBinding;
  onEventChange: () => void;
}
const { Option } = Select;

export default observer(function ActionFlowRow(props: Props): React.ReactElement {
  const { model, event, onEventChange } = props;
  const { coreStore } = useStores();
  const { localizedContent: content } = useLocale(i18n);
  const actionFlow = coreStore.actionFlows.find((a) => a.uniqueId === event.actionFlowId);

  const renderInputArgs = (): ReactElement | null => {
    if (!actionFlow || isEmpty(actionFlow.inputArgs)) return null;
    return (
      <div>
        <ZConfigRowTitle text={content.label.inputArgsSetting} />
        {Object.entries(actionFlow.inputArgs).map(([argName, argValue]: [string, Variable]) => {
          const dataBinding =
            event.inputArgs && event.inputArgs[argName]
              ? event.inputArgs[argName]
              : DataBinding.withSingleValue(argValue.type);
          return (
            <div key={argName}>
              <DataBindingConfigRow
                title={argName}
                componentModel={model}
                dataBinding={dataBinding}
                onChange={(val) => {
                  event.inputArgs = {
                    ...event.inputArgs,
                    [argName]: val,
                  };
                  onEventChange();
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderOutputValues = (): ReactElement | null => {
    if (!actionFlow || isEmpty(actionFlow?.outputValues)) return null;

    return (
      <VariableContext.Provider
        value={{
          resultVariableRecord: {
            [event.actionId]: {
              nullable: false,
              type: '',
              args: actionFlow.outputValues,
            },
          },
        }}
      >
        <RequestResultActionRow
          componentModel={model}
          event={event}
          onEventChange={onEventChange}
        />
      </VariableContext.Provider>
    );
  };

  return (
    <>
      <div style={styles.row}>
        <span>{content.label.action}:</span>
        <Select
          style={styles.select}
          defaultValue={event.actionFlowId}
          onChange={(value) => {
            const block = coreStore.actionFlows.find((v) => v.uniqueId === value);
            if (block) {
              event.actionFlowId = block.uniqueId;
              onEventChange();
            }
          }}
        >
          {coreStore.actionFlows.map((item) => {
            return (
              <Option key={item.uniqueId} value={item.uniqueId}>
                {item.displayName}
              </Option>
            );
          })}
        </Select>
      </div>
      <div>{renderInputArgs()}</div>
      <div>{renderOutputValues()}</div>
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  row: { display: 'flex', justifyContent: 'space-between' },
  select: { flex: 1 },
};
