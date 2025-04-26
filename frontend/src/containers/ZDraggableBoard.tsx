/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React from 'react';
import ZScreenSelectionWrapper, {
  WRAPPER_BORDER_WIDTH,
  WRAPPER_PADDING_SIZE,
} from '../components/base/ZScreenSelectionWrapper';
import { Z_DRAG_SELECTABLE_CONTAINER } from '../components/editor/ZDragSelectable';
import { ImageSourceDefaultDataAttributes } from '../components/side-drawer-tabs/right-drawer/config-row/ImageSourceConfigRow';
import { BackgroundDefaultDataAttributes } from '../components/side-drawer-tabs/right-drawer/config-row/BackgroundConfigRow';
import useModel from '../hooks/useModel';
import useStores from '../hooks/useStores';
import BasicMobileModel from '../models/basic-components/BasicMobileModel';
import { EditorMode } from '../models/interfaces/EditorInfo';
import { DataBinding } from '../shared/type-definition/DataBinding';
import { BaseType } from '../shared/type-definition/DataModel';
import { EventBinding } from '../shared/type-definition/EventBinding';
import { NullableReactElement, ShortId } from '../shared/type-definition/ZTypes';
import { ZThemedBorderRadius, ZThemedColors, ZMoveableClassName } from '../utils/ZConst';
import i18n from './ZDraggableBoard.i18n.json';
import useLocale from '../hooks/useLocale';
import useWindowSize from '../hooks/useWindowSize';
import { ZedSupportedPlatform } from '../models/interfaces/ComponentModel';
import { useConfiguration } from '../hooks/useConfiguration';

interface Props {
  mRef: ShortId;
  style?: React.CSSProperties;
}

export const ZDraggableScreenDefaultReferenceAttributes = {
  shareInfo: {
    enabled: false,
    title: DataBinding.withSingleValue(BaseType.TEXT),
    ...ImageSourceDefaultDataAttributes,
  },
  pageDidLoad: [] as EventBinding[],
  pageDealloc: [] as EventBinding[],
};

export const ZDraggableScreenDefaultDataAttributes = {
  footerHeight: 0,
  ...ZDraggableScreenDefaultReferenceAttributes,
  ...BackgroundDefaultDataAttributes,
};

export type DraggableScreenAttributes = typeof ZDraggableScreenDefaultDataAttributes;

export default function ZDraggableBoard(props: Props): NullableReactElement {
  const { width, height } = useWindowSize();
  const { editorStore } = useStores();
  const isFocused = useObserver(() => {
    const { editorState } = editorStore;
    return editorState.mode === EditorMode.FOCUS && editorState.target === props.mRef;
  });

  const { initialScreenMRef } = useConfiguration();

  const model = useModel<BasicMobileModel>(props.mRef);
  const screenName = useObserver(() => model?.componentName);
  const { localizedContent: content } = useLocale(i18n);
  if (!model) return null;

  const openRightDrawer = () => {
    editorStore.rightDrawerTarget = props.mRef;
  };

  let containerStyle = {
    ...styles.screenContainer,
    ...(isFocused ? styles.overflowVisible : styles.overflowHidden),
  };
  switch (editorStore.editorPlatform) {
    case ZedSupportedPlatform.MOBILE_WEB:
    case ZedSupportedPlatform.WECHAT: {
      containerStyle = { ...containerStyle, ...model.getComponentFrame().size };
      break;
    }
    case ZedSupportedPlatform.WEB: {
      const webWidth = (width / 3) * 2;
      const webHeight = (height / 3) * 2;
      containerStyle = { ...containerStyle, width: webWidth, height: webHeight };
      break;
    }
    default:
      break;
  }

  return (
    <div style={{ ...styles.container, ...props.style }}>
      <div onClick={() => openRightDrawer()}>
        <label style={styles.containerTitle}>{`${screenName} ${
          initialScreenMRef === model.mRef ? content.homePage : ''
        }`}</label>
      </div>
      <ZScreenSelectionWrapper mRef={props.mRef} style={containerStyle}>
        <div
          className={`${Z_DRAG_SELECTABLE_CONTAINER} ${ZMoveableClassName.SELECTO_CONTAINER}_${props.mRef}`}
        >
          {model.renderForPreview()}
        </div>
      </ZScreenSelectionWrapper>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
  },
  screenContainer: {
    borderRadius: ZThemedBorderRadius.DEFAULT,
    zIndex: 1,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  overflowVisible: {
    overflow: 'visible',
  },
  containerTitle: {
    position: 'absolute',
    color: ZThemedColors.PRIMARY_TEXT,
    left: WRAPPER_PADDING_SIZE,
    top: WRAPPER_BORDER_WIDTH,
  },
};
