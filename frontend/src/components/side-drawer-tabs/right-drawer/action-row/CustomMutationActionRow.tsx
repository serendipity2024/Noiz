/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement, useContext } from 'react';
import { cloneDeep } from 'lodash';
import { VariableContext } from '../../../../context/VariableContext';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { Variable } from '../../../../shared/type-definition/DataBinding';
import { CustomRequestBinding } from '../../../../shared/type-definition/EventBinding';
import {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from '../config-row/ClickActionConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import CustomRequestFieldConfigRow from '../config-row/CustomRequestFieldConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: CustomRequestBinding;
  onEventChange: () => void;
}

export default observer(function CustomMutationActionRow(props: Props): ReactElement | null {
  const { resultVariableRecord } = useContext(VariableContext);

  const { componentModel, event, onEventChange } = props;

  const currentResultVariableRecord: Record<string, Variable> =
    cloneDeep(resultVariableRecord) ?? {};
  if (event.output) {
    currentResultVariableRecord[event.requestId] = {
      type: event.output.type,
      itemType: event.output.itemType,
      nullable: false,
    };
  }

  return (
    <>
      {event.input ? (
        <CustomRequestFieldConfigRow
          componentModel={componentModel}
          value={event.input}
          onChange={(apiField) => {
            event.input = apiField;
            onEventChange();
          }}
          ghost
        />
      ) : (
        <></>
      )}
      <VariableContext.Provider value={{ resultVariableRecord: currentResultVariableRecord }}>
        <RequestResultActionRow
          componentModel={props.componentModel}
          event={event}
          onEventChange={props.onEventChange}
          enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
        />
      </VariableContext.Provider>
    </>
  );
});
