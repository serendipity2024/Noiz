/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ShowToastHandleBinding } from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './ShowToastActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: ShowToastHandleBinding;
  onEventChange: () => void;
}

export default observer(function ShowToastActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, componentModel } = props;
  return (
    <DataBindingConfigRow
      title={content.label.title}
      componentModel={componentModel}
      dataBinding={event.title}
      onChange={(value) => {
        event.title = value;
        props.onEventChange();
      }}
    />
  );
});
