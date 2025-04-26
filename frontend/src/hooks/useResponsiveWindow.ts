/* eslint-disable import/no-default-export */
import { CSSProperties, useEffect, useState } from 'react';
import { ZSize } from '../models/interfaces/Frame';
import useWindowSize from './useWindowSize';

export const DefaultMobileSize: ZSize = { width: 375, height: 812 };
export const DefaultWindowSize: ZSize = { width: 1366, height: 863 };

export interface ResponsiveWindow {
  isPortrait: boolean;
  ratio: number;
  makeResponsive: (
    style: CSSProperties,
    whitelistKeys?: (keyof CSSProperties)[],
    blacklistKeys?: (keyof CSSProperties)[]
  ) => CSSProperties;
  makeResponsiveStyles: (
    style: Record<string, CSSProperties>,
    whitelistKeys?: (keyof CSSProperties)[],
    blacklistKeys?: (keyof CSSProperties)[]
  ) => Record<string, CSSProperties>;
}

export default function useResponsiveWindow(baseSize?: ZSize): ResponsiveWindow & ZSize {
  const { width, height } = useWindowSize();
  const [state, setState] = useState({ ratio: 1, isPortait: width / height < 0.8 && width < 500 });

  useEffect(() => {
    const currWHRatio = width / height;
    const isPortrait = currWHRatio < 0.8;

    const { width: baseW, height: baseH } =
      baseSize ?? (isPortrait ? DefaultMobileSize : DefaultWindowSize);
    const baseWHRatio = baseW / baseH;

    const newRatio = currWHRatio > baseWHRatio ? height / baseH : width / baseW;
    setState({ ratio: Math.min(newRatio, 1.2), isPortait: isPortrait });
  }, [width, height, baseSize]);

  const makeResponsive = (
    style: CSSProperties,
    keysToAllow?: (keyof CSSProperties)[],
    keysToSkip: (keyof CSSProperties)[] = ['fontWeight', 'opacity', 'flex']
  ): CSSProperties => {
    const whitelist = new Set(keysToAllow);
    const blacklist = new Set(keysToSkip);

    const newEntries: any = {};
    for (const [k, v] of Object.entries(style)) {
      if (typeof v !== 'number') continue;
      if (!!keysToAllow && !whitelist.has(k as keyof CSSProperties)) continue;
      if (!!keysToSkip && blacklist.has(k as keyof CSSProperties)) continue;

      newEntries[k] = v * state.ratio;
    }

    return { ...style, ...newEntries };
  };

  const makeResponsiveStyles = (
    styles: Record<string, CSSProperties>,
    keysToAllow?: (keyof CSSProperties)[],
    keysToSkip: (keyof CSSProperties)[] = ['fontWeight', 'opacity', 'flex']
  ): Record<string, CSSProperties> => {
    const rsp: Record<string, CSSProperties> = {};
    Object.entries(styles).forEach(([k, v]) => {
      rsp[k] = makeResponsive(v, keysToAllow, keysToSkip);
    });
    return rsp;
  };

  return {
    isPortrait: state.isPortait,
    ratio: state.ratio,
    width,
    height,
    makeResponsive,
    makeResponsiveStyles,
  };
}
