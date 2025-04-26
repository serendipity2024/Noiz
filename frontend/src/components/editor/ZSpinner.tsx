/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

import animationData from '../../shared/assets/lottie/zion-loading-lottie.json';

interface Props {
  width?: number;
  height?: number;
}

const ZSpinner = (props: Props): ReactElement => {
  const width = props.width ?? 600;
  const height = props.height ?? 600;

  return (
    <Player
      loop
      autoplay
      src={JSON.stringify(animationData)}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default ZSpinner;
