/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { AuthorizationFailureHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ClickActionConfigRow, { ActionSwitchConfig } from '../config-row/ClickActionConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './AuthorizationFailureActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: AuthorizationFailureHandleBinding;
  onEventChange: () => void;
  enabledActions?: ActionSwitchConfig[];
}

export default observer(function AuthorizationFailureResultActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, enabledActions, onEventChange } = props;

  return (
    <>
      <ZConfigRowTitle text={content.label.failure} />
      <ClickActionConfigRow
        componentModel={props.componentModel}
        enabledActions={enabledActions}
        eventList={event.authorizationFailedActions}
        eventListOnChange={(eventList) => {
          event.authorizationFailedActions = eventList;
          onEventChange();
        }}
      />
    </>
  );
});
