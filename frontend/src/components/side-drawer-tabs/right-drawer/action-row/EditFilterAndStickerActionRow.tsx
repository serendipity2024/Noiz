/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { MediaType } from '../../../../shared/type-definition/DataModel';
import {
  EditFilterAndStickerHandleBinding,
  EventType,
} from '../../../../shared/type-definition/EventBinding';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './EditFilterAndStickerActionRow.i18n.json';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: EditFilterAndStickerHandleBinding;
  onEventChange: () => void;
}

export default observer(function EditFilterAndStickerActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event } = props;

  return (
    <>
      <DataBindingConfigRow
        title={content.label.image}
        componentModel={componentModel}
        dataBinding={event.image}
        onChange={(value) => {
          event.image = value;
          props.onEventChange();
        }}
      />
      <AssignPageDataConfigRow
        title={content.label.assignTo}
        pageDataFilter={(type) => type === MediaType.IMAGE}
        model={componentModel}
        pathComponents={event.assignTo}
        onPathComponentsChange={(pathComponents) => {
          event.assignTo = pathComponents;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.EDIT_FILTER_AND_STICKER,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
