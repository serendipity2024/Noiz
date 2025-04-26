/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { ProjectAuditDetails } from '../mobx/stores/ProjectStore';
import useStores from './useStores';

export default function useProjectAuditDetails(): ProjectAuditDetails {
  const { projectStore } = useStores();
  return useObserver(() => projectStore.auditDetails ?? {}) as ProjectAuditDetails;
}
