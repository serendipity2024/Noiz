/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { RequestResultHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ClickActionConfigRow, { ActionSwitchConfig } from '../config-row/ClickActionConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './RequestResultActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: RequestResultHandleBinding;
  onEventChange: () => void;
  enabledActions?: ActionSwitchConfig[];
  onSuccess?: boolean;
  onFailure?: boolean;
}

export default observer(function RequestResultActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, enabledActions, onEventChange, onSuccess, onFailure } = props;

  return (
    <>
      {(onSuccess || event.successActions) && (
        <>
          <ZConfigRowTitle text={content.label.success} />
          <ClickActionConfigRow
            componentModel={props.componentModel}
            enabledActions={enabledActions}
            eventList={event.successActions}
            eventListOnChange={(eventList) => {
              event.successActions = eventList;
              onEventChange();
            }}
          />
        </>
      )}
      {(onFailure || event.failedActions) && (
        <>
          <ZConfigRowTitle text={content.label.failure} />
          <ClickActionConfigRow
            componentModel={props.componentModel}
            enabledActions={enabledActions}
            eventList={event.failedActions}
            eventListOnChange={(eventList) => {
              event.failedActions = eventList;
              onEventChange();
            }}
          />
        </>
      )}
    </>
  );
});
