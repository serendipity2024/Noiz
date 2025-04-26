/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useModel from '../../hooks/useModel';
import useStores from '../../hooks/useStores';
import useViewport from '../../hooks/useViewport';
import SelectViewModel from '../../models/mobile-components/SelectViewModel';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import ZBlankContainer from '../mobile-components/ZBlankContainer';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from '../mobile-components/PropTypes';
import { Row } from '../../zui';

const RESIZABLE_ROW_MARGIN = 20;

export default observer(function ZSelectViewFocusView(props: MRefProp): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const viewport = useViewport();
  const { editorStore } = useStores();

  const model = useModel(props.mRef) as SelectViewModel;
  const normalModel = useModel(model.dataAttributes.normalMRef);
  const selectedModel = useModel(model.dataAttributes.selectedMRef);

  if (!model || !normalModel || !selectedModel) {
    throw new Error(`ZSelectView data error， ${JSON.stringify(model)}`);
  }

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.focusRow,
          width: 2 * (viewport.width + 2 * RESIZABLE_ROW_MARGIN),
        }}
      >
        <Row align="middle" justify="center" style={styles.focusRowContainer}>
          <div key={normalModel.mRef} style={styles.normalContainer}>
            <ZConfigRowTitle
              text={content.normalView}
              onClick={(e) => {
                uft(UserFlow.SELECT_TARGET)(normalModel.mRef);
                editorStore.clipBoardContainerMRef = normalModel.mRef;
                e.stopPropagation();
              }}
            />
            <ZComponentSelectionWrapper component={normalModel} clickable={false}>
              <ZChessBoardForTransparentBackground>
                <ZBlankContainer droppable mRef={normalModel.mRef} />
              </ZChessBoardForTransparentBackground>
            </ZComponentSelectionWrapper>
          </div>
          <div key={selectedModel.mRef}>
            <ZConfigRowTitle
              text={content.selectView}
              onClick={(e) => {
                uft(UserFlow.SELECT_TARGET)(selectedModel.mRef);
                editorStore.clipBoardContainerMRef = selectedModel.mRef;
                e.stopPropagation();
              }}
            />
            <ZComponentSelectionWrapper component={selectedModel} clickable={false}>
              <ZChessBoardForTransparentBackground>
                <ZBlankContainer droppable mRef={selectedModel.mRef} />
              </ZChessBoardForTransparentBackground>
            </ZComponentSelectionWrapper>
          </div>
        </Row>
      </div>
      <div className={`${ZMoveableClassName.PREVIEW}`} style={styles.preview}>
        <ZConfigRowTitle text={content.preview} />
        <div style={styles.previewContainer}>
          <ZComponentSelectionWrapper component={model}>
            {model.renderForPreview()}
          </ZComponentSelectionWrapper>
        </div>
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
  focusRowContainer: {
    marginTop: '30px',
  },
  preview: {
    marginTop: '100px',
    textAlign: 'center',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '30px',
  },
  normalContainer: {
    marginRight: '50px',
  },
};
