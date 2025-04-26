/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useModel from '../../hooks/useModel';
import useStores from '../../hooks/useStores';
import useViewport from '../../hooks/useViewport';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import ZBlankContainer from '../mobile-components/ZBlankContainer';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import CustomMultiImagePickerModel from '../../models/mobile-components/CustomMultiImagePickerModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from '../mobile-components/PropTypes';
import { Row } from '../../zui';

const RESIZABLE_ROW_MARGIN = 20;

interface Props {
  model: CustomMultiImagePickerModel;
}

export default observer(function ZCustomMultiImagePickerFocusView(
  props: MRefProp
): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const viewport = useViewport();
  const { editorStore } = useStores();

  const model = useModel(props.mRef) as CustomMultiImagePickerModel;
  const imageContainerModel = useModel(model.dataAttributes.imageContainerMRef);
  const addContainerModel = useModel(model.dataAttributes.addContainerMRef);

  if (!model || !imageContainerModel || !addContainerModel) {
    throw new Error(`ZCustomMultiImagePicker data error， ${JSON.stringify(model)}`);
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
          <div key={imageContainerModel.mRef} style={styles.normalContainer}>
            <ZConfigRowTitle
              text={content.imageView}
              onClick={(e) => {
                uft(UserFlow.SELECT_TARGET)(imageContainerModel.mRef);
                editorStore.clipBoardContainerMRef = imageContainerModel.mRef;
                e.stopPropagation();
              }}
            />
            <ZComponentSelectionWrapper component={imageContainerModel} clickable={false}>
              <ZChessBoardForTransparentBackground>
                <ZBlankContainer droppable mRef={imageContainerModel.mRef} />
              </ZChessBoardForTransparentBackground>
            </ZComponentSelectionWrapper>
          </div>
          <div key={addContainerModel.mRef}>
            <ZConfigRowTitle
              text={content.addView}
              onClick={(e) => {
                uft(UserFlow.SELECT_TARGET)(addContainerModel.mRef);
                editorStore.clipBoardContainerMRef = addContainerModel.mRef;
                e.stopPropagation();
              }}
            />
            <ZComponentSelectionWrapper component={addContainerModel} clickable={false}>
              <ZChessBoardForTransparentBackground>
                <ZBlankContainer droppable mRef={addContainerModel.mRef} />
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
