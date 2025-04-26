import { observer } from 'mobx-react';
import React from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZDroppableArea from '../dnd/ZDroppableArea';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import useModel from '../../hooks/useModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from '../mobile-components/PropTypes';
import CSSModule from './ZWechatOfficialAccountFocusView.module.scss';

export const ZWechatOfficialAccountFocusView = observer((props: MRefProp): NullableReactElement => {
  const { localizedContent: content } = useLocale(i18n);

  const model = useModel(props.mRef);
  if (!model) {
    throw new Error(`ZView data error， ${JSON.stringify(model)}`);
  }

  return (
    <div className={CSSModule.container}>
      <div className={CSSModule.focusRow}>
        <ZConfigRowTitle text={content.bottomView} />
        <div
          style={{
            width: model.getComponentFrame().size.width,
            height: model.getComponentFrame().size.height,
          }}
        >
          <ZChessBoardForTransparentBackground>
            <ZDroppableArea mRef={model.mRef} />
          </ZChessBoardForTransparentBackground>
        </div>
      </div>
      <div className={`${ZMoveableClassName.PREVIEW} ${CSSModule.preview}`}>
        <ZConfigRowTitle text={content.preview} />
        <ZComponentSelectionWrapper component={model}>
          {model.renderForPreview()}
        </ZComponentSelectionWrapper>
      </div>
      <div className={CSSModule.hint}>
        <ZConfigRowTitle text={content.hint} />
        <div>{content.buttonViewHint}</div>
        <div>{content.advice}: (width: &gt;300px, height: 84px)</div>
      </div>
    </div>
  );
});
