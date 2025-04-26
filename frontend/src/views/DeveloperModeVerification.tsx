/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import Modal from 'react-modal';
import { useApolloClient } from '@apollo/client';
import { useObserver } from 'mobx-react';
import useLocale from '../hooks/useLocale';
import i18n from './DeveloperModeVerification.i18n.json';
import { ZThemedBorderRadius } from '../utils/ZConst';
import { verifyDeveloperPassword } from '../graphQL/developerModeVerification';
import useStores from '../hooks/useStores';
import { Row, Input, Form, Button } from '../zui';

export default function DeveloperModeVerification(): ReactElement {
  const { localizedContent } = useLocale(i18n);
  const [modalInput, setModalInput] = useState('');
  const client = useApolloClient();
  const { persistedStore, editorStore } = useStores();
  const isVisible = useObserver(() => editorStore.devPasswordEntryVisibility);

  const verifySuccess = () => {
    persistedStore.switchDeveloperMode();
    if (isVisible) {
      editorStore.switchDevPasswordEntryVisibility();
    }
  };

  const renderVerificationModal = () => (
    <Modal
      isOpen={isVisible}
      style={{ content: styles.modalStylesContent, overlay: styles.modalStylesOverlay }}
      onRequestClose={() => {
        editorStore.switchDevPasswordEntryVisibility();
      }}
    >
      <h3 style={{ marginBottom: '30px' }}>{localizedContent.title}</h3>

      <Form>
        <Form.Item>
          <Input
            placeholder={localizedContent.placeholder}
            onChange={({ target: { value } }) => setModalInput(value)}
            style={styles.modalInput}
            type="password"
          />
        </Form.Item>
        <Form.Item>
          <Row justify="end" align="middle">
            <Button
              style={{ ...styles.modalButton, ...styles.modalCancelButton }}
              onClick={() => {
                editorStore.switchDevPasswordEntryVisibility();
              }}
            >
              {localizedContent.cancel}
            </Button>
            <Button
              htmlType="submit"
              style={{
                ...styles.modalButton,
                ...(modalInput ? styles.modalCreateButton : styles.disabledModalCreateButton),
              }}
              onClick={() => verifyDeveloperPassword(client, modalInput, () => verifySuccess())}
            >
              {localizedContent.submit}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );

  return <>{renderVerificationModal()}</>;
}

const styles: Record<string, React.CSSProperties> = {
  modalStylesContent: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderWidth: 0,
    borderRadius: ZThemedBorderRadius.LARGE,
  },
  modalStylesOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalInput: {
    color: '#000',
    marginBottom: '20px',
    width: '400px',
    height: '38px',
  },
  modalButton: {
    marginRight: '10px',
    minWidth: '80px',
    height: '40px',
    borderWidth: 0,
    borderRadius: '20px',
    cursor: 'pointer',
  },
  modalCancelButton: {
    background: '#eee',
  },
  modalCreateButton: {
    color: '#fff',
    background: '#297',
  },
  disabledModalCreateButton: {
    color: '#fff',
    background: 'lightgrey',
    cursor: 'not-allowed',
  },
};
