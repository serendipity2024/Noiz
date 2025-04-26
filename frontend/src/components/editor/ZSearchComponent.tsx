/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import useLocale from '../../hooks/useLocale';
import { ZThemedBorderRadius, ZThemedColors } from '../../utils/ZConst';
import LeftDrawerTitle from '../side-drawer-tabs/left-drawer/shared/LeftDrawerTitle';
import i18n from './ZSearchComponent.i18n.json';
import ZHoverableIcon from './ZHoverableIcon';
import SearchComponentHover from '../../shared/assets/icons/search-component-hover.svg';
import SearchComponent from '../../shared/assets/icons/search-component-normal.svg';
import SearchComponentTab from '../side-drawer-tabs/left-drawer/SearchComponentTab';
import LeftDrawerButton from '../side-drawer-tabs/left-drawer/shared/LeftDrawerButton';

export default function ZSearchComponent(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  const [isOn, setIsOn] = useState(false);

  return (
    <div style={styles.container}>
      <ZHoverableIcon
        key="device"
        isSelected={isOn}
        src={SearchComponent}
        hoveredSrc={SearchComponentHover}
        selectedSrc={SearchComponentHover}
        containerStyle={styles.iconContainer}
        toolTip={content.title}
        toolTipPlacement="bottom"
        iconStyle={styles.icon}
        onClick={() => setIsOn(!isOn)}
      />
      {isOn && (
        <>
          <div style={styles.content}>
            <LeftDrawerTitle>{content.title}</LeftDrawerTitle>
            <div style={styles.searchContainer}>
              <SearchComponentTab />
            </div>
            <div style={styles.buttonRow}>
              <LeftDrawerButton
                type="outline"
                text={content.close}
                handleOnClick={() => setIsOn(!isOn)}
              />
            </div>
          </div>
        </>
      )}
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
  content: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: 52,
    right: 10,
    width: 328,
    height: 332,
    padding: '32px 26px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.PRIMARY,
  },
  searchContainer: {
    marginTop: '20px',
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    padding: '18px',
  },
  buttonRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
};
