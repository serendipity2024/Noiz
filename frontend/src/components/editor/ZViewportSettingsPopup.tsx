/* eslint-disable import/no-default-export */
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { transaction } from 'mobx';
import useLocale from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';
import { ZSize } from '../../models/interfaces/Frame';
import { Device } from '../../shared/data/Devices';
import DeviceViewportSizes from '../../shared/data/DeviceViewportSizes';
import Platforms, { Platform, PlatformToDeviceMap } from '../../shared/data/Platforms';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../utils/ZConst';
import LeftDrawerButton from '../side-drawer-tabs/left-drawer/shared/LeftDrawerButton';
import LeftDrawerTitle from '../side-drawer-tabs/left-drawer/shared/LeftDrawerTitle';
import i18n from './ZViewportSettingsPopup.i18n.json';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import { useConfiguration } from '../../hooks/useConfiguration';
import { InputNumber } from '../../zui';

interface Props {
  onClose: () => void;
}

export default function ZViewportSettingsPopup(props: Props): ReactElement {
  const uft = useSelectionTrigger();
  const { coreStore } = useStores();
  const { viewport: screenSize, targetDevice } = useConfiguration();

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('custom');
  const [inputScreenSize, setInputScreenSize] = useState(screenSize);
  const { localizedContent: content } = useLocale(i18n);

  useEffect(() => {
    if (screenSize !== inputScreenSize) setInputScreenSize(screenSize);
    // eslint-disable-next-line
  }, [screenSize]);

  const handleOnCustomSizeChange = () => {
    coreStore.updateConfiguration({ viewport: inputScreenSize, targetDevice: null });
  };
  const handelOnDeviceChange = (device: Device) => {
    const { width, height } = DeviceViewportSizes[device];
    const viewport = { width, height } as ZSize;
    transaction(() => {
      coreStore.updateConfiguration({ viewport, targetDevice: device });
      uft(UserFlow.DRAG_DESELECTED)();
    });
  };

  // later migrate to use antd.tabview
  const renderTabContent = () => {
    if (selectedPlatform === 'custom')
      return (
        <div style={styles.tabContentContainer}>
          <div style={styles.inputRow}>
            <div style={styles.inputColumn}>
              <label style={styles.inputLabel}>W=</label>
              <InputNumber
                style={styles.input}
                size="large"
                type="number"
                value={inputScreenSize.width}
                placeholder="10"
                min={1}
                onChange={(value) =>
                  setInputScreenSize({ ...inputScreenSize, width: value as number })
                }
              />
            </div>
            <div style={styles.inputColumn}>
              <label style={styles.inputLabel}>H=</label>
              <InputNumber
                style={styles.input}
                size="large"
                type="number"
                value={inputScreenSize.height}
                placeholder="10"
                min={1}
                onChange={(value) =>
                  setInputScreenSize({ ...inputScreenSize, height: value as number })
                }
              />
            </div>
          </div>
          <div style={styles.buttonRow}>
            <LeftDrawerButton type="outline" text={content.cancel} handleOnClick={props.onClose} />
            <div style={styles.spaceInBetween} />
            <LeftDrawerButton
              type="primary"
              text={content.done}
              handleOnClick={handleOnCustomSizeChange}
            />
          </div>
        </div>
      );

    const deviceData = PlatformToDeviceMap[selectedPlatform];

    return (
      <div style={styles.tabContentContainer}>
        {Object.keys(deviceData).map((value: string, index) => {
          const device = value as Device;
          const isActive = targetDevice === device;
          const containerStyle = {
            ...styles.deviceRowContainer,
            ...(isActive ? styles.deviceRowContainerActive : null),
            ...(index !== 0 ? styles.deviceRowContainerMargin : null),
          };
          const titleStyle = {
            ...styles.deviceRowTitle,
            ...(isActive ? styles.deviceRowTitleActive : null),
          };
          const imgSrc = DeviceViewportSizes[device][isActive ? 'iconActive' : 'icon'];
          const rowTitle = `${content.viewport[device]} - ${deviceData[device]?.width} x ${deviceData[device]?.height}`;

          return (
            <div key={device} style={containerStyle} onClick={() => handelOnDeviceChange(device)}>
              <img alt="" style={styles.deviceRowIcon} src={imgSrc} />
              <span style={titleStyle}>{rowTitle}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <LeftDrawerTitle>{content.title}</LeftDrawerTitle>
      <TabRowContainer style={styles.tabRowContainer}>
        {Platforms.map((tab: Platform, index: number) => {
          const style = {
            ...styles.tab,
            ...(selectedPlatform === tab ? styles.selectedTab : null),
            ...(index !== 0 ? styles.withTabMargin : null),
          };
          return (
            <span key={tab} style={style} onClick={() => setSelectedPlatform(tab)}>
              {content[tab]}
            </span>
          );
        })}
      </TabRowContainer>
      {renderTabContent()}
    </div>
  );
}

const TabRowContainer = styled.div`
  // hide scroll-bar
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: 52,
    right: 10,
    width: 308,
    height: 392,
    padding: '32px 26px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.PRIMARY,
  },
  tabRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 50,
    marginTop: 34,
    marginBottom: 25,
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  tab: {
    fontSize: 15,
    fontWeight: 600,
    color: ZColors.WHITE,
    cursor: 'pointer',
  },
  selectedTab: {
    color: ZThemedColors.ACCENT,
  },
  withTabMargin: {
    marginLeft: 20,
  },
  tabContentContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  inputRow: {
    display: 'flex',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputLabel: {
    color: ZColors.WHITE,
    opacity: 0.2,
  },
  inputColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceRowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    paddingLeft: 10,
    width: '100%',
    minHeight: 32,
    maxHeight: 32,
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
  },
  deviceRowContainerActive: {
    border: 'solid',
    borderWidth: 2,
    borderColor: ZThemedColors.ACCENT,
  },
  deviceRowContainerMargin: {
    marginTop: 12,
  },
  deviceRowIcon: {
    width: 24,
    height: 20,
    objectFit: 'contain',
  },
  deviceRowTitle: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: 600,
    color: ZColors.WHITE,
  },
  deviceRowTitleActive: {
    color: ZThemedColors.ACCENT,
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
  spaceInBetween: {
    width: 20,
  },
};
