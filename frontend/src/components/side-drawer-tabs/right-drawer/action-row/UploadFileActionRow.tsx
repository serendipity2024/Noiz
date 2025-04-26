/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventType,
  UploadFileHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import RequestResultActionRow from './RequestResultActionRow';
import i18n from './UploadFileActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors } from '../../../../utils/ZConst';
import { getWithDefaultActions } from '../config-row/ClickActionConfigRow';

interface Props {
  componentModel: BaseComponentModel;
  event: UploadFileHandleBinding;
  onEventChange: () => void;
}

export default observer(function UploadFileActionRow(props: Props): ReactElement {
  const { event } = props;
  const { localizedContent: content } = useLocale(i18n);

  return (
    <>
      <div style={styles.afterTitle}>{content.label.afterUpload}</div>
      <AssignPageDataConfigRow
        key={`${content.label.assignFileInfo}_${JSON.stringify(event.fileInfoComponents)}`}
        title={content.label.assignFileInfo}
        pageDataFilter={(type) => type === 'FILE'}
        model={props.componentModel}
        pathComponents={event.fileInfoComponents}
        onPathComponentsChange={(pathComponents) => {
          event.fileInfoComponents = pathComponents;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        event={event}
        onEventChange={props.onEventChange}
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.GET_LOCATION,
            enabled: false,
          },
        ])}
      />
    </>
  );
});
const styles: Record<string, React.CSSProperties> = {
  afterTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
};
