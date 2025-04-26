/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { ScanQRCodeHandleBinding } from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ArgumentsConfigRow, { AssignPageDataParameterEdit } from '../config-row/ArgumentsConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './ScanQRCodeActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';

interface Props {
  componentModel: BaseComponentModel;
  event: ScanQRCodeHandleBinding;
  onEventChange: () => void;
}

export default observer(function ScanQRCodeActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  return (
    <>
      <ZConfigRowTitle text={content.label.assignTo} />
      <ArgumentsConfigRow
        componentModel={componentModel}
        args={event.expectedFields}
        onChange={(value) => {
          event.expectedFields = value;
          onEventChange();
        }}
        producer={() => []}
        Edit={AssignPageDataParameterEdit}
      />
      <RequestResultActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onEventChange}
      />
    </>
  );
});
