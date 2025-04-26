/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { BITMAP } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  TransformImageToBitmapHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './TransformImageActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: TransformImageToBitmapHandleBinding;
  onEventChange: () => void;
}

export default observer(function TransformImageActionRow(props: Props): ReactElement {
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
        pageDataFilter={(type) => type === BITMAP}
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
            type: EventType.TRANSFORM_IMAGE_TO_BITMAP,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
