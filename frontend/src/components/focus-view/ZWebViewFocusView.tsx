/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import useModel from '../../hooks/useModel';
import { MRefProp } from '../mobile-components/PropTypes';

export default observer(function ZWebViewFocusView(props: MRefProp) {
  const { localizedContent: content } = useLocale(i18n);

  const model = useModel(props.mRef);
  if (!model) {
    throw new Error(`ZWebView data error， ${JSON.stringify(model)}`);
  }

  return (
    <div style={styles.container}>
      <div style={styles.focusRow}>
        <ZConfigRowTitle text={content.focusRow} />
        {model.renderForPreview()}
      </div>
    </div>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    overflow: 'visible',
  },
  focusRow: {
    position: 'relative',
    textAlign: 'center',
  },
};
