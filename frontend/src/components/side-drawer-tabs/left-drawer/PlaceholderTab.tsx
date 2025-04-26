/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import { ZThemedColors } from '../../../utils/ZConst';

const DEFAULT_TEXT = 'Coming Soon...';

export default function PlaceholderTab(props: { text?: string }): ReactElement {
  return (
    <div style={styles.container}>
      <span style={styles.text}>{props.text ?? DEFAULT_TEXT}</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100px',
  },
  text: {
    color: ZThemedColors.SECONDARY_TEXT,
    fontSize: '16px',
    lineHeight: '22px',
  },
};
