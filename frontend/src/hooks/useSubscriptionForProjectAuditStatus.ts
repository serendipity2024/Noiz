/* eslint-disable import/no-default-export */
import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { GQL_ON_WECHAT_PROGRAM_AUDIT_STATUS_UPDATE } from '../graphQL/wechatAPI';
import { OnWechatMiniProgramAuditStatusUpdate } from '../graphQL/__generated__/OnWechatMiniProgramAuditStatusUpdate';
import useProjectDetails from './useProjectDetails';
import useStores from './useStores';

export default function useSubscriptionForProjectAuditStatus(): void {
  const { projectStore } = useStores();
  const { projectExId } = useProjectDetails();
  const { data } = useSubscription(GQL_ON_WECHAT_PROGRAM_AUDIT_STATUS_UPDATE, {
    skip: !projectExId,
    variables: { projectExId },
  });

  useEffect(() => {
    const {
      auditId,
      status: auditStatus,
      reason,
      createdAt,
      published,
    } = (data as OnWechatMiniProgramAuditStatusUpdate)?.onWechatMiniProgramAuditStatusUpdate ?? {};
    if (!auditId || !auditStatus) projectStore.updateAuditDetails(null);
    else
      projectStore.updateAuditDetails({
        auditId,
        auditStatus,
        reason: reason ?? null,
        createdAt: new Date(createdAt ?? 0).toLocaleString(),
        published: published ?? false,
      });
  }, [data, projectStore]);
}
