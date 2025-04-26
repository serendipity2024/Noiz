/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import useStores from '../../hooks/useStores';
import HorizontalListModel from '../../models/mobile-components/HorizontalListModel';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import ZBlankContainer from '../mobile-components/ZBlankContainer';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import useModel from '../../hooks/useModel';
import { MRefProp } from '../mobile-components/PropTypes';
import { Row } from '../../zui';

export default observer(function ZHorizontalListFocusView(props: MRefProp): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();

  const model = useModel(props.mRef) as HorizontalListModel;
  if (!model) {
    throw new Error(`ZHorizontalList cell error， ${JSON.stringify(model)}`);
  }
  if (model.childMRefs.length !== 1) {
    throw new Error(`ZCustomList cell error， ${JSON.stringify(model)}`);
  }
  const cellModel = useModel(model.childMRefs[0]) as BaseContainerModel;
  if (!cellModel) {
    throw new Error(`ZHorizontalList cell error， ${JSON.stringify(model)}`);
  }

  return (
    <div style={styles.container}>
      <ZConfigRowTitle
        text={content.focusRow}
        onClick={(e) => {
          uft(UserFlow.SELECT_TARGET)(cellModel.mRef);
          editorStore.clipBoardContainerMRef = cellModel.mRef;
          e.stopPropagation();
        }}
      />
      <Row align="middle" justify="center">
        <ZComponentSelectionWrapper component={cellModel} clickable={false}>
          <ZChessBoardForTransparentBackground>
            <ZBlankContainer droppable mRef={cellModel.mRef} />
          </ZChessBoardForTransparentBackground>
        </ZComponentSelectionWrapper>
      </Row>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'visible',
    textAlign: 'center',
  },
  preview: {
    marginTop: '100px',
  },
};
