/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import {
  UserLoginActionHandleBinding,
  UserLoginActionType,
  UserLoginCredential,
  USER_CREDENTIAL_TYPES,
  USER_ACCOUNT_IDENTIFIER_TYPES,
  EventType,
} from '../../../../shared/type-definition/EventBinding';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './UserLoginActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors } from '../../../../utils/ZConst';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import { Radio, Row, Switch } from '../../../../zui';

export interface Props {
  componentModel: BaseComponentModel;
  event: UserLoginActionHandleBinding;
  onEventChange: () => void;
}

export default observer(function UserLoginActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  if (event.value === UserLoginActionType.LOGIN) {
    const DEFAULT_ARGS: UserLoginCredential = {
      accountIdentifierType: 'email',
      accountIdentifier: DataBinding.withTextVariable(),
      credentialType: 'password',
      credential: DataBinding.withTextVariable(),
    };

    if (!event.loginCredential) {
      event.loginCredential = DEFAULT_ARGS;
      onEventChange();
    }
  }

  return (
    <>
      {event.value === UserLoginActionType.LOGIN ? (
        <>
          <ZConfigRowTitle text={content.label.idType} />
          <Radio.Group
            key={event.loginCredential?.accountIdentifierType}
            value={event.loginCredential?.accountIdentifierType}
            onChange={(e) => {
              if (event.loginCredential)
                event.loginCredential.accountIdentifierType = e.target.value;
              onEventChange();
            }}
          >
            {USER_ACCOUNT_IDENTIFIER_TYPES.map((value) => (
              <Radio value={value} key={value} style={{ color: '#FFFFFF' }}>
                {content.id[value]}
              </Radio>
            ))}
          </Radio.Group>
          {event.loginCredential?.accountIdentifier ? (
            <DataBindingConfigRow
              title={content.id[event.loginCredential?.accountIdentifierType]}
              componentModel={componentModel}
              dataBinding={event.loginCredential.accountIdentifier}
              onChange={(newDataBinding) => {
                if (event.loginCredential) event.loginCredential.accountIdentifier = newDataBinding;
                onEventChange();
              }}
            />
          ) : null}
          <ZConfigRowTitle text={content.label.credentialType} />
          <Radio.Group
            key={event.loginCredential?.credentialType}
            value={event.loginCredential?.credentialType}
            onChange={(e) => {
              if (event.loginCredential) event.loginCredential.credentialType = e.target.value;
              onEventChange();
            }}
          >
            {USER_CREDENTIAL_TYPES.map((value) => (
              <Radio value={value} key={value} style={styles.radioTitle}>
                {content.credential[value]}
              </Radio>
            ))}
          </Radio.Group>
          {event.loginCredential?.accountIdentifier ? (
            <DataBindingConfigRow
              title={content.credential[event.loginCredential?.credentialType]}
              componentModel={componentModel}
              dataBinding={event.loginCredential?.credential}
              onChange={(newDataBinding) => {
                if (event.loginCredential) event.loginCredential.credential = newDataBinding;
                onEventChange();
              }}
            />
          ) : null}
        </>
      ) : null}

      {(event.value === UserLoginActionType.WECHAT_LOGIN ||
        event.value === UserLoginActionType.LOGIN ||
        event.value === UserLoginActionType.WECHAT_PHONE_NUMBER_LOGIN) && (
        <RequestResultActionRow
          componentModel={componentModel}
          event={event}
          onEventChange={onEventChange}
          enabledActions={getWithDefaultActions([
            {
              type: EventType.USER_LOGIN,
              enabled: false,
            },
          ])}
        />
      )}

      {event.value === UserLoginActionType.LOGIN ||
      event.value === UserLoginActionType.WECHAT_PHONE_NUMBER_LOGIN ? (
        <Row justify="space-between" align="middle" style={styles.fixedRow}>
          <ZConfigRowTitle text={content.label.createAccountOnLogin} />
          <Switch
            key={`${event.createAccountOnLogin}`}
            defaultChecked={event.createAccountOnLogin}
            onChange={(checked) => {
              event.createAccountOnLogin = checked;
              onEventChange();
            }}
          />
        </Row>
      ) : null}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  fixedRow: {
    marginTop: '10px',
  },
  radioTitle: {
    color: ZColors.WHITE,
  },
};
