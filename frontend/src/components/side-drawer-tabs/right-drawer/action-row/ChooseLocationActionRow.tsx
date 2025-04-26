/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { BaseType, LocationType } from '../../../../shared/type-definition/DataModel';
import {
  ChooseLocationHandleBinding,
  EventBinding,
  EventType,
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
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function ChooseLocationActionRow(props: Props): ReactElement {
  const chooseLocationHandleBinding = props.event as ChooseLocationHandleBinding;
  const { localizedContent: content } = useLocale(i18n);

  return (
    <>
      <div style={styles.afterTitle}>{content.label.afterSelection}</div>
      <AssignPageDataConfigRow
        key={`${content.label.assignGeoPoint}_${JSON.stringify(
          chooseLocationHandleBinding.geoPointAssociatedPathComponents
        )}`}
        title={content.label.assignGeoPoint}
        pageDataFilter={(type) => type === LocationType.GEO_POINT}
        model={props.componentModel}
        pathComponents={chooseLocationHandleBinding.geoPointAssociatedPathComponents}
        onPathComponentsChange={(pathComponents) => {
          chooseLocationHandleBinding.geoPointAssociatedPathComponents = pathComponents;
          props.onEventChange();
        }}
      />
      <AssignPageDataConfigRow
        key={`${content.label.assignAddress}_${JSON.stringify(
          chooseLocationHandleBinding.addressAssociatedPathComponents
        )}`}
        title={content.label.assignAddress}
        pageDataFilter={(type) => type === BaseType.TEXT}
        model={props.componentModel}
        pathComponents={chooseLocationHandleBinding.addressAssociatedPathComponents}
        onPathComponentsChange={(pathComponents) => {
          chooseLocationHandleBinding.addressAssociatedPathComponents = pathComponents;
          props.onEventChange();
        }}
      />
      <AssignPageDataConfigRow
        key={`${content.label.assignName}_${JSON.stringify(
          chooseLocationHandleBinding.nameAssociatedPathComponents
        )}`}
        title={content.label.assignName}
        pageDataFilter={(type) => type === BaseType.TEXT}
        model={props.componentModel}
        pathComponents={chooseLocationHandleBinding.nameAssociatedPathComponents}
        onPathComponentsChange={(pathComponents) => {
          chooseLocationHandleBinding.nameAssociatedPathComponents = pathComponents;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        event={chooseLocationHandleBinding}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.CHOOSE_LOCATION,
            enabled: false,
          },
        ])}
      />
      <AuthorizationFailureActionRow
        event={chooseLocationHandleBinding}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.CHOOSE_LOCATION,
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
