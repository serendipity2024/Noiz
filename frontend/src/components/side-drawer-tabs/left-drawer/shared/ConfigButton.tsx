/* eslint-disable import/no-default-export */
import { ButtonProps } from 'antd/lib/button';
import React, { CSSProperties, ReactElement, useState } from 'react';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import { Button } from '../../../../zui';

interface Props {
  children: string;
  zedType: 'primary' | 'secondary' | 'outline';
  disabledstyle?: CSSProperties;
}

export default function ConfigButton(
  props: Props & ButtonProps & React.RefAttributes<HTMLElement>
): ReactElement {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { zedType, children, disabled, style, ...rest } = props;

  const fontSize = () => {
    switch (props.size ?? 'middle') {
      case 'large':
        return '16px';
      case 'middle':
      case 'small':
      default:
        return '12px';
    }
  };
  const customStyle = {
    ...styles.default,
    ...{ fontSize: fontSize() },
    ...(disabled ? { ...styles.disabled, ...props.disabledstyle } : styles[zedType]),
    ...(isMouseDown && !disabled ? styles.mouseDown : null),
    ...style,
  };

  return (
    <Button
      style={customStyle}
      icon={props.icon}
      block
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      type="primary"
    >
      {children}
    </Button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  default: {
    width: '100%',
    border: 'hidden',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.SECONDARY,
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
  disabled: {
    backgroundColor: ZThemedColors.PRIMARY,
  },
};
