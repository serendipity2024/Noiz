/* eslint-disable import/no-default-export */
import { useQuery } from '@apollo/client';
import { observer } from 'mobx-react';
import React from 'react';
import { matches } from 'lodash';
import { GQL_WECHAT_MESSAGE_TEMPLATE_LIST } from '../../../../graphQL/notification';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { WechatNotificationHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import {
  WechatMessageTemplateList,
  WechatMessageTemplateListVariables,
} from '../../../../graphQL/__generated__/WechatMessageTemplateList';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';

import i18n from './WechatNotificationActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: WechatNotificationHandleBinding;
  onEventChange: () => void;
}
export default observer(function WechatNotificationActionRow(props: Props): NullableReactElement {
  const { componentModel, event, onEventChange } = props;
  const { localizedContent: content } = useLocale(i18n);
  const { projectExId } = useProjectDetails();

  const { data: wechatTemplateList } = useQuery<
    WechatMessageTemplateList,
    WechatMessageTemplateListVariables
  >(GQL_WECHAT_MESSAGE_TEMPLATE_LIST, { variables: { projectExId }, skip: !projectExId });

  const renderWechatNotification = (): React.ReactNode => {
    return (
      <>
        <ZConfigRowTitle text={content.label.templateId} />
        <Select
          style={styles.select}
          key={event.templateId}
          value={event.templateId}
          onChange={(value) => {
            event.templateId = value;
            event.args = Object.fromEntries(
              Object.keys(wechatVariables(value)).map((key) => [
                key,
                DataBinding.withTextVariable(),
              ])
            );
            onEventChange();
          }}
          dropdownMatchSelectWidth={false}
        >
          {(wechatTemplateList?.wechatMessageTemplateList ?? [])
            .filter((option) => option && option.templateId)
            .map((object) => (
              <Select.Option value={object?.templateId ?? ''} key={object?.templateId ?? ''}>
                {object?.templateTitle}
              </Select.Option>
            ))}
        </Select>
        <ZConfigRowTitle text={content.label.parameter} />
        {Object.entries(event.args ?? {}).map(([key, value]) => (
          <div key={key}>
            <DataBindingConfigRow
              title={wechatVariables(event.templateId)[key]}
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
    );
  };

  /*
   * Used to split response from wechat
   * see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.getTemplateList.html
   */
  const wechatVariables = (templateId: string) =>
    Object.fromEntries(
      Array.from(
        (
          wechatTemplateList?.wechatMessageTemplateList?.find(matches({ templateId }))
            ?.templateContent ?? ''
        ).matchAll(/(.*):{{(.*)\.DATA}}\s*/g)
      ).map(([, label, key]) => [key, label])
    );

  return (
    <>
      <DataBindingConfigRow
        title={content.label.receiver}
        componentModel={componentModel}
        dataBinding={event.accountId}
        onChange={(dataBinding) => {
          event.accountId = dataBinding;
          onEventChange();
        }}
      />
      {renderWechatNotification()}
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
