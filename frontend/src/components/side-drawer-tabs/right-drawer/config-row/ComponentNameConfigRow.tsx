/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import React, { ReactElement, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DebugModeShowMRef from '../../../base/DebugModeShowmRef';
import i18n from './ComponentNameConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';

interface Props {
  model: BaseComponentModel;
  disable?: boolean;
}

export default observer(function ComponentNameConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  // TODO: need to implement a better input component to
  // 1. handle enter input to confirm value change
  // 2. press anyway outside of input box to confirm value change
  return (
    <>
      <div style={styles.rowContainer}>
        <ZConfigRowTitle text={content.label.name} />
        <DebugModeShowMRef mRef={props.model.mRef} />
      </div>
      <ConfigInput
        value={props.model.componentName}
        placeholder={props.model.type}
        onSaveValue={(value) => props.model.onUpdateModel('name', value)}
        disable={props.disable}
      />
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
};
