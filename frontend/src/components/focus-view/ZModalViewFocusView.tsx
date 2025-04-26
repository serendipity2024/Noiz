/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react';
import ZScreenSelectionWrapper from '../base/ZScreenSelectionWrapper';
import ZDroppableArea from '../dnd/ZDroppableArea';
import ZDroppableMask from '../dnd/ZDroppableMask';
import { ZCustomViewDefaultDataAttributes } from '../mobile-components/ZCustomView';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useColorBinding from '../../hooks/useColorBinding';
import useViewport from '../../hooks/useViewport';
import StoreHelpers from '../../mobx/StoreHelpers';
import ModalViewModel from '../../models/mobile-components/ModalViewModel';
import { ZThemedBorderRadius, ZMoveableClassName } from '../../utils/ZConst';
import { prepareCombinedStyles } from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { MRefProp } from '../mobile-components/PropTypes';
import useModel from '../../hooks/useModel';

export const ZModalViewDefaultDataAttributes = {
  ...ZCustomViewDefaultDataAttributes,
  closeOnClickOverlay: false,
};

export type ModalViewAttributes = typeof ZModalViewDefaultDataAttributes;

export default observer(function ZModalViewFocusView(props: MRefProp) {
  const { localizedContent: content } = useLocale(i18n);
  const cb = useColorBinding();
  const viewport = useViewport();

  const model = useModel(props.mRef) as ModalViewModel;
  if (!model) {
    throw new Error(`ZModalView data error， ${JSON.stringify(model)}`);
  }
  const screenModel = StoreHelpers.fetchRootModel(model);
  if (!screenModel) {
    throw new Error(`ModalViewFocusView fetch screenMRef error`);
  }

  // styles
  const dataAttributes = model.dataAttributes as ModalViewAttributes;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const containerStyle = { ...styles.screenContainer, ...viewport };

  return (
    <div style={styles.container}>
      <div style={styles.focusRow}>
        <ZConfigRowTitle text={content.focusRow} />
        <ZChessBoardForTransparentBackground>
          <div style={{ ...configuredStyle, backgroundColor }}>
            <ZDroppableArea mRef={model.mRef} />
          </div>
        </ZChessBoardForTransparentBackground>
      </div>
      <div className={`${ZMoveableClassName.PREVIEW}`} style={styles.preview}>
        <ZConfigRowTitle text={content.preview} />
        <ZScreenSelectionWrapper mRef={model.mRef} style={containerStyle}>
          <div style={{ ...styles.area, ...containerStyle }}>
            <ZDroppableArea
              mRef={screenModel.mRef}
              droppable={false}
              backgroundStyles={{ backgroundColor: cb(screenModel.dataAttributes.backgroundColor) }}
            />
          </div>
          <div style={styles.mark}>
            <ZDroppableMask item={model} />
          </div>
        </ZScreenSelectionWrapper>
      </div>
    </div>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  area: {
    position: 'absolute',
  },
  mark: {
    position: 'absolute',
    zIndex: 1000,
  },
  screenContainer: {
    overflow: 'hidden',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    zIndex: 1,
  },
};
