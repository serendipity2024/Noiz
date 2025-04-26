/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { SetClipboardHandleBinding } from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './ClipboardActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: SetClipboardHandleBinding;
  onEventChange: () => void;
}

export default observer(function ClipboardActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event } = props;
  return (
    <DataBindingConfigRow
      title={content.label.text}
      componentModel={componentModel}
      dataBinding={event.text}
      onChange={(value) => {
        event.text = value;
        props.onEventChange();
      }}
    />
  );
});
