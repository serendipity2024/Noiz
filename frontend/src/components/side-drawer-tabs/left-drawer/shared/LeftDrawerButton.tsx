/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import SharedStyles from '../../right-drawer/config-row/SharedStyles';
import { Button } from '../../../../zui';

interface Props {
  text: string;
  type: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  handleOnClick?: () => void;
}

export default function LeftDrawerButton(props: Props): ReactElement {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const style = {
    ...styles.deleteButton,
    ...styles[props.type],
    ...(isMouseDown ? styles.mouseDown : null),
  };

  return (
    <Button
      type="primary"
      style={style}
      danger
      block
      disabled={props.disabled}
      loading={props.loading}
      onClick={props.handleOnClick}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {props.text}
    </Button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  deleteButton: {
    marginTop: '20px',
    ...SharedStyles.configRowButton,
  },
  mouseDown: {
    opacity: 0.6,
  },

  // typed styles
  primary: {
    backgroundColor: ZThemedColors.ACCENT,
  },
  secondary: {
    backgroundColor: ZThemedColors.SECONDARY,
  },
  outline: {
    backgroundColor: ZColors.TRANSPARENT,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    borderColor: ZThemedColors.ACCENT,
    color: ZThemedColors.ACCENT,
  },
};
