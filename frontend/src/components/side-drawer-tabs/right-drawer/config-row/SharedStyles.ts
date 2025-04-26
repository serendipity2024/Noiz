/* eslint-disable import/no-default-export */
import { CSSProperties } from 'react';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';

const SharedStyles: Record<string, CSSProperties> = {
  configRowTitleText: {
    fontSize: '12px',
    fontWeight: 700,
    color: ZThemedColors.PRIMARY_TEXT,
  },
  configRowButton: {
    width: '100%',
    height: '47px',
    fontSize: '16px',
    border: 'hidden',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.SECONDARY,
  },
};

export default SharedStyles;
