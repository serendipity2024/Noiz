/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { TakePhotoHandleBinding } from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { MediaType } from '../../../../shared/type-definition/DataModel';
import i18n from './GenerateImageActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import RequestResultActionRow from './RequestResultActionRow';

interface Props {
  componentModel: BaseComponentModel;
  event: TakePhotoHandleBinding;
  onEventChange: () => void;
}

export default observer(function TakePhotoActionRow(props: Props) {
  const { componentModel, onEventChange, event } = props;
  const { localizedContent: content } = useLocale(i18n);
  return (
    <>
      <AssignPageDataConfigRow
        title={content.label.assignTo}
        pageDataFilter={(type) => type === MediaType.IMAGE}
        model={componentModel}
        pathComponents={event.assignTo}
        onPathComponentsChange={(pathComponents) => {
          event.assignTo = pathComponents;
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
