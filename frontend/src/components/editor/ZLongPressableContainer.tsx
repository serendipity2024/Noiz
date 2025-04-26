/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onLongPress?: () => void;
  longPressTime?: number; // in ms
}

export default function ZLongPressableContainer(props: Props): ReactElement {
  let buttonPressTimer: any;

  const handleOnPress = () => {
    if (!props.onLongPress) return;

    const delayTime = props.longPressTime ?? 1000;
    buttonPressTimer = setTimeout(props.onLongPress, delayTime);
  };
  const handleOnRelease = () => clearTimeout(buttonPressTimer);

  return (
    <div
      style={styles.container}
      onTouchStart={handleOnPress}
      onTouchEnd={handleOnRelease}
      onMouseDown={handleOnPress}
      onMouseUp={handleOnRelease}
      onMouseLeave={handleOnRelease}
    >
      {props.children}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    cursor: 'pointer',
  },
};
