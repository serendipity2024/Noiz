import React, { ReactElement } from 'react';
import { Row } from 'antd/es/grid';
import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import i18n from './ZManagementConsoleView.i18n.json';
import useLocale from '../../hooks/useLocale';
import { ZManagementConsoleDataModel } from './ZManagementConsoleDataModel';
import { ZManagementConsoleTabs } from './ZManagementConsoleTabs';
import { Tabs, Modal, Dropdown } from '../../zui';
import cssModule from './ZManagementConsoleView.module.scss';
import useProjectDetails from '../../hooks/useProjectDetails';
import useNotificationDisplay from '../../hooks/useNotificationDisplay';

const MC_ACCOUNT = 'admin';

interface Props {
  managementConsoleConfigVisible: boolean;
  onManagementConsoleConfigVisibleChange: (modelVisible: boolean) => void;
}

export function ZManagementConsoleView(props: Props): ReactElement {
  const { localizedContent } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();

  const { managementConsoleUrl, customizedMcUrl, customizedMcDefaultPassword } =
    useProjectDetails();
  const { managementConsoleConfigVisible, onManagementConsoleConfigVisibleChange } = props;
  const containerHeight = '75vh';
  const containerWidth = '85vw';

  function renderNewMc() {
    return (
      <Dropdown
        placement="bottomCenter"
        overlay={
          <div className={cssModule.menu}>
            <div className={cssModule.rowContainer}>
              <div className={cssModule.accountTitle}>{localizedContent.account}</div>
              <div className={cssModule.accountContent}>{MC_ACCOUNT}</div>
            </div>
            <div className={cssModule.rowContainer}>
              <div className={cssModule.accountTitle}>{localizedContent.password}</div>
              <div className={cssModule.accountContent}>{customizedMcDefaultPassword}</div>
              <CopyToClipboard
                text={customizedMcDefaultPassword}
                onCopy={() => displayNotification('COPIED_TO_CLIPBOARD')}
              >
                <CopyOutlined className={cssModule.copyIcon} />
              </CopyToClipboard>
            </div>
          </div>
        }
      >
        <div
          className={cssModule.newMc}
          onClick={() => {
            window.open(customizedMcUrl);
          }}
        >
          {localizedContent.goToNewMc}
        </div>
      </Dropdown>
    );
  }

  function renderHeaderRightComponent() {
    return (
      <div className={cssModule.headerRight}>
        {!!managementConsoleUrl && (
          <div
            className={cssModule.oldMc}
            onClick={() => {
              window.open(managementConsoleUrl);
            }}
          >
            {localizedContent.goToOldMc}
          </div>
        )}
        {!!customizedMcUrl && renderNewMc()}
        <CloseOutlined
          className={cssModule.closeIcon}
          onClick={() => onManagementConsoleConfigVisibleChange(false)}
        />
      </div>
    );
  }

  return (
    <Modal
      centered
      destroyOnClose
      visible={managementConsoleConfigVisible}
      footer={null}
      width={containerWidth}
      closeIcon={renderHeaderRightComponent()}
      className={cssModule.modal}
    >
      <Row className={cssModule.topBar}>
        <div className={cssModule.title}>{localizedContent.title}</div>
      </Row>
      <Tabs
        tabPosition="top"
        defaultActiveKey={localizedContent.dataModel}
        className={cssModule.managementConsoleView}
        tabBarStyle={styles.tabBarStyle}
      >
        <Tabs.TabPane
          style={{ height: containerHeight }}
          tab={localizedContent.dataModel}
          key={localizedContent.dataModel}
        >
          <ZManagementConsoleDataModel />
        </Tabs.TabPane>
        <Tabs.TabPane
          style={{ height: containerHeight }}
          tab={localizedContent.tabs}
          key={localizedContent.tabs}
        >
          <ZManagementConsoleTabs />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tabBarStyle: {
    backgroundColor: '#303233',
    paddingBottom: '10px',
  },
};
