/* eslint-disable import/no-default-export */
import { useQuery, useApolloClient } from '@apollo/client';
import React, { CSSProperties, useState } from 'react';
import Ansi from 'ansi-to-react';
import { useObserver } from 'mobx-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID, {
  updateProjectAuditStatus,
} from '../../../graphQL/fetchProjectAuditStatusByExId';
import GQL_FETCH_PROJECT_STATUS_BY_EX_ID from '../../../graphQL/fetchProjectStatusByExId';
import {
  FetchProjectAuditStatusByExId,
  FetchProjectAuditStatusByExIdVariables,
} from '../../../graphQL/__generated__/FetchProjectAuditStatusByExId';
import {
  FetchProjectStatusByExId,
  FetchProjectStatusByExIdVariables,
} from '../../../graphQL/__generated__/FetchProjectStatusByExId';
import {
  FetchErrorLogByExId,
  FetchErrorLogByExIdVariables,
} from '../../../graphQL/__generated__/FetchErrorLogByExId';
import { ProjectConfigFragment_wechatAppConfig } from '../../../graphQL/__generated__/ProjectConfigFragment';
import useLocale from '../../../hooks/useLocale';
import useProjectDeploymentStatus from '../../../hooks/useProjectDeploymentStatus';
import useProjectDetails from '../../../hooks/useProjectDetails';
import useUserFlowTrigger, { UserFlow } from '../../../hooks/useUserFlowTrigger';
import { Col, Row, Modal, Collapse } from '../../../zui';
import spin from '../../../shared/assets/editor/spin.svg';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import ZSpinningComponent from '../../base/ZSpinningComponent';
import i18n from './PublishProgressTab.i18n.json';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import PublishProgressBar from './PublishProgressBar';
import SharedStyles from './project-config/SharedStyles';
import ConfigButton from './shared/ConfigButton';
import { processReceivedProjectStatusData } from '../../../hooks/useSubscriptionForProjectStatus';
import { getPreAuthPageUrl } from '../../../graphQL/getPreAuthPageUrl';
import GQL_FETCH_ERROR_LOG_BY_EX_ID from '../../../graphQL/fetchErrorLog';
import { filterNotNullOrUndefined } from '../../../utils/utils';
import useStores from '../../../hooks/useStores';
import { ZedSupportedPlatform } from '../../../models/interfaces/ComponentModel';
import { DeploymentStatus } from '../../../graphQL/__generated__/globalTypes';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import { ZDryRun } from '../../editor/ZDryRun';

export enum ProjectProgressStep {
  PENDING = 'pending',
  GENERATING = 'generating',
  PACKAGING = 'packaging',
  READY = 'ready',
  FAILED = 'failed',
}

enum StageState {
  PENDING,
  RUNNING,
  COMPLETE,
}

interface StepData {
  step: ProjectProgressStep;
  state: StageState;
}

function genPreviewResult(platform: ZedSupportedPlatform, result: any): NullableReactElement {
  switch (platform) {
    case ZedSupportedPlatform.WECHAT:
      return <div style={styles.qrCodeContainer}>{result}</div>;
    case ZedSupportedPlatform.MOBILE_WEB:
      return (
        <div style={styles.mobileWebUrlContainer}>
          <a href={result}>{result}</a>
        </div>
      );
    default:
      return null;
  }
}

export default function PublishProgressTab(): NullableReactElement {
  const uft = useUserFlowTrigger();
  const client = useApolloClient();
  const { localizedContent: content } = useLocale(i18n);
  const deploymentStatus = useProjectDeploymentStatus();
  const { projectExId, projectConfig, mobileWebUrl } = useProjectDetails();
  const hasWechatBinding = projectConfig?.wechatAppConfig ?? {};
  const { progressStep: currentStep, isUploading, extraData } = deploymentStatus ?? {};
  const { coreStore, editorStore, dryRunStore } = useStores();
  const [validationResultsVisible, setValidationResultsVisible] = useState(false);
  const [remindWechat, setRemindWechat] = useState(false);
  const displayNotification = useNotificationDisplay();

  const wechatEnabled = useObserver(
    () => !!coreStore.appConfiguration.buildTarget.find((target) => target === 'WECHAT_MINIPROGRAM')
  );
  const mobileWebEnabled = useObserver(
    () => !!coreStore.appConfiguration.buildTarget.find((target) => target === 'MOBILE_WEB')
  );

  const dryRunSuccessful = useObserver(() => dryRunStore.isCleanCompile);

  useQuery<FetchProjectStatusByExId, FetchProjectStatusByExIdVariables>(
    GQL_FETCH_PROJECT_STATUS_BY_EX_ID,
    {
      variables: { projectExId },
      skip: !projectExId,
      onCompleted: ({ project }) => {
        if (project) processReceivedProjectStatusData(project, currentStep);
      },
    }
  );

  useQuery<FetchProjectAuditStatusByExId, FetchProjectAuditStatusByExIdVariables>(
    GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID,
    {
      variables: { projectExId },
      skip: !projectExId,
      onCompleted: (data) => {
        const { latestAuditStatus } = data;
        updateProjectAuditStatus(latestAuditStatus);
      },
    }
  );

  let statusesToMonitor: DeploymentStatus[];
  switch (editorStore.editorPlatform) {
    case ZedSupportedPlatform.WECHAT:
      statusesToMonitor = [DeploymentStatus.BUILD_WECHAT, DeploymentStatus.GEN_WECHAT];
      break;
    case ZedSupportedPlatform.MOBILE_WEB:
      statusesToMonitor = [DeploymentStatus.BUILD_MOBILE_WEB, DeploymentStatus.GEN_MOBILE_WEB];
      break;
    default:
      statusesToMonitor = [];
      break;
  }
  const { data: errorlog } = useQuery<FetchErrorLogByExId, FetchErrorLogByExIdVariables>(
    GQL_FETCH_ERROR_LOG_BY_EX_ID,
    {
      variables: {
        projectExId,
        status: statusesToMonitor,
      },
      skip: currentStep !== ProjectProgressStep.FAILED,
    }
  );

  const translateProgressStep = (step: ProjectProgressStep) => {
    switch (step) {
      case ProjectProgressStep.PENDING:
        return content.steps.pending;
      case ProjectProgressStep.GENERATING:
        return content.steps.generating;
      case ProjectProgressStep.PACKAGING:
        return content.steps.packaging;
      case ProjectProgressStep.READY:
        return content.steps.ready;
      default:
        return content.steps.unknown;
    }
  };

  const renderSpin = () => (
    <ZSpinningComponent style={styles.spinSize} speed={1.2}>
      <img alt="" style={styles.spinSize} src={spin} />
    </ZSpinningComponent>
  );

  const handleCopyErrorMsg = () => {
    displayNotification('COPIED_TO_CLIPBOARD');
  };

  const renderResult = () => {
    let result;
    let subtitle;
    if (!currentStep) {
      subtitle = (
        <span style={{ ...styles.subtitleText, ...styles.pendingStyle }}>
          {content.subtitle.default}
        </span>
      );
    } else if (currentStep === ProjectProgressStep.READY) {
      switch (editorStore.editorPlatform) {
        case ZedSupportedPlatform.WECHAT:
          subtitle = <span style={styles.subtitleText}>{content.subtitle.wechatSuccess}</span>;
          if (
            (hasWechatBinding as ProjectConfigFragment_wechatAppConfig)
              .hasGrantedThirdPartyAuthorization
          ) {
            const base64 = extraData?.wechatMiniAppQRCodeBase64;
            result = base64 ? (
              <img alt="" src={`data:image/jpeg;base64,${base64}`} style={styles.qrCodeImage} />
            ) : null;
          } else {
            const qrLink = extraData?.wechatMiniAppQRCodeLink;
            result = qrLink ? <img alt="" src={qrLink} style={styles.qrCodeImage} /> : null;
          }
          break;
        case ZedSupportedPlatform.MOBILE_WEB:
          subtitle = <span style={styles.subtitleText}>{content.subtitle.webSuccess}</span>;
          result = mobileWebUrl;
          break;
        default:
          break;
      }
    } else if (currentStep !== ProjectProgressStep.FAILED) {
      // loading states
      result = renderSpin();
      subtitle = <span style={styles.subtitleText}>{content.subtitle.progressing}</span>;
    } else {
      // error states

      // TODO(geoff): The logic below is wrong, I think? We should be doing a
      // groupBy first on status and then put individual messages into collapse
      // components. In any case, I don't have test data to try, if someone runs
      // into this, we could fix later. For now I'm only migrating the collapse
      // component.
      const errorLogsCollapseItems = errorlog?.deploymentOutputLog?.map(
        (log) =>
          log?.status && {
            title: log.status,
            content: <Ansi>{log?.log ?? ''}</Ansi>,
          }
      );
      subtitle = (
        <ConfigButton
          type="text"
          zedType="outline"
          onClick={() => {
            Modal.error({
              title: (
                <div style={styles.titleCopyContainer}>
                  <span style={styles.titleCopy}>{content.label.error}</span>
                  <div style={styles.copyContainer}>
                    <CopyToClipboard
                      text={JSON.stringify(errorlog?.deploymentOutputLog)}
                      onCopy={() => {
                        handleCopyErrorMsg();
                      }}
                    >
                      <span style={styles.copy}>{content.button.copy}</span>
                    </CopyToClipboard>
                  </div>
                </div>
              ),
              maskClosable: true,
              icon: <></>,
              width: '35%',
              content: !!errorLogsCollapseItems && (
                <Collapse
                  setContentFontColorToOrangeBecauseHistoryIsCruel
                  bordered
                  items={filterNotNullOrUndefined(errorLogsCollapseItems)}
                />
              ),
            });
          }}
        >
          {content.subtitle.failed}
        </ConfigButton>
      );
    }

    return (
      <div>
        {genPreviewResult(editorStore.editorPlatform, result)}
        <div style={styles.subtitleContainer}>
          <span style={styles.subtitleText}>{subtitle}</span>
        </div>
      </div>
    );
  };

  const { editorPlatform } = editorStore;
  const uploadProject = async () => {
    if (editorPlatform === ZedSupportedPlatform.WECHAT && wechatEnabled) {
      return projectConfig?.wechatAppConfig?.wechatAppId
        ? uft(UserFlow.UPLOAD_WECHAT_PROJECT)()
        : setRemindWechat(true);
    }
    if (editorPlatform === ZedSupportedPlatform.MOBILE_WEB && mobileWebEnabled) {
      return uft(UserFlow.UPLOAD_WEB_PROJECT)();
    }
    return undefined;
  };

  const steps = Object.values(ProjectProgressStep)
    .filter((value) => value !== ProjectProgressStep.FAILED)
    .map((value) => ({
      title: translateProgressStep(value),
    }));
  return (
    <>
      <div style={{ ...SharedStyles.container }}>
        <Row justify="space-between">
          <Col>
            <LeftDrawerTitle containerStyle={styles.width}>{content.title}</LeftDrawerTitle>
          </Col>
          <Col>
            <Row>
              {!dryRunSuccessful && (
                <ConfigButton
                  zedType="outline"
                  onClick={() => {
                    setValidationResultsVisible(true);
                  }}
                  style={styles.width}
                >
                  {content.button.history}
                </ConfigButton>
              )}
              <span style={{ padding: 4 }} />
              <ConfigButton
                zedType="outline"
                loading={isUploading || dryRunStore.isRunning}
                onClick={() => {
                  dryRunStore.executeDryRun(projectExId).then(() => {
                    // We're reading from the dryRunStore here again, rather
                    // than using `dryRunSuccessful` from the component,
                    // because when dry run finishes here, the component
                    // hasn't had a chance to rerender, so `dryRunSuccessful`
                    // variable is actually out-of-date.
                    if (dryRunStore.isCleanCompile) {
                      uploadProject();
                    }
                    setValidationResultsVisible(!dryRunStore.isCleanCompile);
                  });
                  setValidationResultsVisible(true);
                }}
                style={styles.width}
              >
                {currentStep ? content.button.retry : content.button.preview}
              </ConfigButton>
            </Row>
          </Col>
        </Row>
        <div style={styles.content}>
          <div style={styles.progressContainer}>
            <PublishProgressBar
              steps={steps}
              currentStep={Object.values(ProjectProgressStep).findIndex(
                (value) => value === currentStep
              )}
              direction="horizontal"
            />
          </div>
          {renderResult()}
        </div>
      </div>
      {validationResultsVisible && (
        <ZDryRun
          runPackaging={() => uploadProject()}
          onClose={() => setValidationResultsVisible(false)}
        />
      )}
      <Modal
        visible={remindWechat}
        onOk={() => {
          setRemindWechat(false);
          getPreAuthPageUrl(client, projectExId);
        }}
        onCancel={() => {
          setRemindWechat(false);
        }}
      >
        <div>{content.label.remindWechat}</div>
      </Modal>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  title: {
    fontSize: '16px',
    color: ZThemedColors.ACCENT,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '36px 26px 30px 26px',
    width: '100%',
  },

  // progress bar
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  // others
  qrCodeContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '30px auto 10px',
    width: '140px',
    height: '140px',
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.LARGE,
    overflow: 'hidden',
  },
  qrCodeImage: {
    width: '100%',
    height: '100%',
  },
  subtitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36px',
  },
  mobileWebUrlContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30px',
  },
  subtitleText: {
    fontSize: '12px',
    color: ZColors.WHITE,
    textAlign: 'center',
  },
  width: {
    width: 'auto',
  },
  subContainer: {
    zIndex: 1,
    position: 'fixed',
    top: '94px',
    left: '448px',
    width: '308px',
    height: 'auto',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.PRIMARY,
    overflow: 'hidden',
  },
  innerSubContainer: {
    padding: '18px',
  },
  titleCopyContainer: {
    width: '100%',
    height: '50px',
  },
  titleCopy: {
    fontSize: '16px',
    color: ZThemedColors.ACCENT,
  },
  copyContainer: {
    paddingRight: '0px',
    cursor: 'pointer',
    float: 'right',
  },
  copy: {
    fontSize: '12px',
    color: '#2298FF',
  },
};
