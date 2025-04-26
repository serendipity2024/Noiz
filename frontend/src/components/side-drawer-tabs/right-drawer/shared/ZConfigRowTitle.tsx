/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import SharedStyles from '../config-row/SharedStyles';

interface Props {
  text: string;
  onClick?: (event: React.MouseEvent) => void;
}

export default function ZConfigRowTitle(props: Props): ReactElement {
  return (
    <div
      style={styles.container}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      <label style={styles.text}>{props.text}</label>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    margin: '10px 5px',
  },
  text: {
    ...SharedStyles.configRowTitleText,
  },
};
