/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import { ProjectDeploymentStatus } from '../mobx/stores/ProjectStore';
import useStores from './useStores';

export default function useProjectDeploymentStatus(): ProjectDeploymentStatus | null {
  const { projectStore } = useStores();
  return useObserver(() => projectStore.deploymentStatus);
}
