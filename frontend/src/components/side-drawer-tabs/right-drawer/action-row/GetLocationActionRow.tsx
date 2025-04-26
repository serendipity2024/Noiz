/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { LocationType } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  GetLocationHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './ChooseLocationActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import AuthorizationFailureActionRow from './AuthorizationFailureActionRow';
import { ZColors } from '../../../../utils/ZConst';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: GetLocationHandleBinding;
  onEventChange: () => void;
}

export default observer(function GetLocationActionRow(props: Props): ReactElement {
  const { event } = props;
  const { localizedContent: content } = useLocale(i18n);

  return (
    <>
      <div style={styles.afterTitle}>{content.label.afterSelection}</div>
      <AssignPageDataConfigRow
        key={`${content.label.assignGeoPoint}_${JSON.stringify(
          event.geoPointAssociatedPathComponents
        )}`}
        title={content.label.assignGeoPoint}
        pageDataFilter={(type) => type === LocationType.GEO_POINT}
        model={props.componentModel}
        pathComponents={event.geoPointAssociatedPathComponents}
        onPathComponentsChange={(pathComponents) => {
          event.geoPointAssociatedPathComponents = pathComponents;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.GET_LOCATION,
            enabled: false,
          },
        ])}
      />

      <AuthorizationFailureActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.GET_LOCATION,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
const styles: Record<string, React.CSSProperties> = {
  afterTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
};
