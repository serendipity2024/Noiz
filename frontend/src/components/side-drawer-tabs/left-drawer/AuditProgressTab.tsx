/* eslint-disable import/no-default-export */
import React, { CSSProperties } from 'react';
import { useQuery } from '@apollo/client';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import useLocale from '../../../hooks/useLocale';
import i18n from './AuditProgressTab.i18n.json';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import { ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import { AuditStatus } from '../../../graphQL/__generated__/globalTypes';
import useUserFlowTrigger, { UserFlow } from '../../../hooks/useUserFlowTrigger';
import useProjectDeploymentStatus from '../../../hooks/useProjectDeploymentStatus';
import { ProjectProgressStep } from './PublishProgressTab';
import useProjectAuditDetails from '../../../hooks/useProjectAuditDetails';
import GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID, {
  updateProjectAuditStatus,
} from '../../../graphQL/fetchProjectAuditStatusByExId';
import useProjectDetails from '../../../hooks/useProjectDetails';
import { FetchProjectAuditStatusByExId } from '../../../graphQL/__generated__/FetchProjectAuditStatusByExId';
import SharedStyles, { GridGutter, GridWidth } from './project-config/SharedStyles';
import ConfigButton from './shared/ConfigButton';
import { Col, Row, ZInput } from '../../../zui';

export enum ProjectAuditStatus {
  IN_REVIEW,
  REJECTED,
  SUCCESS,
  WITHDRAWN,
}

export default function AuditProgressTab(): NullableReactElement {
  const uft = useUserFlowTrigger();
  const deploymentStatus = useProjectDeploymentStatus();
  const { localizedContent: content } = useLocale(i18n);
  const { auditId, auditStatus, reason, createdAt, published } = useProjectAuditDetails();
  const { projectExId, projectConfig } = useProjectDetails();

  useQuery(GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID, {
    variables: { projectExId },
    skip: !projectExId,
    onCompleted: (data) => {
      const { latestAuditStatus } = data as FetchProjectAuditStatusByExId;
      updateProjectAuditStatus(latestAuditStatus);
    },
  });

  const [buttonText, statusText] = (() => {
    switch (auditStatus) {
      case AuditStatus.REJECTED:
        return [content.button.retry, content.status.rejected];
      case AuditStatus.IN_REVIEW:
        return [content.button.review, ''];
      case AuditStatus.SUCCESS:
        return published
          ? [content.button.default, '']
          : [content.button.retry, content.status.success];
      default:
        return [content.button.default, ''];
    }
  })();

  const buttonDisabled =
    !projectConfig?.wechatAppConfig?.hasGrantedThirdPartyAuthorization ||
    deploymentStatus?.progressStep !== ProjectProgressStep.READY ||
    auditStatus === AuditStatus.IN_REVIEW;

  return (
    <div style={{ ...SharedStyles.container }}>
      <Row justify="space-between" gutter={GridGutter.default}>
        <Col>
          <LeftDrawerTitle containerStyle={styles.width} textStyle={styles.subtitle}>
            {content.title}
          </LeftDrawerTitle>
        </Col>
        <Col>
          <ConfigButton
            zedType="outline"
            disabled={buttonDisabled}
            onClick={uft(UserFlow.SUBMIT_PREVIEW)}
            style={styles.width}
          >
            {buttonText}
          </ConfigButton>
        </Col>
      </Row>
      <Row gutter={GridGutter.default}>
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle textStyle={styles.subtitle} type="subtitle">
            {content.subtitle.uploadTime}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          <ZInput disabled value={createdAt} />
        </Col>
      </Row>
      <Row gutter={GridGutter.default}>
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle textStyle={styles.subtitle} type="subtitle">
            {content.subtitle.versionNumber}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          <ZInput disabled value={auditId} />
        </Col>
      </Row>
      <Row gutter={GridGutter.default}>
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle textStyle={styles.subtitle} type="subtitle">
            {content.subtitle.auditSituation}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          <ZInput disabled value={statusText} />
        </Col>
      </Row>
      <Row gutter={GridGutter.default}>
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle textStyle={styles.subtitle} type="subtitle">
            {content.subtitle.auditFailureReason}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          {reason ? (
            <div
              style={{ ...SharedStyles.input, ...styles.input }}
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: reason ?? '' }}
            />
          ) : (
            <ZInput disabled value="" />
          )}
        </Col>
      </Row>

      {/* TODO: wait for backend <p style={styles.text}>{screenshot}</p> */}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '24px',
    padding: '36px 26px 30px 26px',
    width: '100%',
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  subtitle: {
    fontSize: '14px',
  },
  width: {
    width: 'auto',
  },
  text: {
    color: ZThemedColors.SECONDARY_TEXT,
  },
};
