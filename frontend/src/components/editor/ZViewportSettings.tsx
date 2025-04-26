/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import PlatformHover from '../../shared/assets/icons/platform-hover.svg';
import PlatformImg from '../../shared/assets/icons/platform-normal.svg';
import ZHoverableIcon from './ZHoverableIcon';
import ZViewportSettingsPopup from './ZViewportSettingsPopup';
import i18n from './ZViewportSettings.i18n.json';
import useLocale from '../../hooks/useLocale';

export default function ZViewportSettings(): ReactElement {
  const [isOn, setIsOn] = useState(false);
  const { localizedContent: content } = useLocale(i18n);

  return (
    <div style={styles.container}>
      <ZHoverableIcon
        key="device"
        isSelected={isOn}
        src={PlatformImg}
        hoveredSrc={PlatformHover}
        selectedSrc={PlatformHover}
        containerStyle={styles.iconContainer}
        toolTip={content.tooltip}
        toolTipPlacement="bottom"
        iconStyle={styles.icon}
        onClick={() => setIsOn(!isOn)}
      />
      {isOn && <ZViewportSettingsPopup onClose={() => setIsOn(false)} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};
