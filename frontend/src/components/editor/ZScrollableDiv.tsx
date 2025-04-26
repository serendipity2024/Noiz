/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import useWindowSize from '../../hooks/useWindowSize';

interface Props {
  children: ReactNode;

  outterStyle?: CSSProperties;
  innerStyle?: CSSProperties;
  maxHeight?: string;
  maxHeightPercent?: number;
}

export default function ZScrollableDiv(props: Props): ReactElement {
  const { height } = useWindowSize();

  const { children, maxHeight, maxHeightPercent } = props;
  const mHeight = maxHeight || height * (maxHeightPercent ?? 0.9);

  return (
    <div style={props.outterStyle}>
      <Scrollbars autoHide autoHeight autoHeightMax={mHeight}>
        <div style={props.innerStyle}>{children}</div>
      </Scrollbars>
    </div>
  );
}
