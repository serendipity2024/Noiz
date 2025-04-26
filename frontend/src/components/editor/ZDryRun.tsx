import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { Modal, Row, Table } from 'antd';
import { Player } from '@lottiefiles/react-lottie-player';
import useStores from '../../hooks/useStores';
import i18n from './ZDryRun.i18n.json';
import useLocale from '../../hooks/useLocale';
import Cross from '../../shared/assets/icons/cross.svg';
import StyleModule from './ZDryRun.module.scss';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import EllipseRightArrow from '../../shared/assets/icons/arrow-right-ellipse.svg';
import animationData from '../../shared/assets/lottie/dry-run-loading.json';
import StoreHelpers from '../../mobx/StoreHelpers';
import { Button } from '../../zui';

interface Props {
  runPackaging?: () => void;
  onClose: () => void;
}

export const ZDryRun = observer((props: Props): ReactElement => {
  const { onClose, runPackaging } = props;
  const { localizedContent } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const { dryRunStore } = useStores();

  const renderTable = (mRef: string) => {
    if (!mRef) {
      return <div />;
    }
    const target = StoreHelpers.findComponentModelOrThrow(mRef);
    return (
      <div
        className={StyleModule.target}
        onClick={(e) => {
          e.stopPropagation();
          let focusTarget: BaseComponentModel | undefined = target;
          while (focusTarget && !focusTarget.hasFocusMode()) {
            const parentModel = StoreHelpers.findParentOrThrow(focusTarget);
            focusTarget = parentModel;
          }
          if (!focusTarget) return;
          uft(UserFlow.FOCUS_TARGET)(focusTarget.mRef);
          uft(UserFlow.SELECT_TARGET)(target.mRef);
        }}
      >
        <span>
          {target.componentName}{' '}
          <img alt="" className={StyleModule.ellipseContainer} src={EllipseRightArrow} />
        </span>
      </div>
    );
  };

  const fatalErrorTableColumns = [
    {
      title: localizedContent.label.errorMessage,
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: localizedContent.label.target,
      dataIndex: 'mRef',
      key: 'mRef',
      render: renderTable,
    },
  ];

  const warningErrorTableColumns = [
    {
      title: localizedContent.label.warningMessage,
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: localizedContent.label.target,
      dataIndex: 'mRef',
      key: 'mRef',
      render: renderTable,
    },
  ];

  return (
    <>
      {dryRunStore.isRunning && (
        <div className={StyleModule.loadingContainer}>
          <Player
            style={{
              width: '25%',
              minWidth: '250px',
            }}
            loop
            autoplay
            speed={1.6}
            src={JSON.stringify(animationData)}
          />
        </div>
      )}
      <Modal
        centered
        title={
          <Row justify="space-between" align="middle">
            <span className={StyleModule.warningTitle}>
              {localizedContent.label.projectCheckError}
            </span>
            <Row align="middle">
              {runPackaging && dryRunStore.validationErrors.length === 0 && (
                <Button
                  className={StyleModule.continueButton}
                  onClick={() => {
                    onClose();
                    runPackaging();
                  }}
                >
                  {localizedContent.label.continue}
                </Button>
              )}
              <div className={StyleModule.crossContainer} onClick={onClose}>
                <img alt="" className={StyleModule.crossIcon} src={Cross} />
              </div>
            </Row>
          </Row>
        }
        closable={false}
        destroyOnClose
        footer={null}
        visible={!dryRunStore.isRunning}
        onCancel={onClose}
        width="800px"
        className={StyleModule.codegenDryRun}
      >
        {dryRunStore.validationErrors.length > 0 && (
          <div className={StyleModule.errorContainer}>
            <Row align="middle">
              <span className={StyleModule.errorTitle}>{localizedContent.label.error}</span>
            </Row>
            <Row className={StyleModule.errorSubContainer}>
              <Table
                columns={fatalErrorTableColumns}
                dataSource={dryRunStore.validationErrors.map((error) => ({
                  key: error.message + error.mRef,
                  message: error.message,
                  mRef: error.mRef,
                }))}
                style={{ width: '100%' }}
                pagination={false}
              />
            </Row>
          </div>
        )}
        <div style={{ paddingTop: 10 }} />
        {dryRunStore.validationWarnings.length > 0 && (
          <div className={StyleModule.errorContainer}>
            <Row align="middle">
              <span className={StyleModule.errorTitle}>{localizedContent.label.warning}</span>
            </Row>
            <Row className={StyleModule.errorSubContainer}>
              <Table
                columns={warningErrorTableColumns}
                dataSource={dryRunStore.validationWarnings.map((error) => ({
                  key: error.message + error.mRef,
                  message: error.message,
                  mRef: error.mRef,
                }))}
                style={{ width: '100%' }}
                pagination={false}
              />
            </Row>
          </div>
        )}
      </Modal>
    </>
  );
});
