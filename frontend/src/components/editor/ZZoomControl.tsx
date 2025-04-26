/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import ZoomIn from '../../shared/assets/editor/zoom-in.svg';
import ZoomOut from '../../shared/assets/editor/zoom-out.svg';
import useLocale from '../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../utils/ZConst';
import i18n from './ZZoomControlProps.i18n.json';
import { Tooltip } from '../../zui';

export interface ZZoomControlProps {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
}

export default function ZZoomControl(props: ZZoomControlProps): ReactElement {
  const { localizedContent } = useLocale(i18n);

  return (
    <div style={styles.container}>
      <div onClick={props.zoomOut}>
        <Tooltip placement="top" title={localizedContent.zoomOut}>
          <img alt="" style={styles.zoomButton} src={ZoomOut} />
        </Tooltip>
      </div>
      <div style={styles.scale}>
        <Tooltip placement="top" title={localizedContent.reset}>
          <span style={styles.scaleText} onClick={props.resetTransform}>
            {`${Math.round(props.scale * 100)}%`}
          </span>
        </Tooltip>
      </div>
      <div onClick={props.zoomIn}>
        <Tooltip placement="top" title={localizedContent.zoomIn}>
          <img alt="" style={styles.zoomButton} src={ZoomIn} />
        </Tooltip>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '136px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: ZColors.BACKGROUND_WITH_OPACITY,
    backdropFilter: 'blur(8px)',
  },
  zoomButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: ZThemedColors.ACCENT,
    borderColor: ZThemedColors.ACCENT,
    cursor: 'pointer',
  },
  zoomButtonText: {
    margin: '-5px 0 0 0',
    fontSize: '30px',
  },
  scale: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
  },
  scaleText: {
    margin: 0,
    color: ZThemedColors.ACCENT,
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center',
    verticalAlign: 'center',
    cursor: 'pointer',
  },
};
