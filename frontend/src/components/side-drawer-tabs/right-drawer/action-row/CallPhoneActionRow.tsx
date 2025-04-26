/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { CallPhoneHandleBinding } from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './CallPhoneActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: CallPhoneHandleBinding;
  onEventChange: () => void;
}

export default observer(function CallPhoneActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event } = props;
  return (
    <DataBindingConfigRow
      title={content.label.phoneNumber}
      componentModel={componentModel}
      dataBinding={event.phoneNumber}
      onChange={(value) => {
        event.phoneNumber = value;
        props.onEventChange();
      }}
    />
  );
});
