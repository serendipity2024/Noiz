/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import VideoPlaceholder from '../../shared/assets/icons/video-placeholder.svg';
import { DataBinding } from '../../shared/type-definition/DataBinding';
import { EventBinding } from '../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CombinedStyleDefaultDataAttributes,
  prepareCombinedStyles,
} from '../side-drawer-tabs/right-drawer/config-row/CombinedStyleConfigRow';
import {
  VideoSource,
  VideoSourceDefaultDataAttributes,
} from '../side-drawer-tabs/right-drawer/config-row/VideoSourceConfigRow';
import { MRefProp } from './PropTypes';

export enum VideoObjectFit {
  CONTAIN = 'contain',
  FILL = 'fill',
  COVER = 'cover',
}

export const ZVideoDefaultReferenceAttributes = {
  onBeginPlay: [] as EventBinding[],
};

export const ZVideoDefaultDataAttributes = {
  ...CombinedStyleDefaultDataAttributes,
  ...VideoSourceDefaultDataAttributes,
  ...ZVideoDefaultReferenceAttributes,
  backgroundColor: DataBinding.withColor(ZColors.TRANSPARENT),
  controls: true,
  autoplay: false,
  loop: false,
  showMuteBtn: true,
  objectFit: VideoObjectFit.CONTAIN,
};

export type VideoAttributes = typeof ZVideoDefaultDataAttributes;

export const ZVideoDefaultFrame: ZFrame = {
  size: { width: 265, height: 150 },
  position: { x: 0, y: 0 },
};

export default observer(function ZVideo(props: MRefProp): NullableReactElement {
  const cb = useColorBinding();
  const model = useModel(props.mRef);
  if (!model) return null;

  // styles
  const dataAttributes = model.dataAttributes as VideoAttributes;
  const configuredStyle = {
    ...prepareCombinedStyles(dataAttributes, cb),
  };

  const isPlaceholder =
    dataAttributes.videoSource !== VideoSource.UPLOAD ||
    dataAttributes.videoObject.effectiveValue.length === 0;
  const backgroundColor = isPlaceholder
    ? ZColors.TRANSPARENT_LIKE_GREY
    : cb(dataAttributes.backgroundColor);

  return (
    <div style={{ ...styles.container, ...configuredStyle, backgroundColor }}>
      <img alt="" src={VideoPlaceholder} style={styles.placeholderImage} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  caret: {
    fontSize: '32px',
    color: '#fff',
  },
  time: {
    color: 'white',
  },
  placeholderImage: {
    width: '35px',
    height: '35px',
  },
};
