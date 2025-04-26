/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import useResponsiveWindow from '../../hooks/useResponsiveWindow';
import useStores from '../../hooks/useStores';
import ZionLogo from '../../shared/assets/zion-logo.svg';
import ZLongPressableContainer from './ZLongPressableContainer';
import DeveloperModeVerification from '../../views/DeveloperModeVerification';
import useIsDeveloperMode from '../../hooks/useIsDeveloperMode';

interface Props {
  enableDebug?: boolean;
  style?: CSSProperties;
}

export default function ZZionLogo(props: Props): ReactElement {
  const { isPortrait } = useResponsiveWindow();
  const { persistedStore, editorStore } = useStores();
  const isDeveloperMode = useIsDeveloperMode();

  const onLongPress = () => {
    if (props.enableDebug) {
      if (isDeveloperMode) {
        persistedStore.switchDeveloperMode();
      } else {
        editorStore.switchDevPasswordEntryVisibility();
      }
    }
  };

  const styles = isPortrait ? portraitStyles : landscapeStyles;
  return (
    <>
      <DeveloperModeVerification />
      <ZLongPressableContainer onLongPress={onLongPress} longPressTime={3000}>
        <img alt="" style={{ ...styles.logo, ...(props.style ?? {}) }} src={ZionLogo} />
      </ZLongPressableContainer>
    </>
  );
}

const landscapeStyles: Record<string, React.CSSProperties> = {
  logo: {
    position: 'absolute',
    top: '35px',
    left: '30px',
    width: '80px',
    height: '28px',
    zIndex: 100,
  },
};

const portraitStyles: Record<string, React.CSSProperties> = {
  ...landscapeStyles,
  logo: {
    ...landscapeStyles.logo,
    left: '5%',
  },
};
