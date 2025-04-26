/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { SmsNotificationHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import i18n from './SmsNotificationActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Select } from '../../../../zui';
import { ZEDInputTextArea } from '../../../editor/ZEDInput';
import { AliyunSmsStatus } from '../../../../graphQL/__generated__/globalTypes';
import useStores from '../../../../hooks/useStores';

interface Props {
  componentModel: BaseComponentModel;
  event: SmsNotificationHandleBinding;
  onEventChange: () => void;
}
export default observer(function SmsNotificationActionRow(props: Props): NullableReactElement {
  const { componentModel, event, onEventChange } = props;
  const { localizedContent: content } = useLocale(i18n);
  const { smsTemplateStore } = useStores();
  const aliyunSmsTemplatesStatus = smsTemplateStore.smsTemplatesList;

  const renderSmsNotification = (): React.ReactNode => {
    return (
      aliyunSmsTemplatesStatus && (
        <>
          <ZConfigRowTitle text={content.label.templateId} />
          <Select
            style={styles.select}
            key={event.templateId}
            value={
              aliyunSmsTemplatesStatus.find((element) => element.templateCode === event.templateId)
                ?.templateName
            }
            onChange={(value) => {
              const smsTemplateObj = aliyunSmsTemplatesStatus.find(
                (element) => element.templateName === value
              );
              if (!smsTemplateObj) throw new Error('Can not find template object');
              event.templateId = smsTemplateObj.templateCode;
              event.args = Object.fromEntries(
                Object.keys(smsVariable(value)).map((key) => [key, DataBinding.withTextVariable()])
              );
              onEventChange();
            }}
            dropdownMatchSelectWidth={false}
          >
            {aliyunSmsTemplatesStatus.map((object) => (
              <Select.Option
                value={object.templateName}
                key={object.templateCode}
                disabled={object.templateStatus !== AliyunSmsStatus.APPROVED}
              >
                {object.templateName}
              </Select.Option>
            ))}
          </Select>
          <ZEDInputTextArea
            value={
              aliyunSmsTemplatesStatus.find((element) => element.templateCode === event.templateId)
                ?.templateContent
            }
            disabled
          />
          <ZConfigRowTitle text={content.label.parameter} />
          {Object.entries(event.args ?? {}).map(([key, value]) => (
            <div key={key}>
              <DataBindingConfigRow
                title={key}
                componentModel={componentModel}
                dataBinding={value}
                onChange={(dataBinding) => {
                  event.args = { ...event.args, [key]: dataBinding };
                  onEventChange();
                }}
              />
            </div>
          ))}
        </>
      )
    );
  };

  const smsVariable = (templateId: string) => {
    return Object.fromEntries(
      Array.from(
        (
          (aliyunSmsTemplatesStatus &&
            aliyunSmsTemplatesStatus.find((element) => element?.templateName === templateId)
              ?.templateContent) ??
          ''
        ).matchAll(/\${([a-zA-z][0-9a-zA-z_]*)}/g)
      ).map(([label, key]) => [key, label])
    );
  };
  return (
    <>
      <DataBindingConfigRow
        title={content.label.receiver}
        componentModel={componentModel}
        dataBinding={event.phoneNumber}
        onChange={(dataBinding) => {
          event.phoneNumber = dataBinding;
          onEventChange();
        }}
      />
      {renderSmsNotification()}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: '#eee',
    textAlign: 'center',
  },
};
