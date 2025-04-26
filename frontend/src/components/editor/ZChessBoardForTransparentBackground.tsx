/* eslint-disable import/no-default-export */
import React, { ReactElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function ZChessBoardForTransparentBackground(props: Props): ReactElement {
  return <div style={styles.container}>{props.children}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'repeating-conic-gradient(#FFFFFF10 0% 25%, transparent 0% 50%) 50% / 20px 20px',
    height: '100%',
    width: '100%',
  },
};
