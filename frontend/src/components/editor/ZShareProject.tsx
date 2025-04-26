/* eslint-disable jsx-a11y/alt-text */
import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { GQL_GENERATE_SHARE_TOKEN } from '../../graphQL/shareProject';
import { CollaboratorType } from '../../graphQL/__generated__/globalTypes';
import {
  GenerateShareToken,
  GenerateShareTokenVariables,
} from '../../graphQL/__generated__/GenerateShareToken';
import useLocale from '../../hooks/useLocale';
import useProjectDetails from '../../hooks/useProjectDetails';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius } from '../../utils/ZConst';
import i18n from './ZShareProject.i18n.json';
import './ZShareProject.scss';
import useNotificationDisplay from '../../hooks/useNotificationDisplay';
import useLogger from '../../hooks/useLogger';
import ConfigButton from '../side-drawer-tabs/left-drawer/shared/ConfigButton';
import { Button, Modal, ZInput } from '../../zui';
import useStores from '../../hooks/useStores';
import { ZEditProjectCollaborators } from './ZEditProjectCollaborators';

export function ZShareProject(): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { projectName, projectExId } = useProjectDetails();
  const { projectStore } = useStores();
  const client = useApolloClient();
  const logger = useLogger();
  const displayNotification = useNotificationDisplay();
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  const [sharingUrl, setSharingUrl] = useState<string>('');

  const url = window.location.href;

  const generateShareToken = async () => {
    try {
      const shareToken = await client.query<GenerateShareToken, GenerateShareTokenVariables>({
        query: GQL_GENERATE_SHARE_TOKEN,
        variables: {
          projectExId,
          collaboratorType: CollaboratorType.EDITOR,
        },
      });
      const code = shareToken.data?.generateShareToken?.code;
      setSharingUrl(code ? `${url}?code=${code}` : url);
    } catch (error) {
      displayNotification('GENERATE_SHARE_TOKEN_FAILURE');
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(error));
    }
  };

  const handleCopyUrl = () => {
    displayNotification('SHARING_LINK_COPIED');
    logger.info('sharing-link-copied');
  };

  return (
    <div>
      <div style={styles.container}>
        <ConfigButton
          style={styles.shareButton}
          zedType="primary"
          disabled={!projectStore.verifyUserCollaboratorType(CollaboratorType.OWNER)}
          onClick={() => {
            generateShareToken();
            setModelVisible(!modelVisible);
          }}
        >
          {content.label.share}
        </ConfigButton>
      </div>
      <Modal
        title={`Project Name: ${projectName}`}
        centered
        destroyOnClose
        visible={modelVisible}
        footer={null}
        onCancel={() => setModelVisible(false)}
        width="auto"
      >
        <div style={styles.modalContainer}>
          <ZInput
            className="shareProjectInput"
            readOnly
            value={sharingUrl}
            bordered
            inputSize="large"
          />
          <CopyToClipboard text={sharingUrl} onCopy={handleCopyUrl}>
            <Button type="primary" style={styles.button}>
              {content.label.copyLink}
            </Button>
          </CopyToClipboard>
        </div>
        <ZEditProjectCollaborators />
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    marginRight: 10,
  },
  shareButton: {
    width: '100px',
    borderRadius: '6px',
    fontSize: '14px',
    color: ZColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: '48px',
    width: '126px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    marginLeft: '24px',
    border: '1px solid #FFA423',
    backgroundColor: 'transparent',
    color: '#FFA423',
  },
  dropDown: {
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  selectOption: {
    fontSize: '18px',
    fontFamily: 'PingFang SC',
    fontStyle: 'normal',
    height: '42px',
  },
};
