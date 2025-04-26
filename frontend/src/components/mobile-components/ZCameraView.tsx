/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react';
import React from 'react';
import { CameraFilled } from '@ant-design/icons';
import useModel from '../../hooks/useModel';
import ZFrame from '../../models/interfaces/Frame';
import { MRefProp } from './PropTypes';
import { ZColors } from '../../utils/ZConst';
import {
  CameraResolution,
  CameraPosition,
  CameraFlash,
  CameraFrameSize,
} from '../../shared/type-definition/EventBinding';

export const ZCameraDefaultDataAttributes = {
  resolution: CameraResolution.MEDIUM,
  devicePosition: CameraPosition.BACK,
  flash: CameraFlash.AUTO,
  frameSize: CameraFrameSize.MEDIUM,
};

export type CameraViewAttributes = typeof ZCameraDefaultDataAttributes;

export const ZCameraViewDefaultFrame: ZFrame = {
  size: { width: 300, height: 200 },
  position: { x: 0, y: 0 },
};

export default observer(function ZImage(props: MRefProp) {
  const model = useModel(props.mRef);
  if (!model) return null;

  return (
    <div style={{ ...styles.container }}>
      <CameraFilled style={styles.placeholderImage} />
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: ZColors.TRANSPARENT_LIKE_GREY,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderColor: ZColors.BLACK,
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  placeholderImage: {
    fontSize: '35px',
  },
};
