/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React, { CSSProperties, ReactElement } from 'react';
import { Locale } from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';
import { ZColors, ZThemedColors } from '../../utils/ZConst';

interface Props {
  style?: CSSProperties;
}

export default function ZLocaleSwitch(props: Props): ReactElement {
  const { persistedStore } = useStores();
  const isZH = useObserver(() => persistedStore.locale !== Locale.EN);

  const updateLocale = (target: Locale): void => persistedStore.setLocale(target);

  return (
    <div style={{ ...styles.container, ...props.style }}>
      <span style={isZH ? styles.active : styles.inactive} onClick={() => updateLocale(Locale.ZH)}>
        中
      </span>
      <span style={styles.pipeline}>|</span>
      <span style={isZH ? styles.inactive : styles.active} onClick={() => updateLocale(Locale.EN)}>
        EN
      </span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  active: {
    color: ZThemedColors.ACCENT,
    fontSize: '12px',
    cursor: 'pointer',
  },
  inactive: {
    color: ZColors.WHITE,
    fontSize: '12px',
    opacity: 0.2,
    cursor: 'pointer',
  },
  pipeline: {
    margin: '0 6px',
    fontSize: '12px',
    color: ZColors.WHITE,
  },
};
