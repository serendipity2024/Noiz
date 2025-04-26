/* eslint-disable import/no-default-export */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
import { useApolloClient } from '@apollo/client';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  GQL_CREATE_SCHEMA_DIFF,
  GQL_REPORT_DIFF_ERROR,
  GQL_SCHEMA_DIFFS,
} from '../graphQL/collaboration';
import { SchemaDiffFragment } from '../graphQL/__generated__/SchemaDiffFragment';
import useLocale from '../hooks/useLocale';
import useLogger from '../hooks/useLogger';
import useStores from '../hooks/useStores';
import { useValidationDataDependency } from '../hooks/useValidationDataDependency';
import StoreRehydrate from '../mobx/StoreRehydrate';
import { CollaborationState, DiffQueueState } from '../mobx/stores/DiffStore';
import { ArrayDiffItem, DiffItem } from '../shared/type-definition/Diff';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import DiffHelper from '../utils/DiffHelper';
import { ZColors, ZThemedColors } from '../utils/ZConst';
import i18n from './ZCollaborationView.i18n.json';
import { Button, Col, Row } from '../zui';

export default observer(function ZCollaborationView(): NullableReactElement {
  const { localizedContent } = useLocale(i18n);
  const client = useApolloClient();
  const logger = useLogger();
  const { validateDiff } = useValidationDataDependency();
  const { diffStore, projectStore, coreStore, editorStore } = useStores();
  const history = useHistory();

  useEffect(() => {
    async function uploadDiffs() {
      if (diffStore.diffQueueUploadState === DiffQueueState.BEGINNING) {
        diffStore.diffQueueUploadState = DiffQueueState.IN_PROGRESS;
        while (diffStore.diffsPendingUpload.length > 0) {
          if (diffStore.collaborationState !== CollaborationState.NORMAL) {
            return;
          }
          const diff = diffStore.diffsPendingUpload[0];
          try {
            await client.mutate({
              mutation: GQL_CREATE_SCHEMA_DIFF,
              variables: {
                schemaExId: projectStore.projectDetails?.schemaExId,
                uuid: diff.id,
                content: diff,
                zedVersion: coreStore.zedVersion,
              },
            });
          } catch (error) {
            diffStore.collaborationState = CollaborationState.CREATE_SCHEMA_DIFF_ERROR;
            logger.error('failed-to-create-schema-diff', { error: JSON.stringify(error) });
            return;
          }
          if (diffStore.diffsPendingUpload.length > 0) {
            diffStore.diffsPendingUpload.splice(0, 1);
          }
        }
        diffStore.diffQueueUploadState = DiffQueueState.WAITING;
      }
    }

    uploadDiffs();
  }, [client, coreStore.zedVersion, diffStore.diffQueueUploadState, diffStore.collaborationState, diffStore.diffsPendingUpload, projectStore.projectDetails, logger]);

  useEffect(() => {
    const applySchemaDiffs = (
      schemaDiffs: SchemaDiffFragment[]
    ): { successful: boolean; schemaDiff?: SchemaDiffFragment } => {
      const currentSchemaDiffs = schemaDiffs.filter(
        (diff) => !diffStore.existsInLocalDiffs(diff.uuid)
      );
      for (let index = 0; index < currentSchemaDiffs.length; index++) {
        const element: SchemaDiffFragment = currentSchemaDiffs[index];
        element.content.dataSource = element.content.dataSource.map(
          (diffItem: DiffItem | ArrayDiffItem) => {
            diffItem.oldValue = StoreRehydrate.rehydrateNetworkData(diffItem.oldValue);
            diffItem.newValue = StoreRehydrate.rehydrateNetworkData(diffItem.newValue);
            return diffItem;
          }
        );
        const result = DiffHelper.apply(element, validateDiff);
        if (result.successful) {
          diffStore.lastNetworkDiffSeq = element.seq;
        } else {
          logger.error('failed-to-apply-schemaDiff', {
            projectName: projectStore.projectDetails?.projectName,
            uuid: element.uuid,
            seq: element.seq,
            ...result.errorContent,
          });
          return { successful: false, schemaDiff: element };
        }
      }
      return { successful: true };
    };

    const fetchApplySchemaDiffsResult = async (
      schemaDiffs: SchemaDiffFragment[]
    ): Promise<boolean> => {
      const applyResult = applySchemaDiffs(schemaDiffs);
      if (!applyResult.successful) {
        diffStore.collaborationState = CollaborationState.DIFF_APPLICATION_ERROR;
        if (!projectStore.projectDetails?.schemaExId || !applyResult.schemaDiff?.uuid) {
          throw new Error(
            `schemaExId or schemaDiff error, projectDetails: ${projectStore.projectDetails}, schemaDiff: ${applyResult.schemaDiff}`
          );
        }
        try {
          await client.mutate({
            mutation: GQL_REPORT_DIFF_ERROR,
            variables: {
              schemaExId: projectStore.projectDetails.schemaExId,
              uuid: applyResult.schemaDiff.uuid,
            },
          });
          logger.info('reportDiffError', {
            projectName: projectStore.projectDetails?.projectName,
            uuid: applyResult.schemaDiff.uuid,
            content: applyResult.schemaDiff,
          });
        } catch (error) {
          console.log(`GQL_REPORT_DIFF_ERROR， ${error}`);
        }
      }
      return applyResult.successful;
    };

    async function applyNetworkDiffs() {
      if (diffStore.networkDiffApplicationQueueState === DiffQueueState.BEGINNING) {
        diffStore.networkDiffApplicationQueueState = DiffQueueState.IN_PROGRESS;
        while (diffStore.networkDiffsPendingApplication.length > 0) {
          if (diffStore.collaborationState !== CollaborationState.NORMAL) {
            return;
          }
          const schemaDiff: SchemaDiffFragment = diffStore.networkDiffsPendingApplication[0];
          const startSeq = (diffStore.lastNetworkDiffSeq ?? -1) + 1;
          const endSeq = schemaDiff.seq;
          if (endSeq > startSeq) {
            try {
              const queryResult = await client.query({
                query: GQL_SCHEMA_DIFFS,
                variables: {
                  schemaExId: projectStore.projectDetails?.schemaExId,
                  startSeq,
                  endSeq,
                  shouldExcludeSameSessionDiffs: startSeq !== 0,
                },
              });
              if (
                queryResult.data.schemaDiffs &&
                !fetchApplySchemaDiffsResult(queryResult.data.schemaDiffs)
              ) {
                break;
              }
            } catch (error) {
              break;
            }
          } else if (!fetchApplySchemaDiffsResult([schemaDiff])) {
            break;
          }
          if (diffStore.networkDiffsPendingApplication.length > 0) {
            diffStore.networkDiffsPendingApplication.splice(0, 1);
          }
        }
        diffStore.networkDiffApplicationQueueState = DiffQueueState.WAITING;
      }
    }

    applyNetworkDiffs();
  }, [client, diffStore, diffStore.networkDiffApplicationQueueState, diffStore.networkDiffsPendingApplication, diffStore.collaborationState, diffStore.lastNetworkDiffSeq, projectStore.projectDetails, validateDiff, logger]);

  const getCollaborationSchemaModalContent = () => {
    switch (diffStore.collaborationState) {
      case CollaborationState.DIFF_APPLICATION_ERROR: {
        return localizedContent.applyError;
      }
      case CollaborationState.SCHEMA_SAVED: {
        return localizedContent.schemaSaved;
      }
      case CollaborationState.PROJECT_RESET: {
        return localizedContent.projectReset;
      }
      case CollaborationState.CREATE_SCHEMA_DIFF_ERROR: {
        return localizedContent.createSchemaDiffError;
      }
      case CollaborationState.PROJECT_DELETED: {
        return localizedContent.projectDeleted;
      }
      default:
        return '';
    }
  };

  if (diffStore.collaborationState !== CollaborationState.NORMAL) {
    editorStore.saveEditorDataToLocalStorage();
  }

  return (
    <Modal
      title={localizedContent.exception}
      centered
      closable={false}
      maskClosable={false}
      footer={
        <Row justify="end">
          <Col>
            {diffStore.collaborationState === CollaborationState.PROJECT_DELETED ? (
              <>
                <Button type="text" onClick={() => history.push('/projects')} style={styles.button}>
                  {localizedContent.synchronize}
                </Button>
              </>
            ) : (
              <>
                <Button type="text" onClick={() => window.location.reload()} style={styles.button}>
                  {diffStore.collaborationState === CollaborationState.SCHEMA_SAVED
                    ? localizedContent.synchronize
                    : localizedContent.repair}
                </Button>
              </>
            )}
          </Col>
        </Row>
      }
      visible={diffStore.collaborationState !== CollaborationState.NORMAL}
      width="800px"
    >
      <div>{getCollaborationSchemaModalContent()}</div>
    </Modal>
  );
});

const styles: Record<string, React.CSSProperties> = {
  button: {
    backgroundColor: ZThemedColors.ACCENT,
    color: ZColors.WHITE,
    borderRadius: '5px',
  },
};
