/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { BaseType } from '../../../../shared/type-definition/DataModel';
import {
  EventBinding,
  ObtainPhoneNumberHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors } from '../../../../utils/ZConst';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import i18n from './ObtainPhoneNumberActionRow.i18n.json';
import RequestResultActionRow from './RequestResultActionRow';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function ObtainPhoneNumberActioRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const handleBinding = props.event as ObtainPhoneNumberHandleBinding;
  return (
    <>
      <div style={styles.afterTitle}>{content.label.after}</div>
      <AssignPageDataConfigRow
        key={JSON.stringify(handleBinding.target)}
        title={content.label.assign}
        pageDataFilter={(type) => type === BaseType.TEXT}
        model={props.componentModel}
        pathComponents={handleBinding.target}
        onPathComponentsChange={(pathComponents) => {
          handleBinding.target = pathComponents;
          props.onEventChange();
        }}
      />
      <RequestResultActionRow
        componentModel={props.componentModel}
        event={handleBinding}
        onEventChange={props.onEventChange}
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
