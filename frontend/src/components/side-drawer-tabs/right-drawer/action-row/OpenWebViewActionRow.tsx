/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventBinding,
  OpenWebViewHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './OpenWebViewActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function OpenWebViewActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const handleBinding = props.event as OpenWebViewHandleBinding;
  return (
    <>
      <h4 style={styles.webViewTitle}>{content.label.warning}</h4>
      <DataBindingConfigRow
        title={content.label.source}
        componentModel={props.componentModel}
        dataBinding={handleBinding.src}
        onChange={(value) => {
          handleBinding.src = value;
          props.onEventChange();
        }}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  webViewTitle: {
    color: 'red',
  },
};
