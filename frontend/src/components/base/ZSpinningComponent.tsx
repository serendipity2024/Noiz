/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { CSSProperties, ReactNode } from 'react';
import './ZSpinningComponent.scss';

interface Props {
  children: ReactNode;
  speed?: number;
  style?: CSSProperties; // unit in seconds
}

const DEFAULT_SPEED = 3;

export default function ZSpinningComponent(props: Props) {
  const animationStyle = {
    animation: `spin ${props.speed ?? DEFAULT_SPEED}s linear infinite`,
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
        ...animationStyle,
      }}
    >
      {props.children}
    </div>
  );
}
