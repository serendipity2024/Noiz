/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useStores from '../../hooks/useStores';
import BaseContainerModel from '../../models/base/BaseContainerModel';
import CustomListModel from '../../models/mobile-components/CustomListModel';
import useViewport from '../../hooks/useViewport';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import ZBlankContainer from '../mobile-components/ZBlankContainer';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import useModel from '../../hooks/useModel';
import { MRefProp } from '../mobile-components/PropTypes';
import { Row } from '../../zui';

const RESIZABLE_ROW_MARGIN = 20;

export default observer(function ZCustomListFocusView(props: MRefProp): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const { editorStore } = useStores();
  const viewport = useViewport();

  const model = useModel(props.mRef) as CustomListModel;
  if (!model) {
    throw new Error(`ZCustomList cell error， ${JSON.stringify(model)}`);
  }
  if (model.childMRefs.length < 1) {
    throw new Error(`ZCustomList cell error， ${JSON.stringify(model)}`);
  }

  const cellModel = model.children()[0] as BaseContainerModel;
  const headerViewModel = model.children()[1] as BaseContainerModel;

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.focusRow,
          width: 2 * (viewport.width + 2 * RESIZABLE_ROW_MARGIN),
        }}
      >
        <Row align="middle" justify="center">
          {headerViewModel ? (
            <div
              key={headerViewModel.mRef}
              style={{
                marginRight: RESIZABLE_ROW_MARGIN,
              }}
            >
              <ZConfigRowTitle
                text={content.headerView}
                onClick={(e) => {
                  if (headerViewModel?.mRef) {
                    uft(UserFlow.SELECT_TARGET)(headerViewModel.mRef);
                    editorStore.clipBoardContainerMRef = headerViewModel.mRef;
                  }
                  e.stopPropagation();
                }}
              />
              <ZComponentSelectionWrapper component={headerViewModel} clickable={false}>
                <ZChessBoardForTransparentBackground>
                  <ZBlankContainer droppable mRef={headerViewModel.mRef} />
                </ZChessBoardForTransparentBackground>
              </ZComponentSelectionWrapper>
            </div>
          ) : undefined}
          <div key={cellModel.mRef}>
            <ZConfigRowTitle
              text={content.cellView}
              onClick={(e) => {
                uft(UserFlow.SELECT_TARGET)(cellModel.mRef);
                editorStore.clipBoardContainerMRef = cellModel.mRef;
                e.stopPropagation();
              }}
            />
            <ZComponentSelectionWrapper component={cellModel} clickable={false}>
              <ZChessBoardForTransparentBackground>
                <ZBlankContainer droppable mRef={cellModel.mRef} />
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
};
