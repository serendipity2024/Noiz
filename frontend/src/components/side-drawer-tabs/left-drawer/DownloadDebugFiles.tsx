/* eslint-disable import/no-default-export */
import { useApolloClient } from '@apollo/client';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Modal from 'react-modal';
import useLocale from '../../../hooks/useLocale';
import useProjectDetails from '../../../hooks/useProjectDetails';
import useStores from '../../../hooks/useStores';
import StoreHelpers from '../../../mobx/StoreHelpers';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius } from '../../../utils/ZConst';
import i18n from './DownloadDebugFiles.i18n.json';
import GQL_GET_PROJECT_SCHEMA_BY_EX_ID from '../../../graphQL/getProjectSchemaByExId';
import { GetProjectSchemaByExId } from '../../../graphQL/__generated__/GetProjectSchemaByExId';
import { Button, Select, Row } from '../../../zui';

const liveVersionId = 'LIVE_VERSION';

function DownloadDebugFiles(): NullableReactElement {
  const [selectedVersionId, setSelectedVersionId] = useState(liveVersionId);
  const { localizedContent } = useLocale(i18n);
  const { editorStore, coreStore } = useStores();
  const { debugScriptUrl, schemaHistory, projectExId } = useProjectDetails();
  const client = useApolloClient();

  if (!editorStore.downloadWindowVisibility || !schemaHistory) return null;

  const handleDownloadJson = async () => {
    if (selectedVersionId === liveVersionId) {
      StoreHelpers.generateAllComponentLayoutData();
      coreStore.exportCore();
    } else {
      const { data } = await client.query<GetProjectSchemaByExId>({
        query: GQL_GET_PROJECT_SCHEMA_BY_EX_ID,
        variables: {
          projectExId,
          schemaExId: selectedVersionId,
        },
      });
      const appSchema = data?.project?.projectSchema?.appSchema;
      if (appSchema) {
        coreStore.exportAppSchema(appSchema, selectedVersionId);
      }
    }
    editorStore.switchDownloadWindowVisibility();
  };

  const handleDownloadScript = () => {
    window.open(debugScriptUrl);
    editorStore.switchDownloadWindowVisibility();
  };

  return (
    <Modal
      isOpen
      style={{ content: styles.modalStylesContent, overlay: styles.modalStylesOverlay }}
      ariaHideApp={false}
      onRequestClose={() => {
        editorStore.switchDownloadWindowVisibility();
      }}
    >
      <h3 style={styles.modalTitle}>{localizedContent.title}</h3>

      <Row>
        <Select
          size="large"
          style={styles.select}
          value={selectedVersionId}
          onChange={setSelectedVersionId}
        >
          <Select.Option value={liveVersionId}>Current</Select.Option>

          {schemaHistory.map(({ exId, createdAt }) => (
            <Select.Option key={exId} value={exId}>
              Saved at {createdAt}
            </Select.Option>
          ))}
        </Select>
      </Row>

      <Row justify="center">
        <Button
          style={{ ...styles.modalButton, ...styles.modalDownloadButton }}
          onClick={handleDownloadJson}
        >
          {localizedContent.json}
        </Button>
        {selectedVersionId === liveVersionId && (
          <Button
            style={{ ...styles.modalButton, ...styles.modalDownloadButton }}
            onClick={handleDownloadScript}
          >
            {localizedContent.debugScript}
          </Button>
        )}
        <Button
          style={{ ...styles.modalButton, ...styles.modalCancelButton }}
          onClick={() => {
            editorStore.switchDownloadWindowVisibility();
          }}
        >
          {localizedContent.cancel}
        </Button>
      </Row>
    </Modal>
  );
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
  modalButton: {
    marginLeft: '10px',
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
  modalDownloadButton: {
    color: '#fff',
    background: '#297',
  },
  modalTitle: {
    marginBottom: '40px',
    marginTop: '20px',
    marginLeft: '10px',
    marginRight: '10px',
  },
  select: {
    width: '100%',
    marginBottom: '40px',
    fontSize: '10px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZColors.WHITE_LIKE_GREY,
    textAlign: 'center',
  },
};

export default observer(DownloadDebugFiles);
