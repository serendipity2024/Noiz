/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { SendVerificationCodeHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './SendVerificationCodeActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import RequestResultActionRow from './RequestResultActionRow';
import { Radio } from '../../../../zui';

export interface Props {
  componentModel: BaseComponentModel;
  event: SendVerificationCodeHandleBinding;
  onEventChange: () => void;
}
export default observer(function SendVerificationCodeActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { event, componentModel, onEventChange } = props;

  return (
    <>
      <ZConfigRowTitle text={content.label.sendBy} />
      <Radio.Group
        value={event.contactType}
        onChange={(e) => {
          event.contactType = e.target.value;
          onEventChange();
        }}
      >
        <Radio disabled value="email" style={{ color: '#FFFFFF' }}>
          {content.method.email}
        </Radio>
        <Radio value="phone" style={{ color: '#FFFFFF' }}>
          {content.method.phone}
        </Radio>
      </Radio.Group>
      <DataBindingConfigRow
        title={content.label.sendTo}
        componentModel={componentModel}
        dataBinding={event.target}
        onChange={(dataBinding) => {
          event.target = dataBinding;
          onEventChange();
        }}
      />
      <RequestResultActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onEventChange}
      />
    </>
  );
});
