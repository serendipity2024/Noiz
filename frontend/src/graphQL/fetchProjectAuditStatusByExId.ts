/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import { AllStores } from '../mobx/StoreContexts';
import GQL_WECHAT_AUDIT_FRAGMENT from './fragments/wechatAuditFragment';
import { FetchProjectAuditStatusByExId_latestAuditStatus } from './__generated__/FetchProjectAuditStatusByExId';

const GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID = gql`
  query FetchProjectAuditStatusByExId($projectExId: String!) {
    latestAuditStatus(projectExId: $projectExId) {
      ...WechatAuditFragment
    }
  }
  ${GQL_WECHAT_AUDIT_FRAGMENT}
`;

export default GQL_FETCH_PROJECT_AUDIT_STATUS_BY_EX_ID;

export const updateProjectAuditStatus = (
  latestAuditStatus: FetchProjectAuditStatusByExId_latestAuditStatus | null
): void => {
  const { auditId, status: auditStatus, createdAt, reason, published } = latestAuditStatus ?? {};
  if (!auditId || !auditStatus) AllStores.projectStore.updateAuditDetails(null);
  else
    AllStores.projectStore.updateAuditDetails({
      auditId,
      auditStatus,
      createdAt: new Date(createdAt).toLocaleString(),
      reason: reason ?? null,
      published: published ?? false,
    });
};
