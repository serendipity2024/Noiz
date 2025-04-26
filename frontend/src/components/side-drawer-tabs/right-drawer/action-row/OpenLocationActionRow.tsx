/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventBinding,
  OpenLocationHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './OpenLocationActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function OpenLocationActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const openLocationHandleBinding = props.event as OpenLocationHandleBinding;

  return (
    <>
      <DataBindingConfigRow
        title={content.label.location}
        componentModel={props.componentModel}
        dataBinding={openLocationHandleBinding.geoPoint}
        onChange={(value) => {
          openLocationHandleBinding.geoPoint = value;
          props.onEventChange();
        }}
      />
      <DataBindingConfigRow
        title={content.label.address}
        componentModel={props.componentModel}
        dataBinding={openLocationHandleBinding.address}
        onChange={(value) => {
          openLocationHandleBinding.address = value;
          props.onEventChange();
        }}
      />
      <DataBindingConfigRow
        title={content.label.name}
        componentModel={props.componentModel}
        dataBinding={openLocationHandleBinding.name}
        onChange={(value) => {
          openLocationHandleBinding.name = value;
          props.onEventChange();
        }}
      />
    </>
  );
});
