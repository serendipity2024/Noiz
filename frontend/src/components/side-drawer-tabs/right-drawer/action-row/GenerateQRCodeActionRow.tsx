/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import GenerateImageActionRow from './GenerateImageActionRow';
import { GenerateQRCodeHandleBinding } from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';

interface Props {
  componentModel: BaseComponentModel;
  event: GenerateQRCodeHandleBinding;
  onEventChange: () => void;
}
export default observer(function GenerateQRCodeActionRow(props: Props) {
  const { componentModel, event, onEventChange } = props;
  return (
    <GenerateImageActionRow
      componentModel={componentModel}
      event={event}
      onEventChange={onEventChange}
    />
  );
});
