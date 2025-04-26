/* eslint-disable import/no-default-export */
import { PlusSquareOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import {
  EventType,
  UserRegisterActionHandleBinding,
  USER_REGISTER_FIELD,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './UserRegisterActionRow.i18n.json';
import { Button, Dropdown, ZMenu } from '../../../../zui';

export interface Props {
  componentModel: BaseComponentModel;
  event: UserRegisterActionHandleBinding;
  onEventChange: () => void;
}

export default observer(function UserRegisterActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  const renderMenu = () => (
    <ZMenu
      items={USER_REGISTER_FIELD.filter((field) => !event.registrationForm[field]).map((value) => ({
        key: value,
        onClick: () => {
          event.registrationForm[value] = DataBinding.withTextVariable();
          onEventChange();
        },
        title: content.field[value],
      }))}
    />
  );

  return (
    <>
      <Dropdown overlay={renderMenu()}>
        <Button
          icon={<PlusSquareOutlined />}
          style={styles.button}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {content.label.add}
        </Button>
      </Dropdown>
      {USER_REGISTER_FIELD.filter((key) => event.registrationForm[key]).map((key) => {
        return (
          <DataBindingConfigRow
            title={content.field[key]}
            key={key}
            componentModel={componentModel}
            dataBinding={event.registrationForm[key] ?? DataBinding.withTextVariable()}
            onChange={(newDataBinding) => {
              event.registrationForm[key] = newDataBinding;
              onEventChange();
            }}
            onDelete={() => {
              delete event.registrationForm[key];
              onEventChange();
            }}
          />
        );
      })}
      <RequestResultActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onEventChange}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.USER_REGISTER,
            enabled: false,
          },
        ])}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  button: {
    background: ZThemedColors.PRIMARY,
    color: ZThemedColors.ACCENT,
    borderRadius: '6px',
    border: '0px',
  },
};
