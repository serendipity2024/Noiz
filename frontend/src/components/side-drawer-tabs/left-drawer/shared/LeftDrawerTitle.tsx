/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';

type TitleType = 'title' | 'subtitle';

interface Props {
  children: string;

  type?: TitleType;
  containerStyle?: CSSProperties;
  textStyle?: CSSProperties;
}

export default function LeftDrawerTitle(props: Props): ReactElement {
  const fontStyle = {
    ...styles[props.type ?? 'title'],
    ...props.textStyle,
  };
  return (
    <div style={{ ...styles.container, ...props.containerStyle }}>
      <span style={fontStyle}>{props.children}</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    width: '100%',
  },
  title: {
    fontSize: '16px',
    color: ZThemedColors.ACCENT,
  },
  subtitle: {
    fontSize: '12px',
    color: ZColors.WHITE,
    opacity: 0.5,
  },
};
