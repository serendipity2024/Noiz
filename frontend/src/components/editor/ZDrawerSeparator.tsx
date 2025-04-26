/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { ZColors, ZThemedColors } from '../../utils/ZConst';

interface Props {
  theme?: 'white' | 'accent';
  style?: React.CSSProperties;
}

export default function ZDrawerSeparator(props: Props) {
  const themeStyle = props.theme === 'accent' ? styles.themeAccent : styles.themeWhite;

  return <div style={{ ...styles.main, ...themeStyle, ...props.style }} />;
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    width: '100%',
  },
  themeAccent: {
    height: '1px',
    background: ZThemedColors.ACCENT,
    opacity: 1,
  },
  themeWhite: {
    height: '2px',
    backgroundColor: ZColors.WHITE,
    opacity: 0.1,
  },
};
