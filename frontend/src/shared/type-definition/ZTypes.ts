import { ReactElement } from 'react';

export type NullableReactElement = ReactElement | null;

export type ShortId = string;

export type NullableShortId = string | null;

export type ExId = string;

export type HexColor = string;

export type AnyDataModel = any;

export type ColorTheme = Record<string, string>;

export enum FontWeight {
  LIGHT = 'light',
  REGULAR = 'regular',
  MEDIUM = 'medium',
}

export const getFontWeightValue = (fontWeight: FontWeight): number => {
  switch (fontWeight) {
    case FontWeight.LIGHT:
      return 300;
    case FontWeight.REGULAR:
      return 400;
    case FontWeight.MEDIUM:
      return 700;
    default:
      return 400;
  }
};
