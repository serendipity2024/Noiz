/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventBinding,
  EventType,
  MutationZipHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import RequestResultActionRow from './RequestResultActionRow';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function BatchEventActionRow(props: Props): ReactElement {
  const zipEvent: MutationZipHandleBinding = props.event as MutationZipHandleBinding;

  return (
    <div>
      <ClickActionConfigRow
        componentModel={props.componentModel}
        enabledActions={[
          {
            type: EventType.MUTATION,
            enabled: true,
          },
        ]}
        eventList={zipEvent.eventList}
        eventListOnChange={(eventList) => {
          zipEvent.eventList = eventList;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        componentModel={props.componentModel}
        event={zipEvent}
        onEventChange={props.onEventChange}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.BATCH_MUTATION,
            enabled: false,
          },
          {
            type: EventType.MUTATION,
            enabled: false,
          },
        ])}
      />
    </div>
  );
});
