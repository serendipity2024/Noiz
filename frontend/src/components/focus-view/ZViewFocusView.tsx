/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZDroppableArea from '../dnd/ZDroppableArea';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useColorBinding from '../../hooks/useColorBinding';
import {
  CombinedStyleAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import useModel from '../../hooks/useModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from '../mobile-components/PropTypes';

export default observer(function ZViewFocusView(props: MRefProp): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const cb = useColorBinding();

  const model = useModel(props.mRef);
  if (!model) {
    throw new Error(`ZView data error， ${JSON.stringify(model)}`);
  }

  return (
    <div style={styles.container}>
      <div style={styles.focusRow}>
        <ZConfigRowTitle text={content.focusRow} />
        <ZChessBoardForTransparentBackground>
          <div
            style={{
              ...prepareCombinedStyles(model.dataAttributes as CombinedStyleAttributes, cb),
              backgroundColor: cb(model.dataAttributes.backgroundColor),
              width: model.getComponentFrame().size.width,
              height: model.getComponentFrame().size.height,
            }}
          >
            <ZDroppableArea mRef={model.mRef} />
          </div>
        </ZChessBoardForTransparentBackground>
      </div>
      <div className={`${ZMoveableClassName.PREVIEW}`} style={styles.preview}>
        <ZConfigRowTitle text={content.preview} />
        <ZComponentSelectionWrapper component={model}>
          {model.renderForPreview()}
        </ZComponentSelectionWrapper>
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
  },
  preview: {
    marginTop: '100px',
  },
};
