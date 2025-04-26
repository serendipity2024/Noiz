/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { MediaType } from '../../../../shared/type-definition/DataModel';
import {
  EventType,
  TransformBitmapToImageHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './TransformBitmapActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: TransformBitmapToImageHandleBinding;
  onEventChange: () => void;
}

export default observer(function TransformBitmapActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event } = props;

  return (
    <>
      <DataBindingConfigRow
        title={content.label.bitmap}
        componentModel={componentModel}
        dataBinding={event.bitmap}
        onChange={(value) => {
          event.bitmap = value;
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
            type: EventType.TRANSFORM_BITMAP_TO_IMAGE,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
