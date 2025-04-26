/* eslint-disable import/no-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import React, { CSSProperties, useState } from 'react';
import { useHistory } from 'react-router';
import useLocale from '../hooks/useLocale';
import useProjectDetails from '../hooks/useProjectDetails';
import useStores from '../hooks/useStores';
import Profile from '../shared/assets/icons/profile-normal.svg';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import { ZThemedColors } from '../utils/ZConst';
import { ZAppGlobalSetting } from './editor/ZAppGlobalSetting';
import { ZCodegenDryRun } from './editor/ZCodegenDryRun';
import ZHoverableIcon from './editor/ZHoverableIcon';
import ZSearchComponent from './editor/ZSearchComponent';
import { ZShareProject } from './editor/ZShareProject';
import ZViewportSettings from './editor/ZViewportSettings';
import i18n from './ZProjectActionBar.i18n.json';
import { Dropdown, Modal, ZInput, ZMenu } from '../zui';
import { FeatureType } from '../graphQL/__generated__/globalTypes';
import cssModule from './ZProjectActionBar.module.scss';
import ExclamationSvg from '../shared/assets/icons/exclamation_yellow.svg';
import useUserFlowTrigger, { UserFlow } from '../hooks/useUserFlowTrigger';

interface ZProjectActionBarProps {
  deleteEnabled?: boolean;
}

export default function ZProjectActionBar(props: ZProjectActionBarProps): NullableReactElement {
  const { featureStore } = useStores();
  return (
    <div style={styles.container}>
      <ZShareProject />
      <ZAppGlobalSetting />
      <ZSearchComponent />
      <ZCodegenDryRun />
      {featureStore.isFeatureAccessible(FeatureType.SHOW_DEVICE_SELECTOR) && <ZViewportSettings />}
      <ZAccountDropdown deleteEnabled={props.deleteEnabled} />
    </div>
  );
}

interface ZAccountDropdownProps {
  style?: CSSProperties;
}

export function ZAccountDropdown(
  props: ZProjectActionBarProps & ZAccountDropdownProps
): NullableReactElement {
  const uft = useUserFlowTrigger();
  const { localizedContent: content } = useLocale(i18n);
  const { authStore } = useStores();
  const { projectName } = useProjectDetails();
  const [input, setInput] = useState<string>('');
  const history = useHistory();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const username = authStore.user?.username;

  if (!authStore.user) return null;

  const renderDeleteModal = () => {
    return (
      <Modal
        className={cssModule.modalContainer}
        closable={false}
        visible={deleteModalVisible}
        width={400}
        centered
        onCancel={() => {
          setDeleteModalVisible(false);
          setInput('');
        }}
        destroyOnClose
        maskClosable
        cancelText={content.option.cancel}
        cancelButtonProps={{ className: cssModule.cancelButton }}
        okText={content.option.ok}
        okButtonProps={{
          className: cssModule.submitButton,
          disabled: input !== `${username}/${projectName}`,
        }}
        onOk={uft(UserFlow.DELETE_PROJECT)}
      >
        <div className={cssModule.titleContainer}>
          <img alt="" src={ExclamationSvg} />
          {content.notification.delete}
        </div>

        <ZInput
          className={cssModule.inputContainer}
          placeholder={content.label.deletePrompt}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <span className={cssModule.sampleTextBelowInput}>{`${username}/${projectName}`}</span>
      </Modal>
    );
  };

  const renderUserDropdownMenu = () => {
    const deleteItemData = {
      icon: <DeleteOutlined style={styles.menuItem} />,
      title: content.label.delete,
      action: () => {
        setDeleteModalVisible(true);
      },
    };
    const logoutItemData = {
      icon: <LogoutOutlined style={styles.menuItem} />,
      title: content.label.logout,
      action: () =>
        Modal.confirm({
          content: <p style={{ color: '#fff' }}>{content.notification.logout}</p>,
          okText: content.option.ok,
          cancelText: content.option.cancel,
          maskClosable: true,
          onOk: () => authStore.logout(),
        }),
    };
    const resetPasswordItemData = {
      icon: <EditOutlined style={styles.menuItem} />,
      title: content.label.resetPassword,
      action: () => {
        history.push('/resetPassword');
      },
    };
    const menuData = props.deleteEnabled
      ? [deleteItemData, resetPasswordItemData, logoutItemData]
      : [resetPasswordItemData, logoutItemData];

    return (
      <ZMenu
        items={menuData.map((data, index) => ({
          key: index.toString(),
          onClick: data.action,
          headerComponent: (
            <>
              {data.icon}
              {data.title}
            </>
          ),
        }))}
      />
    );
  };

  return (
    <>
      <Dropdown overlay={renderUserDropdownMenu()} placement="bottomRight">
        <div style={{ ...styles.userButton, ...props.style }}>
          <ZHoverableIcon
            key="profile"
            isSelected={false}
            src={Profile}
            containerStyle={styles.iconProfile}
          />
          <span style={styles.profileText}>{authStore.user.username}</span>
        </div>
      </Dropdown>
      {renderDeleteModal()}
    </>
  );
}

const HEIGHT = '28px';
const FONT_SIZE = '20px';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    top: '35px',
    right: '35px',
    height: HEIGHT,
  },
  iconProfile: {
    width: 32,
    height: 32,
    cursor: 'default',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderWidth: 0,
    fontSize: FONT_SIZE,
    color: ZThemedColors.ACCENT,
  },
  profileText: {
    fontSize: '18px',
  },
  menuItem: {
    fontSize: '14px',
    color: ZThemedColors.ACCENT,
  },
  deletePrompt: {
    display: 'grid',
  },
};
