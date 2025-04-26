/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import {
  EventType,
  GetAdministrationAreaHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { LOCATION_INFO } from '../../../../shared/type-definition/DataModel';
import i18n from './GetAdministrationiAreaActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import RequestResultActionRow from './RequestResultActionRow';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: GetAdministrationAreaHandleBinding;
  onEventChange: () => void;
}

export default observer(function GetAdministrationAreaActionRow(props: Props) {
  const { componentModel, onEventChange, event } = props;
  const { localizedContent: content } = useLocale(i18n);
  return (
    <>
      <DataBindingConfigRow
        title={content.label.location}
        componentModel={componentModel}
        dataBinding={event.location}
        onChange={(dataBinding) => {
          event.location = dataBinding;
          onEventChange();
        }}
      />
      <ZConfigRowTitle text={content.label.fields} />
      <AssignPageDataConfigRow
        title={content.label.assignTo}
        pageDataFilter={(type) => type === LOCATION_INFO}
        model={componentModel}
        pathComponents={event.assignTo}
        onPathComponentsChange={(pathComponents) => {
          event.assignTo = pathComponents;
          onEventChange();
        }}
      />
      <RequestResultActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.GET_ADMINISTRATION_AREA,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
