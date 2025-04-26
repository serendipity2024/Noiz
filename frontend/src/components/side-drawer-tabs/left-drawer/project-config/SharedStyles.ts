/* eslint-disable import/no-default-export */
import { Gutter } from 'antd/lib/grid/row';
import { CSSProperties } from 'react';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';

const SharedStyles: Record<string, CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: ZThemedColors.SECONDARY_WITH_OPACITY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  input: {
    width: '100%',
    paddingLeft: '13px',
    color: ZColors.WHITE,
    border: 'none',
    boxShadow: 'none',
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  space: {
    display: 'block',
    width: '100%',
  },
};

export default SharedStyles;

export enum GridWidth {
  ONE_THIRD = 8,
  HALF = 12,
  TWO_THIRDS = 16,
  ALL = 24,
}

export const GridGutter: Record<string, [Gutter, Gutter]> = {
  default: [16, 16],
};
