/* eslint-disable import/no-default-export */
import { useQuery } from '@apollo/client';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { GQL_WECHAT_MESSAGE_TEMPLATE_LIST } from '../../../../graphQL/notification';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventType,
  NotificationAuthorizationHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import {
  WechatMessageTemplateList,
  WechatMessageTemplateListVariables,
} from '../../../../graphQL/__generated__/WechatMessageTemplateList';
import i18n from './NotificationActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import RequestResultActionRow from './RequestResultActionRow';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: NotificationAuthorizationHandleBinding;
  onEventChange: () => void;
}
export default observer(function NotificationAuthorizationActionRow(
  props: Props
): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { event, onEventChange, componentModel } = props;

  const { projectExId } = useProjectDetails();

  const { data: wechatTemplateList } = useQuery<
    WechatMessageTemplateList,
    WechatMessageTemplateListVariables
  >(GQL_WECHAT_MESSAGE_TEMPLATE_LIST, { variables: { projectExId }, skip: !projectExId });

  return (
    <>
      <ZConfigRowTitle text={content.label.templateId} />
      <Select
        key={JSON.stringify(event.templateIds)}
        value={event.templateIds}
        onChange={(value) => {
          event.templateIds = value;
          onEventChange();
        }}
        mode="multiple"
        dropdownMatchSelectWidth={false}
        style={styles.select}
      >
        {(wechatTemplateList?.wechatMessageTemplateList ?? [])
          .filter((option) => option && option.templateId)
          .map((object) => (
            <Select.Option value={object?.templateId ?? ''} key={object?.templateId ?? ''}>
              {object?.templateTitle}
            </Select.Option>
          ))}
      </Select>
      <RequestResultActionRow
        componentModel={componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.NOTIFICATION_AUTHORIZATION,
            enabled: false,
          },
        ])}
        event={event}
        onEventChange={onEventChange}
      />
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  select: {
    width: '100%',
  },
};
